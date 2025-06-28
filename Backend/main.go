package main

import (
	"ecommerce-project/controllers"
	"ecommerce-project/database"
	"ecommerce-project/middleware"
	"ecommerce-project/routes"
	"ecommerce-project/tokens"
	"log"
	"os"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	// ✅ Init the token package after DB is connected
	token.InitUserCollection(database.Client)

	app := controllers.NewApplication(
		database.ProductData(database.Client, "Products"),
		database.UserData(database.Client, "Users"),
	)

	router := gin.Default()

	err := router.SetTrustedProxies([]string{"127.0.0.1"})
	if err != nil {
		log.Fatal(err)
	}

	// CORS config
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.GET("/api/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})
	routes.UserRoutes(router)

	router.POST("/addtocart", middleware.Authentication(), app.AddToCart())
	router.DELETE("/removeitem", middleware.Authentication(), app.RemoveItem())
	router.GET("/listcart", middleware.Authentication(), controllers.GetItemFromCart())
	router.POST("/addaddress", middleware.Authentication(), controllers.AddAddress())
	router.PUT("/edithomeaddress", middleware.Authentication(), controllers.EditHomeAddress())
	router.PUT("/editworkaddress", middleware.Authentication(), controllers.EditWorkAddress())
	router.DELETE("/deleteaddresses", middleware.Authentication(), controllers.DeleteAddress())
	router.POST("/cartcheckout", middleware.Authentication(), app.BuyFromCart())
	router.POST("/instantbuy", middleware.Authentication(), app.InstantBuy())
	router.GET("/users/cart-count", middleware.Authentication(), controllers.GetCartCount())
	router.PUT("/update-cart-quantity", middleware.Authentication(), controllers.UpdateCartQuantity())

	router.Static("/public", filepath.Join(".", "public"))

	log.Println("Server running on port", port)
	log.Fatal(router.Run(":" + port))
}
