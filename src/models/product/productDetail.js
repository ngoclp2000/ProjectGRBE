import BaseModel from "../baseModel.js";
import DataTypes from "../../shared/enums/dataType.js";

export default class ProductDetail extends BaseModel {
    constructor(){
        let data = {};
        data.idField = 'productDetailId';
        data.table = 'productdetail';
        super(data);
        this.alias = 'pd';
        this.fields = {
            productDetailOrigin: {
                type: DataTypes.String
            },
            productDetailIngredient: {
                type: DataTypes.String
            },
            productDetailGuide: {
                type: DataTypes.String
            },
            productDetailOrigin: {
                type: DataTypes.String
            },
        }
        
    }
    static getInstance(){
        if(this.instance == null){
            this.instance = new ProductDetail();
        }
        return this.instance;
    }
}