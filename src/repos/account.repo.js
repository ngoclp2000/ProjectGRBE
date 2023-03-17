import Function from '../utils/function.class.js';
import BaseRepo from './base.repo.js';
import md5 from 'md5';
import UserModel from '../models/user.model.js';

const tryCatchBlock = Function.tryCatchBlockForModule;
const buildInsertParams = Function.buildInsertParams;
const buildUpdateWithParams = Function.buildUpdateWithParams;
const safeParam = Function.safeParam;

export default class AccountRepo extends BaseRepo {
    constructor(param) {
        super(param);
        this.model = new UserModel(param);
    }
    /**
     * Đăng ký tài khoản
     */
    signUp = tryCatchBlock(async (payload,connection) => {
        if (payload && payload.password) {
            payload.password = payload.password ? md5(payload.password) : "";
        }
        const newId = await this.getNewId();
        let sql = buildInsertParams(this.model.idField, this.model.table, payload, this.model.controllerName, newId);
        const [resultSet] = await connection.query(sql);
        return {
            id: newId,
            code: resultSet.affectedRows > 0 ? 200 : 400
        }
    })
    /**
     * Hoàn tiện đăng ký
     */
    completeProfile = tryCatchBlock(async (payload,connection) => {
        if (payload) {
            const sql = buildUpdateWithParams(this.model.idField, this.model.table, payload, this.model.controllerName, payload[this.model.idField]);
            const [resultSet] = await connection.query(sql);
            return {
                code: resultSet.affectedRows > 0 ? 200 : 400
            }
        }
    })
    /**
     * Đăng nhập
     */
    signIn = tryCatchBlock(async (account, password,connection) => {
        this.model.password = md5(password);
        const sql = `SELECT * FROM ${safeParam(this.model.table)} WHERE (username = '${account}' or email = '${account}') AND (password = '${this.model.password}');`;
        const [resultSet] = await connection.query(sql);
        return resultSet.length === 0 ?
            null :
            {
                userId: resultSet[0].userId,
                avatar: resultSet[0].avatar,
                fullName: resultSet[0].fullName,
                email: resultSet[0].email,
            };
    })

    /**
     * Check account exist in the system
     */
    checkAccountExist = tryCatchBlock(async (account) =>{
        
    });
}