import md5 from "md5";
import BaseModel from "./baseModel.js";
import DataTypes from "../shared/enums/dataType.js";

export default class User extends BaseModel {
    constructor(param) {
        let data = {};
        data.table = 'user';
        data.idField = 'userId';
        super(data);
        this.controllerName = 'Account';
        this.alias = 'u';
        if (param && param.password) {
            this.password = param.password ? md5(param.password) : "";
        }

        this.fields = {
            userId: {
                type: DataTypes.String,
            },
            username: {
                type: DataTypes.String,
            },
            phoneNumber: {
                type: DataTypes.String,
            },
            address: {
                type: DataTypes.String,
            },
            email: {
                type: DataTypes.String,
            },
            status: {
                type: DataTypes.Boolean,
            },
            password: {
                type: DataTypes.String,
            },
            fullName: {
                type: DataTypes.String,
            },
            avatar: {
                type: DataTypes.String,
            },
            roleId:{
                type: DataTypes.String,
            }
        }
        
        
    }
    static getInstance(){
        if(this.instance == null){
            this.instance = new User();
        }
        return this.instance;
    }
}