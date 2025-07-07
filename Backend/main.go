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
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	token.InitUserCollection(database.Client)

	app := controllers.NewApplication(
		database.ProductData(database.Client, "Products"),
		database.UserData(database.Client, "Users"),
	)

	router := gin.Default()

	if err := router.SetTrustedProxies([]string{"127.0.0.1"}); err != nil {
		log.Fatal(err)
	}

	// ✅ CORS Setup
	allowOrigins := []string{
		"http://localhost:3000",
		"http://localhost:3001",
	}
	if gin.Mode() == gin.ReleaseMode {
		allowOrigins = []string{"https://easycart-frontend.vercel.app"}
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// ✅ Handle preflight CORS requests
	router.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(200)
	})

	// Routes
	router.GET("/api/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	routes.UserRoutes(router)

	// ✅ Auth-protected routes
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
