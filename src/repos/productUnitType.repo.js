import BaseRepo from './base.repo.js';
import ProductUnitTypeModel from '../models/product/productUnitType.model.js';


export default class ProductUnitTypeRepo extends BaseRepo {
    constructor() {
        super();
        this.model = ProductUnitTypeModel.getInstance()
    }

    
}