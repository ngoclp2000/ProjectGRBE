import ShippingSupplyRepo from "../repos/shippingSupply.repo.js";
import DatabaseHandler from "../utils/database.test.js";

const database = DatabaseHandler.getInstance();

const shippingSupplyRepo = new ShippingSupplyRepo();

export default class ShippingSupply {
    async getDataCombobox(payload, userId) {
        let data = [];
        if (payload) {
            const connection = await database.openTransaction();
            try{
                data =  await shippingSupplyRepo.getDataCombobox(payload,userId,connection);
            }catch(error){
                
            }finally{
                database.closeTransaction(connection);
            }
        }
        return data;
    }

    static getInstance() {
        if (this._instance == null) {
            this._instance = new ShippingSupply();
        }
        return this._instance;
    }
}