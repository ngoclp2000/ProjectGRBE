import BaseModel from "./baseModel.js";
import DataTypes from "../shared/enums/dataType.js";

export default class Category extends BaseModel {
    constructor(param) {
        let data = {};
        data.table = 'category';
        data.idField = 'categoryId';
        super(data);
        this.controllerName = 'Category';
        this.alias = 'c';

        this.fields = {
            categoryId: {
                type: DataTypes.String,
            },
            categoryName: {
                type: DataTypes.String,
            },
            parentId: {
                type: DataTypes.String,
            },
            isParent: {
                type: DataTypes.Boolean,
            },
            userId:{
                type: DataTypes.String
            }
        }
        
        
    }
    static getInstance(){
        if(this.instance == null){
            this.instance = new Category();
        }
        return this.instance;
    }
}