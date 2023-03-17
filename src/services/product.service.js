import ProductRepo from "../repos/product.repo.js";
import ErrorCode from '../shared/enums/errorCode.js';
import FilterType from '../shared/enums/filterType.js';
import DatabaseHandler from "../utils/database.test.js";
import BaseService from "./base.service.js";

const database = DatabaseHandler.getInstance();
const productRepo = new ProductRepo();

export default class ProductService extends BaseService{
    constructor(){
        super(productRepo);
    }

    /**
     * Lấy sản phẩm theo productID
     * @param {*} productId 
     * @returns Sản phẩm
     * tbngoc 17.12.2022
     */
    async getProductById(productId) {
        const connection = await database.openTransaction();
        try {
            let res = await productRepo.getDataById(productId, connection);
            if (res) {
                res.productStatus = !!res.productStatus;
            }
            return res;
        } catch (error) {

        } finally {
            database.closeTransaction(connection);
        }

    }

    /**
     * Lấy danh sách dữ liệu bảng
     * @param {*} payload 
     * @returns 
     * tbngoc 17.12.2022
     */
    async getDataTable(payload) {
        const connection = await database.openTransaction();
        try {
            return await productRepo.getDataTable(payload, connection);
        } catch (error) {

        } finally {
            database.closeTransaction(connection);
        }
    }
    /**
     * Lấy danh sách filter sản phẩm
     * @param {*} userId 
     * @returns 
     * tbngoc 17.12.2022
     */
    async getProductManage(userId) {
        const connection = await database.openTransaction();
        try {
            let resData = [];
            // Phân loại
            let groupCategoryList = await productRepo.getGroupCategoryList(userId, connection);
            if (groupCategoryList != null) {
                resData.push({
                    data: groupCategoryList,
                    type: FilterType.Tree,
                    id: 'categoryId',
                    parentId: 'parentId',
                    nameField: 'categoryName',
                    name: 'Category',
                    field: 'categoryId'
                });
            }


            // Khoảng giá
            let priceRangeFilter = await productRepo.getPriceRange(connection);
            if (priceRangeFilter != null) {
                resData.push({
                    data: {
                        min: priceRangeFilter.minPrice,
                        max: priceRangeFilter.maxPrice
                    },
                    type: FilterType.Range,
                    name: 'Range Price',
                    field: 'productPrice'
                });
            }

            // rating(mặc định)
            resData.push({
                type: FilterType.Rate,
                name: 'Star Rating',
                field: 'productRate'
            });

            return {
                code: ErrorCode.None,
                data: resData
            }
        } catch (error) {

        } finally {
            database.closeTransaction(connection);
        }

    }

    /**
     * Lấy danh sách sản phẩm
     * @param {*} payload 
     * @returns 
     * tbngoc 17.12.2022
     */
    async getProductList(payload) {
        const connection = await database.openTransaction();
        try {
            // Add filter user 
            if (payload.filter && Array.isArray(payload.filter)) {
                payload.filter.push({
                    "type": "=",
                    "field": "userId",
                    "value": payload.userID
                });
            }

            let productListData = await productRepo.getProductList(payload, connection);
            if (productListData && productListData.data && Array.isArray(productListData.data)) {
                productListData.data.forEach(item => {
                    item.productRate = parseFloat(item.productRate || '0');
                });
            }
            return productListData;
        } catch (err) {
            throw err;
        } finally {
            database.closeTransaction(connection);
        }
    }

    handleBeforeInsert(payload){
        payload.productRate = 0;
        payload.productDiscount = 0;
    }

    static getInstance() {
        if (this._instance == null) {
            this._instance = new ProductService();
        }
        return this._instance;
    }
}