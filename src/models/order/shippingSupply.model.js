import BaseModel from '../baseModel.js';
import DataTypes from "../../shared/enums/dataType.js";

export default class ShippingSupply extends BaseModel{
    constructor() {
        let data = {};
        data.table = 'shippingSupply';
        data.idField = 'shippingSupplyId';
        super(data);
        this.controllerName = 'ShippingSupply';
        this.alias = 'ss';

        this.fields = {
            shippingSupplyId :{
                type : DataTypes.String,
                name: 'shippingSupplyId',
            },
            shippingSupplyName :{
                type : DataTypes.String,
                name: 'shippingSupplyName',
            },
            shippingSupplyCode :{
                type : DataTypes.String,
                name: 'shippingSupplyCode',
            },
            shippingSupplyAmount :{
                type : DataTypes.Number,
                name: 'shippingSupplyAmount',
            },
            shippingSupplyAddress :{
                type : DataTypes.String,
                name: 'shippingSupplyAddress',
            },
            isSupportHotShip:{
                type: DataTypes.Boolean,
                name: 'isSupportHotShip',
            },
            hotShippingFee:{
                type: DataTypes.Number,
                name : 'hotShippingFee'
            }
        }

    }

    static getInstance(){
        if(this.instance == null){
            this.instance = new ShippingSupply();
        }
        return this.instance;
    }
}