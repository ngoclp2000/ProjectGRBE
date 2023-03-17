import mappingField from "../helpers/mappingField.js";
import optionFilter from "../shared/enums/optionFilter.js";
import DataTypes from "../shared/enums/dataType.js";
import moment from "moment/moment.js";

export default class Function {
    static tryCatchBlockForModule(passInFunc){
        return async (...args) =>{
            try{
                return await passInFunc(...args);

            }catch(error){
                console.error(error);
            }
        }
    }

    static tryCatchBlockForController(schema, passInFunc){
        return async (req, res, next) => {
            if (schema) {
                //const validateRequest = ajv.compile(schema);
                //const validRequest = validateRequest(req.body);
                //if (!validRequest) return next(new HttpError("REQUEST_FAIL_INVALID_SCHEMA", 400));
            }
            try {
                return await passInFunc(req, res, next);
            } catch (error) {
                console.log("Error in tryCatchBlockForController:::", error);
                return res.status(500).send();
            }
        };
    }

    static buildInsertParams(idField, table, payload, controllerName, newIdValue){
        table = '`' + table + '`';
        let sql = `INSERT INTO ${table}{0} VALUES{1};`;
        let sqlValuesArray = [newIdValue],
            sqlFieldsArray = [idField];
        if (payload && typeof payload == 'object') {
            for (const [key, value] of Object.entries(payload)) {
                let keyMap = key;
                if (mappingField[controllerName] && mappingField[controllerName][key]) {
                    keyMap = mappingField[controllerName][key];
                }
                sqlFieldsArray.push(keyMap);
                sqlValuesArray.push(value);
            }
            // Xử lý nhóm dữ liệu
            let sqlFields = sqlFieldsArray.join(',');
            let sqlValues = "";
            for (let i = 0; i < sqlValuesArray.length; i++) {
                if (typeof sqlValuesArray[i] === 'string') {
                    sqlValues += "'" + sqlValuesArray[i] + "'";
                } else {
                    sqlValues += sqlValuesArray[i];
                }

                if (i != sqlValuesArray.length - 1) {
                    sqlValues += ',';
                }
            }
            sqlFields = '(' + sqlFields + ')';
            sqlValues = '(' + sqlValues + ')';
            sql = sql.format(sqlFields, sqlValues);
            return sql;
        }
    }

    static buildUpdateWithParams(idField, table, payload, controllerName){
        let sql = `UPDATE ${table} SET {0} WHERE ${idField} = ${typeof IdValue === 'string' ? "'" + IdValue + "'" : IdValue};`;
        let sqlValuesArray = [],
            sqlFieldsArray = [];
        if (payload && typeof payload == 'object') {
            for (const [key, value] of Object.entries(payload)) {
                if (key != idField) {
                    sqlFieldsArray.push(mappingField[controllerName][key] || key);
                    sqlValuesArray.push(value);
                }
            }
            // Xử lý nhóm dữ liệu
            let sqlSetParam = '';
            for (let i = 0; i < sqlValuesArray.length; i++) {
                if (typeof sqlValuesArray[i] === 'string') {
                    sqlSetParam += sqlFieldsArray[i] + "='" + sqlValuesArray[i] + "'";
                } else {
                    sqlSetParam += sqlFieldsArray[i] + "=" + sqlValuesArray[i];
                }

                if (i != sqlValuesArray.length - 1) {
                    sqlSetParam += ',';
                }
            }

            sql = sql.format(sqlSetParam);
            return sql;
        }
    }

    static buildSelectWithField(mappingFieldsValues, table){
        let sql = "",
            where = "";
        if (mappingFieldsValues != null) {
            let whereArray = [];
            for (const [key, value] of Object.entries(mappingFieldsValues)) {
                whereArray.push(`${"`" +key + "`"} = ${typeof value === 'string' ? "'" + value + "'" : value}`);
            }
            if (whereArray.length > 0) {
                where = whereArray.join('AND');
                sql += `SELECT * FROM ${this.safeParam(table)} WHERE ${where};`;
            }
        }
        return sql;
    }

    static getTokenFromRequest(req){
        return req.headers.authorization.split(" ")[1];
    }

