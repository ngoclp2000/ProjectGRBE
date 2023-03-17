import BaseRepo from './base.repo.js';
import ShippingSupply from '../models/order/shippingSupply.model.js';

export default class ShippingSupplyRepo extends BaseRepo {
    constructor() {
        super();
        this.model = ShippingSupply.getInstance()
    }

}