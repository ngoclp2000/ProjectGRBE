import BaseModel from '../baseModel.js';
import DataTypes from "../../shared/enums/dataType.js";

export default class OrderShippingSupply extends BaseModel{
    constructor() {
        let data = {};
        data.table = 'ordershippingsupply';
        data.idField = 'orderShippingSupplyId';
        super(data);
        this.controllerName = 'OrderShippingSupply';
        this.alias = 'oss';

        this.fields = {
            orderShippingSupplyId :{
                type : DataTypes.String,
                name: 'orderShippingSupplyId',
            },
            orderShippingSupplyStage :{
                type : DataTypes.Number,
                name: 'orderShippingSupplyStatusStage',
            },
            orderShippingSupplyCoordinate :{
                type : DataTypes.String,
                name: 'orderShippingSupplyCoordinate',
            },
            orderId :{
                type : DataTypes.String,
                name: 'orderId',
            },
            orderShippingAmount:{
                type: DataTypes.Number,
                name: 'orderShippingAmount',
            },
            shippingSupplyId:{
                type: DataTypes.String,
                name: 'shippingSupplyId'
            }
        }

    }

    static getInstance(){
        if(this.instance == null){
            this.instance = new OrderShippingSupply();
        }
        return this.instance;
    }
}