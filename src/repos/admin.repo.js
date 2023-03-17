
import BaseRepo from './base.repo.js';
import Function from '../utils/function.class.js';
import StoreName from '../shared/constants/storeName.js';
const tryCatchBlock = Function.tryCatchBlockForModule;
const callStore = Function.callStore;

export default class AdminRepo extends BaseRepo{
    constructor(param){
        super(param);
    }

    summaryInformation = tryCatchBlock( async (userId,connection) =>{
        // khởi tạo sql
        if(userId && connection){
            // Call store lấy thông tin thu, chi
            const resDashboard = await callStore({
                userId: userId,
            },StoreName.GetDashboardInformation,connection);

            if(resDashboard){
                return resDashboard[0];
            }
        }
    });

    summaryDetailInformation = tryCatchBlock( async (payload,connection) =>{
        // khởi tạo sql
        if(payload && connection){
            const resDashboard = await callStore(payload,StoreName.GetDashboardDetailInformation,connection);
            if(resDashboard){
                return resDashboard[0];
            }
        }
    });

    getSalesStatus = tryCatchBlock( async (payload,connection) =>{
        if(payload && connection){
            const resDashboard = await callStore(payload,StoreName.GetSalesStatus,connection);
            if(resDashboard){
                return [...resDashboard[0], ...resDashboard[1]];
            }
        }
    });

    getProductStatus = tryCatchBlock( async (payload,connection) =>{
        if(payload && connection){
            const resDashboard = await callStore(payload,StoreName.GetProductStatus,connection);
            if(resDashboard){
                return resDashboard;
            }
        }
    })

    getCategoryStatus = tryCatchBlock( async (payload,connection) =>{
        if(payload && connection){
            const resDashboard = await callStore(payload,StoreName.GetCategoryStatus,connection);
            if(resDashboard){
                return resDashboard;
            }
        }
    })

    getRelationBetweenTransactionAndUser = tryCatchBlock( async (payload,connection) =>{
        if(payload && connection){
            const resDashboard = await callStore(payload,StoreName.GetRelationBetweenTransactionAndUser,connection);
            return resDashboard;
        }
    })

    getDashboardLastAndCurrentCategoryProduct = tryCatchBlock( async (payload,connection) =>{
        if(payload && connection){
            const resDashboard = await callStore(payload,StoreName.GetDashboardLastAndCurrentCategoryProduct,connection);
            if(resDashboard){
                return resDashboard;
            }
        }
    })
}