    static parseWhere(filters, model){
        let sql = "",
            arrayWhere = [];
        if (filters && Array.isArray(filters) && filters.length > 0) {
            filters.forEach(item => {
                let whereClause = Function.getWhereClause(model,item.field,item.type,item.value,item.ors);
                if(whereClause){
                    arrayWhere.push(whereClause);
                }
            });
        }

        sql = arrayWhere.join(" AND ");
        if (sql != null && sql != "") {
            sql = " WHERE " + sql;
        }
        return sql;
    }

    static parseSkip(page,size){
        if (page && size) {
            const pageInt = parseInt(page),
                sizeInt = parseInt(size);
            return `LIMIT ${size} OFFSET ${(pageInt - 1) * sizeInt}`;
        }
        return "";
    }

    static parseSort(field, type,model){
        let sql = "";
        if (field != null && Array.isArray(field) && type && Array.isArray(type) && field.length > 0 && type.length > 0) {
            sql = " ORDER BY ";
            for (let i = 0; i < field.length; i++) {
                let alias = Function.getAlias(model,field[i]);
                sql += ` ${alias}.${field[i]} ${type[i]} ${i == field.length - 1 ? "" : ","}`;
            }
        }
        return sql;
    }

    static parseJoin(model,type, alias){
        let sql = "",
            joinArray = [];
        // JOIN orderproduct o ON p.productId = o.productId
        if (model && model.relationTable && Array.isArray(model.relationTable)) {
            let relationTableType = model.relationTable.filter(item => item.type == type);
            relationTableType.forEach(item => {
                let joinSQL = `LEFT JOIN ${item.model.table} ${item.model.alias} ON ${alias}.${item.foreignKey} = ${item.model.alias}.${item.foreignKey}`;
                joinArray.push(joinSQL);
            });
            sql = joinArray.join(' ');
        }
        return sql;
    }

    static getAlias(model,field){
        if (model && model.fields) {
            if (model.fields[field] != null) {
                return model.alias;
            }
            if (model.relationTable && Array.isArray(model.relationTable)) {
                for (let i = 0; i < model.relationTable.length; i++) {
                    let modelRelationTable = model.relationTable[i].model;
                    if (modelRelationTable && modelRelationTable.fields && modelRelationTable.fields[field] != null) {
                        return modelRelationTable.alias;
                    }
                }
            }
        }
        return "";
    }

    static getWhereClause(model, field,type,valueField,ors=null){
        let keyword = Function.getKeywordOperator(type);
        const orsWhereArray = [];
        const mainWhereClause =  Function.getSingleWhereClause(model,field,valueField,keyword,type);
        if( ors != null && Array.isArray(ors) && ors.length > 0){
           ors.forEach(item => {
                let keywordOrs = Function.getKeywordOperator(item.type);
                const orsWhereClause = Function.getSingleWhereClause(model,item.field,item.value,keywordOrs,item.type);
                orsWhereArray.push(orsWhereClause);
            })
            orsWhereArray.push(mainWhereClause);
        }else{
            orsWhereArray.push(mainWhereClause);
        }
        if(orsWhereArray.length > 0){
            return '(' + orsWhereArray.join(' OR ') +')';
        }else{
            return '';
        }
    }

    static getSelectClause(model,fieldList){
        let selectArray = [];
        if(fieldList && Array.isArray(fieldList)){
            fieldList.forEach(field =>{
                let exist = false;
                if (model && model.fields) {
                    if (model.fields[field] != null) {
                        exist = true;
                        selectArray.push(`${model.alias}.${field}`);
                    }
                    if (model.relationTable && Array.isArray(model.relationTable) && !exist) {
                        for (let i = 0; i < model.relationTable.length; i++) {
                            let modelRelationTable = model.relationTable[i].model;
                            if (modelRelationTable && modelRelationTable.fields && modelRelationTable.fields[field] != null) {
                                selectArray.push(`${modelRelationTable.alias}.${field}`);
                            }
                        }
                    }
                }
            })
        }
        
        return selectArray.join(',');
    }

