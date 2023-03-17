import RedisWrapper from "../helpers/wrapper/redisWrapper.class.js";
import Authentication from "../models/authentication.class.js";
import AccountRepo from '../repos/account.repo.js';
import Database from '../utils/database.test.js';

const database = Database.getInstance();

const accountRepo = new AccountRepo();

export default class AuthService {
    async refreshToken(payload) {
        if (payload && payload.refreshToken) {
            const {
                refreshToken,
                userId
            } = payload;
            let checkRefreshToken = await RedisWrapper.checkExistElementInRedisArray(userId + ':refreshToken', refreshToken);
            if (checkRefreshToken) {

                let checkRefreshTokenValid = Authentication.checkRefreshToken(refreshToken);
                if (checkRefreshTokenValid) {
                    const connection = await database.openAuthConnection();
                    try {
                        connection.beginTransaction();
                        let userData = await accountRepo.getDataById(userId,connection);
                        if (userData) {
                            let payload = {
                                userId: userData.userId,
                                avatar: userData.avatar,
                                fullName: userData.fullName,
                                email: userData.email,
                            };
                            return await Authentication.createAccessToken(payload);
                        }
                    } catch (err) {

                    } finally {
                        database.closeTransaction(connection);
                    }

                } else {
                    await RedisWrapper.removeElementFromRedisArray(userId + ':refreshToken', refreshToken);
                }
            }
            return null;
        }
    }

    async removeToken(payload) {
        try {
            if (payload) {
                let res = await RedisWrapper.removeElementFromRedisArray(payload.userId + ':refreshToken', payload.refreshToken);
                return res;
            }
        } catch (e) {}
        return false;
    }

    static getInstance() {
        if (this._instance == null) {
            this._instance = new AuthService();
        }
        return this._instance;
    }
}