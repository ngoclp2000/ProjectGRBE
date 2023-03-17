
export const baseRoute = (router,controller) =>{
    router.post('/',controller.insertAsync);
    router.post('/dataTable',controller.getDataTable);
}
