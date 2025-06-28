package token

import (
	"context"
	"log"
	"os"
	"time"

	database "ecommerce-project/database"

	jwt "github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SignedDetails struct {
	Email      string
	First_Name string
	Last_Name  string
	Uid        string
	jwt.StandardClaims
}

// Get the secret key with a fallback if not set
func getSecretKey() string {
	key := os.Getenv("SECRET_LOVE")
	if key == "" {
		log.Println("WARNING: SECRET_LOVE not set. Using default fallback key.")
		key = "fallback_secret_key" // use only for local/testing
	}
	return key
}

var SECRET_KEY = getSecretKey()

var UserData *mongo.Collection

func InitUserCollection(client *mongo.Client) {
	UserData = database.UserData(client, "Users")
}

func TokenGenerator(email string, firstname string, lastname string, uid string) (signedtoken string, signedrefreshtoken string, err error) {
	claims := &SignedDetails{
		Email:      email,
		First_Name: firstname,
		Last_Name:  lastname,
		Uid:        uid,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * 24).Unix(),
		},
	}
	refreshclaims := &SignedDetails{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * 168).Unix(),
		},
	}
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", "", err
	}
	refreshtoken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshclaims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		log.Println("Error generating refresh token:", err)
		return
	}
	return token, refreshtoken, err
}

func ValidateToken(signedtoken string) (claims *SignedDetails, msg string) {
	token, err := jwt.ParseWithClaims(signedtoken, &SignedDetails{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SECRET_KEY), nil
	})
	if err != nil {
		msg = err.Error()
		return
	}
	claims, ok := token.Claims.(*SignedDetails)
	if !ok {
		msg = "The Token is invalid"
		return
	}
	if claims.ExpiresAt < time.Now().Local().Unix() {
		msg = "token is expired"
		return
	}
	return claims, msg
}

func UpdateAllTokens(signedtoken string, signedrefreshtoken string, userid string) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	if UserData == nil {
		log.Println("UserData collection is not initialized.")
		return
	}

	updateobj := bson.D{
		{Key: "token", Value: signedtoken},
		{Key: "refresh_token", Value: signedrefreshtoken},
		{Key: "updatedat", Value: time.Now()},
	}
	filter := bson.M{"user_id": userid}
	upsert := true
	opt := options.UpdateOptions{Upsert: &upsert}

	_, err := UserData.UpdateOne(ctx, filter, bson.D{{Key: "$set", Value: updateobj}}, &opt)
	if err != nil {
		log.Println("Failed to update tokens:", err)
	}
}
