import Function from '../utils/function.class.js';
const tryCatchBlockForModule = Function.tryCatchBlockForModule;
const buildSelectWithField = Function.buildSelectWithField;
const parseSkip = Function.parseSkip;
const parseWhere = Function.parseWhere;
const parseSort = Function.parseSort;
const getSelectClause = Function.getSelectClause;
const parseJoin = Function.parseJoin;
const normalizeResult = Function.normalizeResult;
const safeParam = Function.safeParam;
const buildInsertParams = Function.buildInsertParams;
const takeFieldFromModel = Function.takeFieldFromModel;
export default class BaseRepo {
    constructor() {}



    /**
     * Lấy dữ liệu theo id
     */
    getDataById = tryCatchBlockForModule(async (id, connection) => {
        // get comment
        const [rows, fields] = await connection.query(`SELECT * FROM ${safeParam(this.model.table)} WHERE ${this.model.idField} = '${id}'`);
        if (rows) {
            return rows[0];
        }
    });
    /**
     * Lấy id mới
     */
    getNewId = tryCatchBlockForModule(async (connection) => {
        const [rows, fields] = await connection.query(`SELECT UUID() as newId;`);
        if (rows && rows.length > 0) {
            const newId = rows[0].newId;
            return newId;
        }
    })

    getAsyncAllData = tryCatchBlockForModule(async (connection) => {
        const sql = `SELECT * FROM ` + safeParam(this.model.table) + ` WHERE 1=1;`;
        const [resultSet] = await connection.query(sql);
        return resultSet == null || resultSet.length === 0 ? null : resultSet;
    });

    getAsyncByFields = tryCatchBlockForModule(async (mappingFieldsValues, connection) => {
        if (mappingFieldsValues != null) {
            let sql = buildSelectWithField(mappingFieldsValues, this.model.table);
            if (sql != null && sql != '') {
                const [resultSet] = await connection.query(sql);
                return resultSet == null || resultSet.length === 0 ? null : resultSet;
            }
        }
        return null;
    });

    getDataTable = tryCatchBlockForModule(async (payload, connection) => {
        const columnArray = payload.columns.split(',');
        let sqlSelect = getSelectClause(this.model, columnArray);
        let sqlJoin = parseJoin(this.model, 0, this.model.alias);
        let sql = `SELECT ${sqlSelect} FROM ${safeParam(this.model.table)} ${this.model.alias} ${sqlJoin}`;

        let parseWhereValue = parseWhere(payload.filter, this.model);
        let parseSortValue = parseSort(payload.sortBy, payload.sortType, this.model);
        sql += " " + parseWhereValue + " " + parseSortValue + " ";

        if (payload) {
            sql += parseSkip(payload.page, payload.size);
        }
        const [resultSet] = await connection.query(sql);
        let sqlSummary = `SELECT COUNT(*) as totalRecord FROM ${safeParam(this.model.table)} ${this.model.alias} ${parseWhereValue || ""} ${parseSortValue};`;

        const [resultSummary] = await connection.query(sqlSummary);
        let maxPage = 0;
        if (resultSummary) {
            let totalRecord = resultSummary[0].totalRecord;
            maxPage = Math.ceil(totalRecord / parseInt(payload.size || 0));
        }

        return resultSet == null || resultSet.length === 0 ? {
            data: [],
            last_page: 0
        } : {
            data: resultSet,
            last_page: maxPage
        };
    })

    authenAdminRequest = tryCatchBlockForModule(async (userId, connection) => {
        if (userId) {
            let adminRoleName = 'admin';
            let sql = `SELECT * FROM user u  join role r on u.roleId = r.roleId where r.roleName = '${adminRoleName}' and u.userId = '${userId}'`;
            const [resultSet] = await connection.query(sql);
            if (resultSet && resultSet[0]) {
                return true;
            }
        }
        return false;
    });

    getDataCombobox = tryCatchBlockForModule(async (payload, userId, connection) => {
        let model = this.model;
        if (model) {
            let sqlSelect = getSelectClause(model, payload.fields || []);
            let sql = `SELECT ${sqlSelect || '*'} FROM ${safeParam(model.table)} ${model.alias} `;

            let parseWhereValue = parseWhere(payload.filter, model);
            let parseSortValue = parseSort(payload.sortBy, payload.sortType, model);

            sql += " " + parseWhereValue + " " + parseSortValue;

            let [resultSet] = await connection.query(sql);

            // 
            if (resultSet && resultSet.length > 0) {
                if (resultSet[0].hasOwnProperty("userId")) {
                    resultSet = resultSet.filter(item => item.userId == userId);
                }
                normalizeResult(resultSet);

                resultSet.forEach(item => {
                    if (payload.chosenOption) {
                        if (item[payload.chosenOption.idField] == payload.chosenOption.idValue) {
                            item.isChosen = true;
                        } else {
                            item.isChosen = false;
                        }
                    }
                });
            }
            return resultSet == null || resultSet.length === 0 ? [] : resultSet;
        }
    });

    insertAsync = tryCatchBlockForModule(async (payload, connection) => {
        var res = true;
        if (payload) {
            const newId = await this.getNewId(connection);
            let validPayload = takeFieldFromModel(this.model, payload);
            let sql = buildInsertParams(this.model.idField, this.model.table, validPayload, this.model.controllerName, newId);
            const [resultSet] = await connection.query(sql);
            res = res && resultSet.affectedRows > 0;
            // Tìm bảng cần add liên quan
            if (res) {
                if (this.model.relationTable && Array.isArray(this.model.relationTable)) {
                    const modelParallelAdd = this.model.relationTable.filter(item => item.parallelAdd);
                    if (modelParallelAdd && Array.isArray(modelParallelAdd)) {
                        // Tạo ra payload cần add
                        const parallelAddPayload = this.handleParallelPayload(payload, newId);
                        for (let i = 0; i < modelParallelAdd.length; i++) {
                            if (res) {
                                const model = modelParallelAdd[i].model;
                                const newSubId = await this.getNewId(connection);
                                payload[modelParallelAdd[i].foreignKey] = newId;
                                validPayload = takeFieldFromModel(model, {
                                    ...payload,
                                    ...parallelAddPayload
                                });
                                sql = buildInsertParams(model.idField, model.table, validPayload,model.controllerName,newSubId);
                                const [resSub] = await connection.query(sql);
                                res = res && resSub.affectedRows > 0;
                            }
                        }
                    }
                }
            }

        }
        return res;
    })

    handleParallelPayload(){
        return {

        }
    }
}