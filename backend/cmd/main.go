package main

import (
	"os"
	"vegan/controller"
	"vegan/model"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	// health check
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	// docker run -it -p 3306:3306 mysql:8.0 -e MYSQL_ROOT_PASSWORD=123456
	// "root:123456@tcp(192.168.0.100:3306)/vegan?charset=utf8mb4&parseTime=True&loc=Local"
	dsn := os.Getenv("DSN")
	db, err := model.InitDB(dsn)
	if err != nil {
		panic(err)
	}
	controller, err := controller.NewProductController(db)
	if err != nil {
		panic(err)
	}
	controller.Register(r)

	r.Run(":8080") // listen and serve on 0.0.0.0:8080
}
