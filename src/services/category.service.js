import CategoryRepo from "../repos/category.repo.js";
const categoryRepo = new CategoryRepo();
import DatabaseHandler from "../utils/database.test.js";

const database = DatabaseHandler.getInstance();

export default class CategoryService {
    async getDataCombobox(payload, userId) {
        let data = [];
        if (payload) {
            const connection = await database.openTransaction();
            try{
                data =  await categoryRepo.getDataCombobox(payload,userId,connection);
            }catch(error){
                
            }finally{
                database.closeTransaction(connection);
            }
        }
        return data;
    }

    static getInstance() {
        if (this._instance == null) {
            this._instance = new CategoryService();
        }
        return this._instance;
    }
}