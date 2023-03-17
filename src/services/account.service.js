import AccountRepo from '../repos/account.repo.js';
import ErrorCode from '../shared/enums/errorCode.js';
import DatabaseHandler from '../utils/database.test.js';

const database = DatabaseHandler.getInstance();
const accountRepo = new AccountRepo();


export default class AccountService {
    /**
     * Đăng nhập bằng tài khoản và mật khẩu
     * @param {*} account 
     * @param {*} password 
     * @returns 
     * tbngoc 26.02.2023
     */
    async signIn(account, password) {
        if (account && password) {
            const connection = await database.openAuthConnection();
            try {
                connection.beginTransaction();
                return await accountRepo.signIn(account, password, connection);
            } catch (error) {

            } finally {
                database.closeTransaction(connection);
            }
        }
    }

    /**
     * Đăng ký tài khoản
     * @param {*} payload 
     * @returns 
     * tbngoc 26.02.2023
     */
    async signUp(payload) {
        let res = {
            isError: false,
            data: {},
            errorCode: ErrorCode.None
        };
        if (payload && payload.roleId == null) {
            payload.roleId = 'e094cc15-1cbb-11ed-bbb9-34415dd21b70';
        }
        payload.avatar = 'https://res.cloudinary.com/mp32022/image/upload/UserAvatar/default-avatar.jpg';

        // Kiểm tra xem tài khoản đã tồn tại hay chưa
        let fieldsPayload = {
            "username": payload.username
        };
        const connection = await database.openAuthConnection();
        try {
            connection.beginTransaction();
            let account = await accountRepo.getAsyncByFields(fieldsPayload,connection);
            if (account != null) {
                res.isError = true;
                res.data = null;
                res.errorCode = ErrorCode.DuplicateUserName;
            } else {
                res.data = await accountRepo.signUp(payload,connection);
                connection.commit();
            }
        } catch (error) {
            connection.rollback();
        } finally {
            database.closeTransaction(connection);
        }
        return res;
    }
    /**
     * Hoàn thiện profile
     * @param {*} payload 
     * @returns 
     * tbngoc 26.02.2023
     */
    async completeProfile(payload) {
        if (payload) {
            const connection = await database.openAuthConnection();
            try {
                connection.beginTransaction();
                const data = await accountRepo.completeProfile(payload,connection);
                connection.commit();
                return data;
            } catch (error) {
                connection.rollback();
            } finally {
                database.closeTransaction(connection);
            }
        }
    }

    static getInstance() {
        if (this._instance == null) {
            this._instance = new AccountService();
        }
        return this._instance;
    }
}