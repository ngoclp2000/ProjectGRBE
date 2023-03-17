import dotenv from 'dotenv'
dotenv.config()
import redis from 'redis';

const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host : process.env.REDIS_HOST
})

client.connect();

client.ping((err,pong) =>{
    console.log(pong);
});


export default class RedisClient{
    static redis = client;
}
