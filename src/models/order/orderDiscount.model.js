import BaseModel from '../baseModel.js';
import DataTypes from "../../shared/enums/dataType.js";

export default class OrderDiscount extends BaseModel{
    constructor() {
        let data = {};
        data.table = 'orderdiscount';
        data.idField = 'orderDiscountId';
        super(data);
        this.controllerName = 'OrderDiscount';
        this.alias = 'od';

        this.fields = {
            orderDiscountId :{
                type : DataTypes.String,
                name: 'orderDiscountId',
            },
            orderId :{
                type : DataTypes.String,
                name: 'orderId',
            },
            discountId :{
                type : DataTypes.String,
                name: 'discountId',
            },
            discountAmount :{
                type : DataTypes.Number,
                name: 'discountAmount',
            },
        }
        
    }

    static getInstance(){
        if(this.instance == null){
            this.instance = new OrderDiscount();
        }
        return this.instance;
    }
}