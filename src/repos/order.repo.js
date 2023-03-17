import Function from '../utils/function.class.js';
import BaseRepo from './base.repo.js';
import OrderModel from '../models/order/order.model.js'
import optionFilter from "../shared/enums/optionFilter.js";
import Discount from "../models/discount.model.js";

const tryCatchBlock = Function.tryCatchBlockForModule;
const buildInsertParams = Function.buildInsertParams;
const parseWhere = Function.parseWhere;
const getSelectClause = Function.getSelectClause;
const takeFieldFromModel = Function.takeFieldFromModel;
const safeParam = Function.safeParam;


export default class OrderRepo extends BaseRepo {
    constructor() {
        super();
        this.model = new OrderModel();
    }

    createOrder = tryCatchBlock(async (newId,payload,connection) => {
        const sql = buildInsertParams(this.model.idField,this.model.table,payload,this.model.controllerName,newId); 
        const [resultSet] = await connection.query(sql);
        
        return resultSet != null && resultSet.affectedRows > 0;
    })

    getDiscount = tryCatchBlock(async (discountCode,connection) => {
        const discount = Discount.getInstance();
        const filters = [{
            field: discount.fields.discountCode.name,
            value: discountCode,
            type: optionFilter.Equal
        }];
        const sqlWhere = parseWhere(filters,discount);
        const sqlSelect = getSelectClause(discount,Object.keys(discount.fields));
        
        const sql = `SELECT ${sqlSelect} FROM ${safeParam(discount.table)} ${discount.alias} ${sqlWhere}`;
        const [resultSet] = await connection.query(sql);
        if(resultSet!= null && resultSet.length > 0){
            return resultSet[0];
        }
        return null;
    })

    async addOrderProduct(payload,connection){
        const orderProductModel = this.model.relationTable.find(item => item.key === 'orderProduct');
        const newId = await this.getNewId(connection);
        const sql = buildInsertParams(orderProductModel.model.idField,orderProductModel.model.table,payload,orderProductModel.model.controllerName,newId);
        const [resultSet] = await connection.query(sql);
        return resultSet != null && resultSet.affectedRows > 0; 
    }
    async addOrderDiscount(payload,connection){
        const orderDiscountModel = this.model.relationTable.find(item => item.key === 'orderDiscount');
        // Sinh sql
        const newId = await this.getNewId(connection);
        const sql = buildInsertParams(orderDiscountModel.model.idField,orderDiscountModel.model.table,
            payload,orderDiscountModel.model.controllerName,newId);
        const [resultSet] = await connection.query(sql);
        return resultSet != null && resultSet.affectedRows > 0;
    }
    async addOrderShippingSupply(payload,connection){
        const orderShippingSupply = this.model.relationTable.find(item => item.key === 'orderShippingSupply');
        // Sinh sql
        const newId = await this.getNewId(connection);
        const sql = buildInsertParams(orderShippingSupply.model.idField,orderShippingSupply.model.table,
            payload,orderShippingSupply.model.controllerName,newId);
        const [resultSet] = await connection.query(sql);
        return resultSet != null && resultSet.affectedRows > 0;
    }
}