import BaseModel from "../baseModel.js";
import DataTypes from "../../shared/enums/dataType.js";

export default class ProductImage extends BaseModel {
    constructor(){
        let data = {};
        data.idField = 'productImageId';
        data.table = 'productimage';
        super(data);
        this.alias = 'pi';
        this.fields = {
            productImageLink: {
                type: DataTypes.String,
                name: 'productImageLink'
            },
            productImageId:{
                type: DataTypes.String,
                name: 'productImageId'
            },
            productId:{
                type: DataTypes.String,
                name: 'productId'
            }
        }
    }
    static getInstance(){
        if(this.instance == null){
            this.instance = new ProductImage();
        }
        return this.instance;
    }
}