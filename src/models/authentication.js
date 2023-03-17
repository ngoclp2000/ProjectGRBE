import { jwt } from "jsonwebtoken";
import redis from '../utils/redis';
import RedisWrapper from "../helpers/wrapper/redisWrapper";

export default {
    createToken: async (payload) => {
        const {userId} = payload;
        let token = jwt.sign(payload, process.env.TOKEN_SECURITY_KEY, {
          expiresIn: process.env.TOKEN_EXPIRATION,
        });
        let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECURITY_KEY, {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
        });

        if(userId){
          let data = await RedisWrapper.checkExistElementInRedisArray(userId + ":refreshToken",refreshToken);
          if(!data){
            await redis.sAdd(userId + ":refreshToken",refreshToken);
          }
        }

        return {
          token,
          refreshToken
        };
    },
    checkToken: (token) =>{
      try{
        if (!token) return false;
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECURITY_KEY);
        if(decodedToken) return true;
      }catch(e){
        return false;
      }
    },
    checkRefreshToken: (refreshToken) => {
      try{
        if (!refreshToken) return false;
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECURITY_KEY);
        if(decodedToken) return true;
      }catch(e){
        return false;
      }
    },
    createAccessToken : async (payload)=>{
      let token = jwt.sign(payload, process.env.TOKEN_SECURITY_KEY, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });
      return {
        token
      };
    }
}