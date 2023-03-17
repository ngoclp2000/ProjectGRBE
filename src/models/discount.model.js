import BaseModel from './baseModel.js';
import DataTypes from "../shared/enums/dataType.js";

export default class Discount extends BaseModel{
    constructor() {
        let data = {};
        data.table = 'discount';
        data.idField = 'DiscountId';
        super(data);
        this.controllerName = 'Discount';
        this.alias = 'od';

        this.fields = {
            isSystem :{
                type : DataTypes.Number,
                name: 'isSystem',
            },
            discountName :{
                type : DataTypes.String,
                name: 'discountName',
            },
            discountType :{
                type : DataTypes.Number,
                name: 'discountType',
            },
            discountAmount :{
                type : DataTypes.Number,
                name: 'discountAmount',
            },
            discountId :{
                type : DataTypes.String,
                name: 'discountId',
            },
            discountCode :{
                type : DataTypes.String,
                name: 'discountCode',
            },
            discountPercent :{
                type : DataTypes.Number,
                name: 'discountPercent',
            },
            discountQuantity :{
                type : DataTypes.Number,
                name: 'discountQuantity',
            },
        }
        
    }

    static getInstance(){
        if(this.instance == null){
            this.instance = new Discount();
        }
        return this.instance;
    }
}