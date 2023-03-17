import Function from '../utils/function.class.js';
import AccountService from '../services/account.service.js';
import Authentication from '../models/authentication.class.js';

const tryCatchBlock = Function.tryCatchBlockForController;
const service = AccountService.getInstance();


export default class AccountController{
    signIn = tryCatchBlock(null, async (req, res, next) => {
        const { account, password } = req.body;
        const result = await service.signIn(account, password);
        if (!result) return res.status(404).send({ message: "SIGN_IN_FAIL" });
        let dataResponse = await Authentication.createToken(result);
        return res.status(200).send({ message: "SIGN_IN_SUCCESS", data: dataResponse });
    })

    completeProfile = tryCatchBlock(null, async (req, res, next) =>{
        const result = await service.completeProfile(req.body);
        return res.status(200).send({
            message : "COMPLETE_PROFILE_SUCCESS",
            data : result
        })
    })

    signUp = tryCatchBlock(null, async (req, res, next) => {
        const result = await service.signUp(req.body);
        if(result.isError){
            switch(result.errorCode){
                case ErrorCode.DuplicateUserName:
                    result.errorMessage = signUpMessage.DuplicateUserName;
                    return res.status(200).send(result); 
            }
        }

        return res.status(200).send({
            message: "GET_PRODUCT_SUCCESS",
            data: result?.data
        });
    })
}