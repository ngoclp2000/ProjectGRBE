import Function from '../utils/function.class.js';
const tryCatchBlock = Function.tryCatchBlockForController;
export default class BaseController {
    constructor(service) {
        this._service = service;
    }

    insertAsync = tryCatchBlock(null ,async (req,res,next) => {
        const userId = req.userData?.userID;
        req.body.userId = userId;
        const data = await this._service.insertAsync(req.body);
        return res.status(200).send(data);
    });
    
    updateAsync(req, res, next) {
        return true;
    }

    getDataTable = tryCatchBlock(null, async (req, res, next) => {
        try{
            const data = await this._service.getDataTable(req.body);
            return res.status(200).send(data);
        }catch (error){
            return res.status(403);
        }
    })
}
