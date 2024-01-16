package controller

import (
	"vegan/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProductController struct {
	db          *gorm.DB
	productRepo model.VeganProductRepo
}

func NewProductController(db *gorm.DB) (*ProductController, error) {
	return &ProductController{
		db:          db,
		productRepo: &model.VeganProductRepoMysql{},
	}, nil
}
func (p *ProductController) Register(r *gin.Engine) {
	r.GET("/api/product", p.ListProducts)
	r.POST("/api/product", p.CreateProduct)
	r.PUT("/api/product", p.UpdateProduct)
	r.DELETE("/api/product", p.DeleteProduct)
}
func (p *ProductController) ListProducts(c *gin.Context) {
	res, err := p.productRepo.ListVeganProduct(p.db)
	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(200, res)
}

func (p *ProductController) CreateProduct(c *gin.Context) {
	var product model.VeganProduct
	if err := c.ShouldBind(&product); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}
	err := p.productRepo.CreateVeganProduct(p.db, &product)
	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"msg": "ok",
	})
}
func (p *ProductController) UpdateProduct(c *gin.Context) {
	var product model.VeganProduct
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}
	err := p.productRepo.UpdateVeganProductById(p.db, &product)
	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"msg": "ok",
	})
}
func (p *ProductController) DeleteProduct(c *gin.Context) {
	var product model.VeganProduct
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	err := p.productRepo.DeleteVeganProductById(p.db, product.ID)
	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"msg": "ok",
	})
}
