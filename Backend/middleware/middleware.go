package middleware

import (
	"fmt"
	"net/http"

	token "ecommerce-project/tokens"

	"github.com/gin-gonic/gin"
)

func Authentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenCookie, err := c.Cookie("token")
		if err != nil {
			fmt.Println("❌ No token cookie found:", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		fmt.Println("✅ Token from cookie:", tokenCookie)

		claims, errStr := token.ValidateToken(tokenCookie)
		if errStr != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": errStr})
			c.Abort()
			return
		}

		c.Set("email", claims.Email)
		c.Set("uid", claims.Uid)
		c.Next()
	}
}
