package controllers

import (
	"ecommerce-project/database"
	"ecommerce-project/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CheckAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		uidRaw, uidExists := c.Get("uid")
		emailRaw, emailExists := c.Get("email")

		if !uidExists || !emailExists {
			c.JSON(401, gin.H{"error": "Unauthorized: No user in context"})
			return
		}

		uid := uidRaw.(string)
		email := emailRaw.(string)

		objectID, err := primitive.ObjectIDFromHex(uid)
		if err != nil {
			c.JSON(500, gin.H{"error": "Invalid user ID format"})
			return
		}

		userCollection := database.UserData(database.Client, "Users")
		var user models.User
		err = userCollection.FindOne(c, bson.M{"_id": objectID}).Decode(&user)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to fetch user"})
			return
		}

		c.JSON(200, gin.H{
			"success": true,
			"user":    user,
			"email":   email,
		})
	}
}
