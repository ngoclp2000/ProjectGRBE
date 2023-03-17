import AccountRepo from '../repos/account.repo.js';
import ErrorCode from '../shared/enums/errorCode.js';
import DatabaseHandler from '../utils/database.test.js';
import AdminRepo from '../repos/admin.repo.js';
import moment from 'moment';

const database = DatabaseHandler.getInstance();
const adminRepo = new AdminRepo();

export default class AdminService{
    constructor(){

    }

    async summaryInformation(userId){
        const connection = await database.openTransaction();
        try{
            return await adminRepo.summaryInformation(userId,connection);
        }catch(error){
            throw new Error(error);
        }finally{
            database.closeTransaction(connection);
        }

    }

    async summaryDetailInformation(payload){
        const connection = await database.openTransaction();
        try{
            return await adminRepo.summaryDetailInformation(payload,connection);
        }catch(error){
            throw new Error(error);
        }finally{
            database.closeTransaction(connection);
        }

    }

    async getSalesStatus(payload){
        const connection = await database.openTransaction();
        try{
            return await adminRepo.getSalesStatus(payload,connection);
        }catch(error){
            throw new Error(error);
        }finally{
            database.closeTransaction(connection);
        }
    }

    async getProductStatus(payload){
        const connection = await database.openTransaction();
        try{
            return await adminRepo.getProductStatus(payload,connection);
        }catch(error){
            throw new Error(error);
        }finally{
            database.closeTransaction(connection);
        }
    }

    async getCategoryStatus(payload){
        const connection = await database.openTransaction();
        try{
            return await adminRepo.getCategoryStatus(payload,connection);
        }catch(error){
            throw new Error(error);
        }finally{
            database.closeTransaction(connection);
        }
    }

    async getRelationBetweenTransactionAndUser(payload){
        const connection = await database.openTransaction();
        try{
            return await adminRepo.getRelationBetweenTransactionAndUser(payload,connection);
        }catch(error){
            throw new Error(error);
        }finally{
            database.closeTransaction(connection);
        }
    }

    async getDashboardLastAndCurrentCategoryProduct(payload){
        const connection = await database.openTransaction();
        try{
            const data =  await adminRepo.getDashboardLastAndCurrentCategoryProduct(payload,connection);
            return data;
        }catch(error){
            throw new Error(error);
        }finally{
            database.closeTransaction(connection);
        }
    }

    static getInstance() {
        if (this._instance == null) {
            this._instance = new AdminService();
        }
        return this._instance;
    }
}