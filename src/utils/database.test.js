import {
    createConnection,
    createPool
} from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
import Function from './function.class.js';

const parseConnection = Function.parseConnection;

export default class DatabaseHandler {
    constructor() {
        this.pool = createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            waitForConnections: false,
            connectionLimit: 10000,
            queueLimit: 10,
            connectTimeout: 10000 
          });
        const connectionStringAuth = process.env.CONNECTION_AUTH;
        const connectionStringMaster = process.env.CONNECTION_MASTER;
        const connectionStringSystem = process.env.CONNECTION_SYSTEM;

        if(connectionStringAuth){
            const objectConnection = parseConnection(connectionStringAuth);
            this.poolAuth = createPool({
                ...objectConnection,
                waitForConnections: true,
                connectionLimit: 10000,
                queueLimit: 0
            });
        }
        if(connectionStringMaster){
            const objectConnection = parseConnection(connectionStringMaster);
            this.poolMaster = createPool({
                ...objectConnection,
                waitForConnections: true,
                connectionLimit: 10000,
                queueLimit: 0
            });
        }

        if(connectionStringSystem){
            const objectConnection = parseConnection(connectionStringSystem);
            this.poolSystem = createPool({
                ...objectConnection,
                waitForConnections: true,
                connectionLimit: 10000,
                queueLimit: 0
            });
        }
        
    }

    async query(sql,connection) {
        const [rows] = await connection.query(sql);
        return rows;
    }

    async openTransaction() {
        return await this.pool.getConnection();
    }

    async closeTransaction(connection) {
        if (connection) {
            // Close the connection
            connection.release();
        }
    }

    async openAuthConnection(){
        return await this.poolAuth.getConnection();
    }

    async openMasterConnection(){
        return await this.poolMaster.getConnection();
    }

    async openSystemConnection(){
        return await this.poolSystem.getConnection();
    }
    
    static getInstance() {
        if (this._instance == null) {
            this._instance = new DatabaseHandler();
        }
        return this._instance;
    }
}