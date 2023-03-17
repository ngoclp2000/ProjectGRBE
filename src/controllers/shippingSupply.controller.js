import Function from "../utils/function.class.js";
import ShippingSupplyService from "../services/shippingSupply.service.js";

const tryCatchBlock = Function.tryCatchBlockForController;
const service = ShippingSupplyService.getInstance();

export default class ShippingSupplyController {
    getDataCombobox = tryCatchBlock(null, async (req, res, next) => {
        const result = await service.getDataCombobox(req.body,req.userData?.userID);
        return res.status(200).send({
            message: "GET_ShippingSupply_SUCCESS",
            data: result
        });
    })
}