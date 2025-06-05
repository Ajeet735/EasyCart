package controllers

import (
	"context"
	database "ecommerce-project/database"
	models "ecommerce-project/models"
	generate "ecommerce-project/tokens"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var UserCollection *mongo.Collection = database.UserData(database.Client, "Users")
var ProductCollection *mongo.Collection = database.ProductData(database.Client, "Products")
var Validate = validator.New()

func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Panic(err)
	}
	return string(bytes)
}

func VerifyPassword(userpassword string, givenpassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(givenpassword), []byte(userpassword))
	valid := true
	msg := ""
	if err != nil {
		msg = "Login Or Passowrd is Incorerct"
		valid = false
	}
	return valid, msg
}

func SignUp() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var user models.User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		validationErr := Validate.Struct(user)
		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr})
			return
		}

		// Check if email already exists
		count, err := UserCollection.CountDocuments(ctx, bson.M{"email": user.Email})
		if err != nil {
			log.Panic(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
			return
		}

		// Check if phone already exists
		count, err = UserCollection.CountDocuments(ctx, bson.M{"phone": user.Phone})
		if err != nil {
			log.Panic(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Phone is already in use"})
			return
		}

		// ✅ Set default role to "User"
		if user.Role == nil || *user.Role == "" {
			defaultRole := "User"
			user.Role = &defaultRole
		}

		password := HashPassword(*user.Password)
		user.Password = &password

		user.Created_At, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.Updated_At, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.ID = primitive.NewObjectID()
		user.User_ID = user.ID.Hex()

		token, refreshtoken, _ := generate.TokenGenerator(*user.Email, *user.First_Name, *user.Last_Name, user.User_ID)
		user.Token = &token
		user.Refresh_Token = &refreshtoken
		user.UserCart = make([]models.ProductUser, 0)
		user.Address_Details = make([]models.Address, 0)
		user.Order_Status = make([]models.Order, 0)

		_, inserterr := UserCollection.InsertOne(ctx, user)
		if inserterr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "not created"})
			return
		}

		c.JSON(http.StatusCreated, "Successfully Signed Up!!")
	}
}

func Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		var user models.User
		var founduser models.User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
		err := UserCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&founduser)
		defer cancel()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "login or password incorrect"})
			return
		}
		PasswordIsValid, msg := VerifyPassword(*user.Password, *founduser.Password)
		if !PasswordIsValid {
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			fmt.Println(msg)
			return
		}

		token, refreshToken, _ := generate.TokenGenerator(*founduser.Email, *founduser.First_Name, *founduser.Last_Name, founduser.User_ID)
		generate.UpdateAllTokens(token, refreshToken, founduser.User_ID)

		c.SetCookie("token", token, 3600*24, "/", "localhost", false, true)                  // Expires in 1 day
		c.SetCookie("refresh_token", refreshToken, 3600*24*7, "/", "localhost", false, true) // Expires in 7 days

		c.JSON(http.StatusOK, gin.H{
			"message":    "Login successful",
			"first_name": founduser.First_Name,
			"user_id":    founduser.User_ID,
			"role":       founduser.Role,
			"email":      founduser.Email,
		})

	}
}

func Logout() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Try to read the token from cookie
		tokenCookie, err := c.Cookie("token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token cookie found"})
			return
		}
		fmt.Println("Token from cookie:", tokenCookie)

		// 2. Extract user ID from context (set by auth middleware)
		userId, exists := c.Get("uid")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		uid, ok := userId.(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user id"})
			return
		}

		// 3. Clear the tokens from DB
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		filter := bson.M{"user_id": uid}
		update := bson.M{
			"$set": bson.M{
				"token":         "",
				"refresh_token": "",
			},
		}

		_, err = UserCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			fmt.Println("Logout UpdateOne error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to logout"})
			return
		}

		// 4. Clear cookies
		c.SetCookie("token", "", -1, "/", "localhost", false, true)
		c.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)

		c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
	}
}

func ProductViewerAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var products models.Product
		defer cancel()
		if err := c.BindJSON(&products); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		products.Product_ID = primitive.NewObjectID()
		_, anyerr := ProductCollection.InsertOne(ctx, products)
		if anyerr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Not Created"})
			return
		}
		defer cancel()
		c.JSON(http.StatusOK, "Successfully added our Product Admin!!")
	}
}

func SearchProduct() gin.HandlerFunc {
	return func(c *gin.Context) {
		var productlist []models.Product
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		cursor, err := ProductCollection.Find(ctx, bson.D{{}})
		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, "Someting Went Wrong Please Try After Some Time")
			return
		}
		err = cursor.All(ctx, &productlist)
		if err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		defer cursor.Close(ctx)
		if err := cursor.Err(); err != nil {
			// Don't forget to log errors. I log them really simple here just
			// to get the point across.
			log.Println(err)
			c.IndentedJSON(400, "invalid")
			return
		}
		defer cancel()
		c.IndentedJSON(200, productlist)

	}
}

func SearchProductByQuery() gin.HandlerFunc {
	return func(c *gin.Context) {
		var searchproducts []models.Product
		queryParam := c.Query("name")
		if queryParam == "" {
			log.Println("query is empty")
			c.Header("Content-Type", "application/json")
			c.JSON(http.StatusNotFound, gin.H{"Error": "Invalid Search Index"})
			c.Abort()
			return
		}
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		searchquerydb, err := ProductCollection.Find(ctx, bson.M{"product_name": bson.M{"$regex": queryParam}})
		if err != nil {
			c.IndentedJSON(404, "something went wrong in fetching the dbquery")
			return
		}
		err = searchquerydb.All(ctx, &searchproducts)
		if err != nil {
			log.Println(err)
			c.IndentedJSON(400, "invalid")
			return
		}
		defer searchquerydb.Close(ctx)
		if err := searchquerydb.Err(); err != nil {
			log.Println(err)
			c.IndentedJSON(400, "invalid request")
			return
		}
		defer cancel()
		c.IndentedJSON(200, searchproducts)
	}
}
