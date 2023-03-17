import BaseModel from '../baseModel.js';
import OrderDiscount from './orderDiscount.model.js';
import OrderProduct from './orderProduct.model.js';
import OrderShippingSupply from './orderShippingSupply.model.js';
import User from '../user.model.js';

import DataTypes from "../../shared/enums/dataType.js";

export default class Order extends BaseModel{
    constructor() {
        let data = {};
        data.table = 'order';
        data.idField = 'orderId';
        super(data);
        this.controllerName = 'Order';
        this.alias = 'o';

        this.fields = {
            orderId :{
                type : DataTypes.String,
                name: 'orderId',
            },
            orderTotalAmount :{
                type : DataTypes.Number,
                name: 'orderTotalAmount',
            },
            orderCustomerName :{
                type : DataTypes.String,
                name: 'orderCustomerName',
            },
            orderCustomerAddress :{
                type : DataTypes.String,
                name: 'orderCustomerAddress',
            },
            orderCustomerPhoneNumber :{
                type : DataTypes.String,
                name: 'orderCustomerPhoneNumber',
            },
            userId:{
                type: DataTypes.String,
                name: 'userId'
            },
            isHotShipping:{
                type: DataTypes.Boolean,
                name: 'isHotShipping'
            },
            orderDate:{
                type: DataTypes.Date,
                name: 'orderDate'
            },
            createdByAdmin:{
                type: DataTypes.Boolean,
                name : 'createdByAdmin'
            },
            sellerUserId:{
                type: DataTypes.String,
                name: 'sellerUserId'
            },
            orderCode:{
                type: DataTypes.String,
                name: 'orderCode'
            },
            orderStatus:{
                type: DataTypes.Number,
                name: 'orderStatus'
            }
        }

        this.relationTable = [
            {
                model : OrderDiscount.getInstance(),
                foreignKey : 'orderId',
                key : 'orderDiscount'
            },
            {
                model : OrderProduct.getInstance(),
                foreignKey : 'orderId',
                key: 'orderProduct'
            },
            {
                model : OrderShippingSupply.getInstance(),
                foreignKey : 'orderId',
                key: 'orderShippingSupply'
            },
            {
                model: User.getInstance(),
                foreignKey : 'userId',
            }
        ]
    }

    
}