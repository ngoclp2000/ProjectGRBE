import BaseModel from "../baseModel.js";
import DataTypes from "../../shared/enums/dataType.js";

import ProductDetail from "./productDetail.js";
import ProductFeedback from "./productFeedback.js";
import ProductImage from "./productImage.js";
import ProductUnitType from "./productUnitType.model.js";

import Category from "../category.js";
import User from "../user.model.js";

export default class Product extends BaseModel {
    constructor() {
        let data = {};
        data.table = 'product';
        data.idField = 'productId';
        super(data);
        this.alias = 'p';
        this.relationField = 'categoryId';
        this.imageTable = 'productimage';
        this.unitTypeTable = 'productunittype';
        this.groupCategoryTable = 'groupcategory';
        this.categoryTable = 'category';

        this.fields = {
            productId:{
                type: DataTypes.String,
            },
            productCode: {
                type: DataTypes.String,
            },
            productName: {
                type: DataTypes.String,
            },
            productPrice: {
                type: DataTypes.Number,
            },
            productDiscount: {
                type: DataTypes.Number,
            },
            productDescription: {
                type: DataTypes.String,
            },
            productStatus: {
                type: DataTypes.Boolean,
            },
            productQuantity: {
                type: DataTypes.Number,
            },
            categoryId:{
                type: DataTypes.String
            },
            productRate:{
                type: DataTypes.Number
            },
            userId:{
                type: DataTypes.String
            },
            productUnitTypeId:{
                type: DataTypes.String,
            }
        }
        // 0: only Product, 1: Product and Order
        this.relationTable = [{
            model : ProductFeedback.getInstance(),
            foreignKey : 'productId',
            type: 0
        },{
            model : ProductDetail.getInstance(),
            foreignKey : 'productId',
            type: 0
        },{
            model : ProductImage.getInstance(),
            foreignKey : 'productId',
            type: 0,
            parallelAdd: true
        },{
            model: User.getInstance(),
            foreignKey: 'userId',
            type: 0
        },{
            model: ProductUnitType.getInstance(),
            foreignKey: 'productUnitTypeId',
            type : 0
        },{
            model: Category.getInstance(),
            foreignKey: 'categoryId',
            type: 0
        }]
    }

    static getInstance(){
        if(this.instance == null){
            this.instance = new Product();
        }
        return this.instance;
    }
}