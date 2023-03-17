import Function from "../utils/function.class.js";
import ProductUnitService from '../services/productUnitType.service.js';

const tryCatchBlock = Function.tryCatchBlockForController;
const service = ProductUnitService.getInstance();
export default class ProductUnitTypeController {
    getDataCombobox = tryCatchBlock(null, async (req, res, next) => {
        const result = await service.getDataCombobox(req.body,req.userData?.userID);
        return res.status(200).send({
            message: "GET_ProductUnitType_SUCCESS",
            data: result
        });
    })
}