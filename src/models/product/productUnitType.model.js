import BaseModel from "../baseModel.js";
import DataTypes from "../../shared/enums/dataType.js";

export default class ProductUnitType extends BaseModel {
    constructor(){
        let data = {};
        data.idField = 'productUnitTypeId';
        data.table = 'productunittype';
        super(data);
        this.alias = 'pl';
        this.fields = {
            productUnitTypeName: {
                type: DataTypes.String
            },
        }
    }
    static getInstance(){
        if(this.instance == null){
            this.instance = new ProductUnitType();
        }
        return this.instance;
    }
}