import Function from "../utils/function.class.js";
import CategoryService from "../services/category.service.js";

const tryCatchBlock = Function.tryCatchBlockForController;
const service = CategoryService.getInstance();

export default class CategoryController{
    getDataCombobox = tryCatchBlock(null , async (req,res,next) =>{
        const result = await service.getDataCombobox(req.body,req.userData?.userID);
        return res.status(200).send({
            message: "GET_CATEGORY_SUCCESS",
            data: result
        });
    })
}