    static getKeywordOperator(type){
        let keyword = "";
        switch (type) {
            case optionFilter.Like:
                keyword = "LIKE";
                break;
            case optionFilter.Equal:
                keyword = "=";
                break;
            case optionFilter.NotEqual:
                keyword = "!=";
                break;
            case optionFilter.GreaterThan:
                keyword = ">";
                break;
            case optionFilter.LessThan:
                keyword = "<";
                break;
            case optionFilter.GreaterThanOrEqual:
                keyword = ">=";
                break;
            case optionFilter.LessThanOrEqual:
                keyword = "<=";
                break;
            case optionFilter.In:
                keyword = "IN";
            case optionFilter.Between:
                keyword = "between";
                break;
        }
        return keyword;
    }

    static getSingleWhereClause(model,field,valueField,keyword,type){
        let fieldsConfig = null,value = "";
        if (model && model.fields) {
            if (model.fields[field] != null) {
                fieldsConfig = model.fields[field];
            }
            if (model.relationTable && Array.isArray(model.relationTable) && !fieldsConfig) {
                for (let i = 0; i < model.relationTable.length; i++) {
                    let modelRelationTable = model.relationTable[i].model;
                    if (modelRelationTable && modelRelationTable.fields && modelRelationTable.fields[field] != null) {
                        fieldsConfig = modelRelationTable.fields[field];
                        break;
                    }
                }
            }
        }
        if (fieldsConfig != null ) {
            let fieldType = fieldsConfig.type;
            switch (fieldType) {
                case DataTypes.Number:
                    switch (type) {
                        case optionFilter.Between:
                            if (Array.isArray(valueField)) {
                                value += valueField[0] + " AND " + valueField[1];
                            }
                            break;
                        default:
                            value = valueField;
                            break;
                    }
                    break;
                case DataTypes.Boolean:
                    value = valueField;
                    break;
                case DataTypes.String:
                    switch (type) {
                        case optionFilter.Like:
                            value = "'%" + valueField + "%'";
                            break;
                        default:
                            value = "'" + valueField + "'";
                            break;
                    }
                    break;
                case DataTypes.Date:
                    break;
            }
            let alias = Function.getAlias(model, field);

            return `${alias}.${field} ${keyword} ${value}`;
        }
    }
    static takeFieldFromModel(model,payload){
        const resModel = {};
        if(model && model.fields ){
            for (var key of Object.keys(model.fields)) {
                if(key != model.idField){
                    resModel[key] = payload[key];
                }
            }
        }
        return resModel;
    }

    static async callStore(params,storeName,connection){
        let sql = '';
        const paramValues = [];
        if(params){
            let placeholders = '';
            Object.keys(params).forEach((key,index) => {
                if (index !== 0) { // if not the first parameter
                    placeholders += ', '; // add a comma before the next placeholder
                  }
                  placeholders += `?`; // add a named placeholder for the parameter
                  paramValues.push(params[key]); // add the parameter value to the array
            });
            sql =`CALL ${storeName}(${placeholders})`;
        }   

        if(sql){
            const [rows, fields] = await connection.execute(sql, paramValues);
            if(rows && rows.length > 2){
                return rows.slice(0, -1);
            }
            return rows[0];
        }
    }

    static parseConnection(connectionString){
        if(connectionString){
            const arrayInformation = connectionString.split(';');
            const objectConnection = {

            };
            if(arrayInformation && Array.isArray(arrayInformation) && arrayInformation.length > 0){
                arrayInformation.forEach(item =>{
                    const [key,value] = item.split(':');
                    objectConnection[key] = value;
                });
            }
            return objectConnection;
        }
    }

    static normalizeResult(result){
        if(result && Array.isArray(result)){
            result.forEach(item =>{
                for (const [key, value] of Object.entries(item)) {
                    if(value instanceof Buffer){
                        const bitValue = value.readUintLE(0, value.length);
                        if(bitValue !== undefined){
                            item[key] = !!bitValue;
                        }
                    }
                }
            });
        }
    }

    static normalizeDateTime(dateTime){
        if(dateTime){
            const datetimeConvert = moment.utc(dateTime).local();
            if(datetimeConvert){
                return datetimeConvert.format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }

    static safeParam(param){
        return '`' + param + '`';
    }
}