import BaseRepo from "./base.repo.js";
import CategoryModel from "../models/category.js";


export default class CategoryRepo extends BaseRepo {
    constructor() {
        super();
        this.model = CategoryModel.getInstance()
    }
}
