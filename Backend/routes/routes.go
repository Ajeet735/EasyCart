package routes

import (
	controllers "ecommerce-project/controllers"
	middleware "ecommerce-project/middleware"

	"github.com/gin-gonic/gin"
)

func UserRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.POST("/users/signup", controllers.SignUp())
	incomingRoutes.POST("/users/login", controllers.Login())
	incomingRoutes.POST("/users/logout", middleware.Authentication(), controllers.Logout())
	incomingRoutes.GET("/users/productbycategory", controllers.GetProductsByCategory())
	incomingRoutes.GET("/users/getAllproducts", controllers.GetAllProducts())
	incomingRoutes.POST("/admin/addproduct", controllers.ProductViewerAdmin())
	incomingRoutes.GET("/users/search", controllers.SearchProductByQuery())
	incomingRoutes.DELETE("/users/product/:id", controllers.DeleteProduct())

	incomingRoutes.GET("/users/check-auth", middleware.Authentication(), controllers.CheckAuth())
}
