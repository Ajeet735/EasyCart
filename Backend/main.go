package main

import (
	"ecommerce-project/controllers"
	"ecommerce-project/database"
	"ecommerce-project/middleware"
	"ecommerce-project/routes"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	app := controllers.NewApplication(
		database.ProductData(database.Client, "Products"),
		database.UserData(database.Client, "Users"),
	)

	router := gin.Default()

	err := router.SetTrustedProxies([]string{"127.0.0.1"})
	if err != nil {
		log.Fatal(err)
	}

	// CORS config for React frontend
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Public routes (no auth)
	router.GET("/api/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})
	routes.UserRoutes(router)
	router.Use(middleware.Authentication())

	// Protected routes
	router.GET("/addtocart", app.AddToCart())
	router.GET("/removeitem", app.RemoveItem())
	router.GET("/listcart", controllers.GetItemFromCart())
	router.POST("/addaddress", controllers.AddAddress())
	router.PUT("/edithomeaddress", controllers.EditHomeAddress())
	router.PUT("/editworkaddress", controllers.EditWorkAddress())
	router.GET("/deleteaddresses", controllers.DeleteAddress())
	router.GET("/cartcheckout", app.BuyFromCart())
	router.GET("/instantbuy", app.InstantBuy())

	log.Println("Server running on port", port)
	log.Fatal(router.Run(":" + port))
}
