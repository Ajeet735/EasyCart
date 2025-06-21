package middleware

import (
	"fmt"
	"net/http"

	token "ecommerce-project/tokens"

	"github.com/gin-gonic/gin"
)

func Authentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Try to get token from cookie
		tokenCookie, err := c.Cookie("token")

		var authHeader string
		if err != nil || tokenCookie == "" {
			// Try Authorization header if cookie not found
			authHeader = c.GetHeader("Authorization")
			fmt.Println("🔍 Cookie not found, checking Authorization header:", authHeader)

			if authHeader == "" {
				fmt.Println("❌ No token in cookie or header")
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: No token provided"})
				c.Abort()
				return
			}

			const bearerPrefix = "Bearer "
			if len(authHeader) <= len(bearerPrefix) || authHeader[:len(bearerPrefix)] != bearerPrefix {
				fmt.Println("❌ Invalid Bearer token format")
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Invalid token format"})
				c.Abort()
				return
			}

			tokenCookie = authHeader[len(bearerPrefix):]
		}

		fmt.Println("✅ Token received:", tokenCookie)

		claims, errStr := token.ValidateToken(tokenCookie)
		if errStr != "" {
			fmt.Println("❌ Token validation failed:", errStr)
			c.JSON(http.StatusUnauthorized, gin.H{"error": errStr})
			c.Abort()
			return
		}

		fmt.Println("✅ Token validated. Claims:", claims)
		fmt.Println("✅ Setting context: email =", claims.Email, ", uid =", claims.Uid)

		c.Set("email", claims.Email)
		c.Set("uid", claims.Uid)
		c.Next()
	}
}
