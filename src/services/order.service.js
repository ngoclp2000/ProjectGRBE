import ValueDefault from "../shared/constants/valueDefault.js";
import OrderRepo from "../repos/order.repo.js";
import Discount from "../models/discount.model.js";
import Database from '../utils/database.test.js';
import Function from "../utils/function.class.js";
import BaseService from "./base.service.js";

const orderRepo = new OrderRepo();
const database = Database.getInstance();
const normalizeDateTime = Function.normalizeDateTime;

export default class OrderService extends BaseService{
    constructor(){
        super(orderRepo);
    }

    async takePayment(payload, userId) {
        let checkValid = true;
        if (payload) {
            payload.orderDate = normalizeDateTime(payload.orderDate);
            let objectOrder = {
                orderTotalAmount: payload.totalAmount,
                orderCustomerName: payload.orderCustomerName,
                orderCustomerPhoneNumber: payload.orderCustomerPhoneNumber,
                orderCustomerAddress: payload.orderCustomerAddress,
                userId,
                isHotShipping: payload.isHotShipping || false,
                sellerUserId: payload.createdByAdmin ? userId : payload.sellerUserId,
                orderDate: payload.orderDate,
            }
            const newTransaction = await database.openTransaction();
            try {
                await newTransaction.beginTransaction();
                const orderId = await orderRepo.getNewId(newTransaction);
                const resCreateOrder = await orderRepo.createOrder(orderId, objectOrder, newTransaction);
                if (resCreateOrder) {
                    const payloadProduct = payload.orderProducts;
                    if (payloadProduct && Array.isArray(payloadProduct)) {
                        for (let i = 0; i < payloadProduct.length; i++) {
                            const payload = {
                                orderId,
                                productId: payloadProduct[i].productId,
                                amount: payloadProduct[i].productPrice,
                                quantity: payloadProduct[i].productQuantity
                            };
                            const resCreateOrderProduct = await orderRepo.addOrderProduct(payload, newTransaction);
                            checkValid = checkValid && resCreateOrderProduct;
                            if (!resCreateOrderProduct) {
                                break;
                            }
                        }

                        if (!checkValid) {
                            await newTransaction.rollback();
                            return checkValid;
                        }
                        // Thêm orderDiscount
                        if(payload.discountId){
                            const orderDiscountPayload = {
                                orderId,
                                discountId: payload.discountId,
                                discountAmount: payload.discountAmount
                            }
                            checkValid = checkValid && await orderRepo.addOrderDiscount(orderDiscountPayload, newTransaction);
                            if(!checkValid){
                                await newTransaction.rollback();
                                return checkValid; 
                            }
                        }
                        
                        // Thêm orderSupply
                        if(payload.shippingSupplyId){
                            const orderShippingSupply = {
                                shippingSupplyId : payload.shippingSupplyId,
                                orderShippingSupplyStage : 0,
                                orderShippingSupplyStatusCoordinate : '',
                                orderShippingSupplyAmount : payload.shippingAmount,
                                orderId,
                            }
                            checkValid = checkValid && await orderRepo.addOrderShippingSupply(orderShippingSupply, newTransaction);
                        }

                        if(checkValid){
                            await newTransaction.commit();
                        }else{
                            await newTransaction.rollback();
                        }
                    }
                } else {
                    await newTransaction.rollback();
                }
            } catch (error) {
                console.log(error);
                checkValid = false;
            } finally {
                database.closeTransaction(newTransaction);
            }
        } else {
            checkValid = false;
        }

        return checkValid;
    }

    async getDiscount(discountCode) {
        const connection = await database.openTransaction();
        try {
            const data = await orderRepo.getDiscount(discountCode, connection);
            const res = {};
            if (data) {
                const orderDiscount = Discount.getInstance();
                if (data[orderDiscount.fields.discountQuantity.name] == 0) {
                    res.isError = true;
                    res.message = 'OUT_OF_QUANTITY';
                } else {
                    res.isError = false;
                    res.Data = data;
                    res.message = 'SUCCESS';
                }
            } else {
                res.isError = true;
                res.message = 'NOT_EXIST';
            }

            return res;
        } catch (error) {

        } finally {
            database.closeTransaction(connection);
        }


    }

    static getInstance() {
        if (this._instance == null) {
            this._instance = new OrderService();
        }
        return this._instance;
    }
}