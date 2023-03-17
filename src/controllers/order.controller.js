import Function from "../utils/function.class.js";
const tryCatchBlock = Function.tryCatchBlockForController;
import BaseController from "./base.controller.js";
import OrderService from "../services/order.service.js";

const service = OrderService.getInstance();


export default class OrderController extends BaseController{

    constructor(){
        super(service);
    }

    takePayment = tryCatchBlock(null, async (req, res, next) => {
        const result = await service.takePayment(req.body,req.userData?.userID);
        return res.status(200).send({
            data: result
        });
    })

    getDiscount = tryCatchBlock(null, async (req, res, next) => {
        const query = req.query;
        if(query){
            const discountCode = query.discountCode;
            let result = null;
            try{
                result = await service.getDiscount(discountCode);
            }catch(err){
                console.log(err);
            }
            return res.status(200).send({
                data: result
            });
        }

        return res.status(201).send({
            data: null
        });
        
    })
}