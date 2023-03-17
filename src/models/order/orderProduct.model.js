import BaseModel from '../baseModel.js';
import DataTypes from "../../shared/enums/dataType.js";

export default class OrderProduct extends BaseModel{
    constructor() {
        let data = {};
        data.table = 'orderproduct';
        data.idField = 'orderProductId';
        super(data);
        this.controllerName = 'OrderProduct';
        this.alias = 'op';

        this.fields = {
            orderProductId :{
                type : DataTypes.String,
                name: 'orderProductId',
            },
            orderId :{
                type : DataTypes.String,
                name: 'orderId',
            },
            productId :{
                type : DataTypes.String,
                name: 'productId',
            },
            amount :{
                type : DataTypes.Number,
                name: 'amount',
            },
            quantity :{
                type : DataTypes.Number,
                name: 'quantity',
            }
        }

    }

    static getInstance(){
        if(this.instance == null){
            this.instance = new OrderProduct();
        }
        return this.instance;
    }
}