import ProductUnitTypeRepo from '../repos/productUnitType.repo.js';
import DatabaseHandler from "../utils/database.test.js";

const database = DatabaseHandler.getInstance();

const productUnitTypeRepo = new ProductUnitTypeRepo();

export default class ProductUnitTypeService {
    async getDataCombobox(payload, userId) {
        let data = [];
        if (payload) {
            const connection = await database.openTransaction();
            try{
                data =  await productUnitTypeRepo.getDataCombobox(payload,userId,connection);
            }catch(error){
                
            }finally{
                database.closeTransaction(connection);
            }
        }
        return data;
    }

    static getInstance() {
        if (this._instance == null) {
            this._instance = new ProductUnitTypeService();
        }
        return this._instance;
    }
}