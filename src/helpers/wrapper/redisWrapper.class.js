import RedisClient from '../../utils/redis.js';

export default class Redis{
    static async addElementToRedisArray(key,value){
        if(key){
            if(value){
                if(Array.isArray(value)){
                    for(let i = 0; i < value.length; i++){
                        await RedisClient.redis.sAdd(key,value[i]);
                    }
                }else{
                    await RedisClient.redis.sAdd(key,value);
                }
            }
        }
    }

    static async removeElementFromRedisArray(key,value){
        if(key){
            if(value){
                if(Array.isArray(value)){
                    for(let i = 0; i < value.length; i++){
                        await RedisClient.redis.sRem(key,value[i]);
                    }
                }else{
                    return await RedisClient.redis.sRem(key,value);
                }
            }
        }
    }

    static async checkExistElementInRedisArray(key,value){
        if(key){
            if(value){
                return await RedisClient.redis.sIsMember(key,value);
            }
        }
    }
}