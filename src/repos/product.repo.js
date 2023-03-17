import BaseRepo from './base.repo.js';
import ProductModel from '../models/product/product.model.js';
import Function from '../utils/function.class.js';

const tryCatchBlockForModule = Function.tryCatchBlockForModule;
const parseWhere = Function.parseWhere;
const parseSort = Function.parseSort;
const parseJoin = Function.parseJoin;
const getSelectClause = Function.getSelectClause;
const parseSkip = Function.parseSkip;
const safeParam = Function.safeParam
export default class ProductRepo extends BaseRepo {
    constructor() {
        super();
        this.model = ProductModel.getInstance();
    }

    /**
     * Lấy dữ liệu theo id
     * tbngoc 06.09.2022
     */
    getDataById = tryCatchBlockForModule(async (id,connection) => {
        // get comment
        let sqlJoin = parseJoin(this.model, 0, this.model.alias);
        let fields = ['categoryId','categoryName','productCode','productName',
        'productDescription','productImageLink','productPrice','productQuantity',
        'productStatus','productUnitTypeName','productUnitTypeId','userId']
        let sqlSelect = getSelectClause(this.model, fields);
        let sql = `SELECT ${sqlSelect || '*'} FROM ${safeParam(this.model.table)} 
        ${this.model.alias} ${sqlJoin}`;
        let filter = [{
            value: id,
            type: '=',
            field: this.model.idField
        }];
        let parseWhereValue = parseWhere(filter, this.model);
        sql += " " + parseWhereValue;
        const [resultSet] = await connection.query(sql);
        if (resultSet.length > 0) {
            let res = resultSet[0];
            if (res) {
                let relationId = res[this.model.relationField];
                // Lấy sản phẩm liên quan
                const [resultRelation] = await connection.query(`SELECT * FROM ${safeParam(this.model.table)} WHERE ${this.model.relationField}
                 = '${relationId}' AND ${this.model.idField} <> '${id}' LIMIT 10`);

                if (resultRelation && resultRelation.length > 0) {
                    let conditionInClause = '(';
                    for (let i = 0; i < resultRelation.length; i++) {
                        if (i < resultRelation.length - 1) {
                            conditionInClause += `'${resultRelation[i].productId}',`;
                        } else {
                            conditionInClause += `'${resultRelation[i].productId}'`;
                        }
                    }
                    conditionInClause += ')';
                    // Lấy ảnh của các sản phẩm liên quan
                    const [imageResult] = await connection.query(`SELECT * FROM ${safeParam(this.model.imageTable)} WHERE ${this.model.idField} IN ${conditionInClause}`);
                    if (imageResult && imageResult.length > 0) {
                        imageResult.forEach(item => {
                            let productId = item.productId;
                            let product = resultRelation.find(item1 => item1.productId == productId);
                            if (product) {
                                product.productImage = item.productImageLink;
                            }
                        })
                    }
                    res.relationProduct = resultRelation;
                }
            }
            return res;
        }
        return null;
    });

    getGroupCategoryList = tryCatchBlockForModule(async (userId,connection) => {
        let sql = `SELECT c.parentId as parentId,c.categoryId,c.categoryName FROM ${safeParam(this.model.categoryTable)} c where (c.isParent = FALSE OR c.isParent IS NULL AND c.userId = '${userId}') 
        GROUP BY c.parentId,c.categoryId,c.categoryName `;

        const [resultSet] = await connection.query(sql);

        let sqlGroupCategory = `SELECT c.categoryId as categoryId,c.categoryName as categoryName from ${this.model.categoryTable} c where c.isParent = TRUE AND c.userId = '${userId}'; `;
        const [resultGroupCategory] = await connection.query(sqlGroupCategory);

        if (resultSet && resultSet.length > 0 && resultGroupCategory && resultGroupCategory.length > 0) {
            return [...resultSet, ...resultGroupCategory]
        }
    });

    getPriceRange = tryCatchBlockForModule(async (connection) => {
        let sql = `SELECT MAX(t.productPrice) as maxPrice,MIN(t.productPrice) as minPrice from ${this.model.table} t where t.productPrice IS NOT NULL;`;
        const [resultSet] = await connection.query(sql);
        return resultSet[0];
    });

    getProductList = tryCatchBlockForModule(async (payload,connection) => {
        let sqlJoin = parseJoin(this.model, 0, this.model.alias);
        let sqlSelect = getSelectClause(this.model, payload.fields || []);
        let sqlSkip = parseSkip(payload.page, payload.size);
        let sql = `SELECT ${sqlSelect || '*'} FROM ${safeParam(this.model.table)} 
        ${this.model.alias} ${sqlJoin}`;

        let parseWhereValue = parseWhere(payload.filter, this.model);
        let parseSortValue = parseSort(payload.sortBy, payload.sortType, this.model);


        sql += " " + parseWhereValue + " " + parseSortValue + " " + sqlSkip;
        const [resultSet] = await connection.query(sql);
        let maxPage = 0;
        if (payload.page, payload.size) {
            let sqlSummary = `SELECT COUNT(*) as totalRecord FROM ${safeParam(this.model.table)} ${this.model.alias} ${sqlJoin} ${parseWhereValue || ""} ${parseSortValue};`;
            const [resultSummary] = await connection.query(sqlSummary);
            if (resultSummary) {
                let totalRecord = resultSummary[0].totalRecord;
                maxPage = Math.ceil(totalRecord / parseInt(payload.size || 0));
            }
        }

        return resultSet == null || resultSet.length === 0 ? {
            data: [],
            last_page : 0
        } : {
            data: resultSet,
            last_page : maxPage
        };
    });


    handleParallelPayload(payload,newId){
        
    }
}