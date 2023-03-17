import Function from "../utils/function.class.js";
import AuthService from '../services/auth.service.js';

const tryCatchBlock = Function.tryCatchBlockForController;
const service = AuthService.getInstance();


export default class AuthController{
    refreshToken = tryCatchBlock(null, async (req, res, next) => {
        const {
            refreshToken,
            userId
        } = req.body;
        if (!refreshToken) {
            return res.status(403).send({});
        } else {
            let resData = await service.refreshToken({
                refreshToken,
                userId
            });
            return res.status(200).send(resData);
        }
    })

    removeToken = tryCatchBlock(null, async (req, res, next) => {
        const {
            refreshToken,
            userId
        } = req.body;
        if (!refreshToken) {
            return res.status(403).send({});
        } else {
            let resData = await service.removeToken({
                refreshToken,
                userId
            });
            return res.status(200).send({
                data: resData
            });
        }
    })
}