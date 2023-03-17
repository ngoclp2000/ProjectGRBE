import Database from '../utils/database.test.js';

const database = Database.getInstance();

export default class BaseService {

    constructor(repo){
        this._repo = repo;
    }

    async insertAsync(payload){
        const connection = await database.openTransaction();
        try {
            if(payload){
                this.handleBeforeInsert(payload);
                let res =  await this._repo.insertAsync(payload, connection);
                if(res){
                    connection.commit();
                }else{
                    connection.rollback();
                }
                return res;
            }
        } catch (error) {

        } finally {
            database.closeTransaction(connection);
        }
    }

    /**
     * Lấy danh sách dữ liệu bảng
     * @param {*} payload 
     * @returns 
     * tbngoc 17.12.2022
     */
    async getDataTable(payload) {
        const connection = await database.openTransaction();
        try {
            return await this._repo.getDataTable(payload, connection);
        } catch (error) {

        } finally {
            database.closeTransaction(connection);
        }
    }
}
