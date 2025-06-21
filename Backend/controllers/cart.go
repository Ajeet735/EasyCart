package controllers

import (
	"context"
	database "ecommerce-project/database"
	models "ecommerce-project/models"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Application struct {
	prodCollection *mongo.Collection
	userCollection *mongo.Collection
}

func NewApplication(prodCollection, userCollection *mongo.Collection) *Application {
	return &Application{
		prodCollection: prodCollection,
		userCollection: userCollection,
	}
}

func (app *Application) AddToCart() gin.HandlerFunc {
	return func(c *gin.Context) {
		productQueryID := c.Query("id")
		if productQueryID == "" {
			log.Println("product id is empty")
			_ = c.AbortWithError(http.StatusBadRequest, errors.New("product id is empty"))
			return
		}

		uidRaw, uidExists := c.Get("uid")
		if !uidExists {
			log.Println("user id not found in context")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		userQueryID := uidRaw.(string)

		productID, err := primitive.ObjectIDFromHex(productQueryID)
		if err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		// First check if the product is already in the user's cart
		filter := bson.M{"user_id": userQueryID, "usercart._id": productID}
		update := bson.M{"$inc": bson.M{"usercart.$.quantity": 1}}
		result, err := app.userCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			log.Println("Error while incrementing quantity:", err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		if result.ModifiedCount == 0 {
			// Product not in cart, so add it
			var product models.Product
			err = app.prodCollection.FindOne(ctx, bson.M{"_id": productID}).Decode(&product)
			if err != nil {
				log.Println("Product not found:", err)
				c.AbortWithStatus(http.StatusNotFound)
				return
			}

			cartItem := models.ProductUser{
				Product_ID:   product.Product_ID,
				Product_Name: &product.Product_Name,
				Price:        int(product.Price),
				Rating:       &product.Rating,
				Image:        &product.Image,
				Quantity:     1, // Initial quantity
			}

			addToCartFilter := bson.M{"user_id": userQueryID}
			addToCartUpdate := bson.M{"$push": bson.M{"usercart": cartItem}}
			_, err := app.userCollection.UpdateOne(ctx, addToCartFilter, addToCartUpdate)
			if err != nil {
				log.Println("Error adding new item to cart:", err)
				c.AbortWithStatus(http.StatusInternalServerError)
				return
			}
		}

		c.IndentedJSON(http.StatusOK, gin.H{"message": "Successfully Added to the cart"})
	}
}

func GetCartCount() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user ID from token claims (set by middleware)
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var user models.User
		err := UserCollection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"count": len(user.UserCart)})
	}
}

func UpdateCartQuantity() gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			UserID    string `json:"userId"`
			ProductID string `json:"productId"`
			Quantity  int    `json:"quantity"`
		}

		if err := c.ShouldBindJSON(&body); err != nil {
			fmt.Println("Bind error:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}
		fmt.Printf("✅ Parsed request: userId=%s, productId=%s, quantity=%d\n", body.UserID, body.ProductID, body.Quantity)
		uid, err := primitive.ObjectIDFromHex(body.UserID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		pid, err := primitive.ObjectIDFromHex(body.ProductID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
			return
		}

		// Fetch the user
		var user models.User
		err = UserCollection.FindOne(context.TODO(), bson.M{"_id": uid}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		// Update the product quantity in the cart
		updatedCart := []models.ProductUser{}
		for _, item := range user.UserCart {
			if item.Product_ID == pid {
				item.Quantity = body.Quantity
			}
			updatedCart = append(updatedCart, item)
		}

		// Save the updated cart
		_, err = UserCollection.UpdateOne(
			context.TODO(),
			bson.M{"_id": uid},
			bson.M{"$set": bson.M{"usercart": updatedCart}},
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Quantity updated"})
	}
}

func (app *Application) RemoveItem() gin.HandlerFunc {
	return func(c *gin.Context) {
		productQueryID := c.Query("id")
		if productQueryID == "" {
			log.Println("❌ Product ID is missing")
			c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID is required"})
			return
		}

		userQueryID := c.Query("userID")
		if userQueryID == "" {
			log.Println("❌ User ID is missing")
			c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
			return
		}

		ProductID, err := primitive.ObjectIDFromHex(productQueryID)
		if err != nil {
			log.Println("❌ Invalid product ID:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		err = database.RemoveCartItem(ctx, app.prodCollection, app.userCollection, ProductID, userQueryID)
		if err != nil {
			log.Println("❌ Failed to remove item:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove item"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "✅ Successfully removed from cart"})
	}
}

func GetItemFromCart() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.Query("id")
		if userID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		oid, err := primitive.ObjectIDFromHex(userID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ObjectID"})
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var user models.User
		err = UserCollection.FindOne(ctx, bson.M{"_id": oid}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		// Aggregate total price from cart
		matchStage := bson.D{{Key: "$match", Value: bson.D{{Key: "_id", Value: oid}}}}
		unwindStage := bson.D{{Key: "$unwind", Value: "$usercart"}}
		groupStage := bson.D{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$_id"},
			{Key: "total", Value: bson.D{{Key: "$sum", Value: bson.D{
				{Key: "$multiply", Value: bson.A{"$usercart.price", "$usercart.quantity"}},
			}},
			}},
		}}}

		cursor, err := UserCollection.Aggregate(ctx, mongo.Pipeline{matchStage, unwindStage, groupStage})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Aggregation failed"})
			return
		}

		var result []bson.M
		if err = cursor.All(ctx, &result); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Cursor decode failed"})
			return
		}

		total := 0.0
		if len(result) > 0 {
			if val, ok := result[0]["total"].(float64); ok {
				total = val
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"usercart": user.UserCart,
			"total":    total,
		})
	}
}

func (app *Application) BuyFromCart() gin.HandlerFunc {
	return func(c *gin.Context) {
		userQueryID := c.Query("id")
		if userQueryID == "" {
			log.Panicln("user id is empty")
			_ = c.AbortWithError(http.StatusBadRequest, errors.New("UserID is empty"))
		}
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		err := database.BuyItemFromCart(ctx, app.userCollection, userQueryID)
		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, err)
		}
		c.IndentedJSON(200, "Successfully Placed the order")
	}
}

func (app *Application) InstantBuy() gin.HandlerFunc {
	return func(c *gin.Context) {
		UserQueryID := c.Query("userid")
		if UserQueryID == "" {
			log.Println("UserID is empty")
			_ = c.AbortWithError(http.StatusBadRequest, errors.New("UserID is empty"))
		}
		ProductQueryID := c.Query("pid")
		if ProductQueryID == "" {
			log.Println("Product_ID id is empty")
			_ = c.AbortWithError(http.StatusBadRequest, errors.New("product_id is empty"))
		}
		productID, err := primitive.ObjectIDFromHex(ProductQueryID)
		if err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		err = database.InstantBuyer(ctx, app.prodCollection, app.userCollection, productID, UserQueryID)
		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, err)
		}
		c.IndentedJSON(200, "Successully placed the order")
	}
}
