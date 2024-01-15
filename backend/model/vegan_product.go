package model

import (
	"gorm.io/gorm"
)

type VeganProduct struct {
	ID      int     `gorm:"primarykey;autoIncrement" json:"id"`
	Name    string  `json:"name"`
	Price   float64 `json:"price"`
	Comment string  `json:"comment"`
}
type VeganProductRepo interface {
	CreateVeganProduct(txn *gorm.DB, product *VeganProduct) error
	ListVeganProduct(txn *gorm.DB) ([]*VeganProduct, error)
	UpdateVeganProductById(txn *gorm.DB, product *VeganProduct) error
	DeleteVeganProductById(txn *gorm.DB, id int) error
}
type VeganProductRepoMysql struct{}

func (*VeganProductRepoMysql) CreateVeganProduct(txn *gorm.DB, product *VeganProduct) error {
	result := txn.Create(product)
	return result.Error
}

func (*VeganProductRepoMysql) ListVeganProduct(txn *gorm.DB) ([]*VeganProduct, error) {
	res := make([]*VeganProduct, 0)
	result := txn.Find(&res)
	return res, result.Error
}

func (*VeganProductRepoMysql) UpdateVeganProductById(txn *gorm.DB, product *VeganProduct) error {
	result := txn.Model(product).Select("*").Updates(product)
	return result.Error
}

func (*VeganProductRepoMysql) DeleteVeganProductById(txn *gorm.DB, id int) error {
	result := txn.Delete(&VeganProduct{}, id)
	return result.Error
}
