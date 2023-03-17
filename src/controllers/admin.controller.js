import Function from '../utils/function.class.js';
const tryCatchBlock = Function.tryCatchBlockForController;
import AdminService from '../services/admin.service.js';


const service = AdminService.getInstance();


export default class AdminController{

    constructor(){

    }

    summaryInformation = tryCatchBlock(null ,async (req, res,next) => {
        try{
            const userId = req.userData?.userID;
            const result = await service.summaryInformation(userId);
            if(result){
                return res.status(200).send({
                    data: result,
                })
            }else{
                return res.status(201);
            }
        }catch(err){
            next();
        }finally{

        }
    });

    summaryDetailInformation = tryCatchBlock(null ,async (req, res,next) => {
        try{
            const userId = req.userData?.userID;
            const payload = {
                userId,
                fromDate: req.query?.fromDate,
                toDate: req.query?.toDate,
            }

            const result = await service.summaryDetailInformation(payload);
            if(result){
                return res.status(200).send({
                    data: result,
                })
            }else{
                return res.status(201);
            }
        }catch(err){
            next();
        }finally{

        }
    });

    getSalesStatus = tryCatchBlock(null ,async (req, res,next) => {
        try{
            const userId = req.userData?.userID;
            const payload = {
                userId,
                currentDate: req.query?.currentDate,
            }

            const result = await service.getSalesStatus(payload);
            if(result){
                return res.status(200).send({
                    data: result,
                })
            }else{
                return res.status(201);
            }
        }catch(err){
            next();
        }finally{

        }
    });

    getProductStatus = tryCatchBlock(null ,async (req, res,next) => {
        try{
            const userId = req.userData?.userID;
            const payload = {
                userId,
            }

            const result = await service.getProductStatus(payload);
            if(result){
                return res.status(200).send({
                    data: result,
                })
            }else{
                return res.status(201);
            }
        }catch(err){
            next();
        }finally{

        }
    });

    getCategoryStatus = tryCatchBlock(null ,async (req, res,next) => {
        try{
            const userId = req.userData?.userID;
            const payload = {
                userId,
            }

            const result = await service.getCategoryStatus(payload);
            if(result){
                return res.status(200).send({
                    data: result,
                })
            }else{
                return res.status(201);
            }
        }catch(err){
            next();
        }finally{

        }
    });

    getRelationBetweenTransactionAndUser = tryCatchBlock(null ,async (req, res,next) => {
        try{
            const userId = req.userData?.userID;
            const payload = {
                userId,
                currentDate: req.query?.currentDate,
            }

            const result = await service.getRelationBetweenTransactionAndUser(payload);
            if(result){
                return res.status(200).send({
                    data: result,
                })
            }else{
                return res.status(201);
            }
        }catch(err){
            next();
        }finally{

        }
    });

    getDashboardLastAndCurrentCategoryProduct = tryCatchBlock(null ,async (req, res,next) => {
        try{
            const userId = req.userData?.userID;
            const payload = {
                userId,
                currentDate: req.query?.currentDate,
            }

            const result = await service.getDashboardLastAndCurrentCategoryProduct(payload);
            if(result){
                return res.status(200).send({
                    data: result,
                })
            }else{
                return res.status(201);
            }
        }catch(err){
            next();
        }finally{

        }
    });
}