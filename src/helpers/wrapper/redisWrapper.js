import redis from '../../utils/redis';

export default {
    addElementToRedisArray: async function(key,value){
        if(key){
            if(value){
                if(Array.isArray(value)){
                    for(let i = 0; i < value.length; i++){
                        await redis.sAdd(key,value[i]);
                    }
                }else{
                    await redis.sAdd(key,value);
                }
            }
        }
    },
    removeElementFromRedisArray: async function(key,value){
        if(key){
            if(value){
                if(Array.isArray(value)){
                    for(let i = 0; i < value.length; i++){
                        await redis.sRem(key,value[i]);
                    }
                }else{
                    return await redis.sRem(key,value);
                }
            }
        }
    },
    checkExistElementInRedisArray: async function(key,value){
        if(key){
            if(value){
                return await redis.sIsMember(key,value);
            }
        }
    }
}