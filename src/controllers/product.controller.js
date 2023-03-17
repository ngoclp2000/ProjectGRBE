import Function from '../utils/function.class.js';
import ErrorCode from '../shared/enums/errorCode.js';
import ProductService from '../services/product.service.js';
import BaseController from "./base.controller.js";

const tryCatchBlock = Function.tryCatchBlockForController;

const service = ProductService.getInstance();

export default class ProductController extends BaseController{
    constructor(){
        super(service);
    }
    
    getProductById = tryCatchBlock(null, async (req, res, next) => {
        const product = await service.getProductById(req.params.productId);
        return res.status(200).send({
            message: "GET_PRODUCT_SUCCESS",
            data: product
        });
    })

    getDataTable = tryCatchBlock(null, async (req, res, next) => {
        try {
            const product = await service.getDataTable(req.body);
            return res.status(200).send(product);
        } catch (error) {
            return res.status(403);
        }
    })

    getProductManage = tryCatchBlock(null, async (req, res, next) => {
        const result = await service.getProductManage(req.userData?.userID);
        if (result) {
            switch (result.code) {
                case ErrorCode.NotAdmin:
                    return res.status(203).send({
                        message: 'You are not admin'
                    });
                default:
                    return res.status(200).send(result.data);
            }
        }
    })

    getProductList = tryCatchBlock(null, async (req, res, next) => {
        req.body = {
            ...req.body,
            ...req.userData
        };
        const product = await service.getProductList(req.body);
        return res.status(200).send(product);
    })


}