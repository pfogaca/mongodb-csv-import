/**
 * @description Rotas
 *  Array de rotas: { path: String, subroutes: Array }
 *  Rota: { path: String, method: String, controller: Function }
 */
module.exports = (controllers) => [
    {
        path: '/',
        method: 'get',
        controller: (_, res) => res.send('RESTful API Import MongoDB')
    },
    {
        path: '/update/company',
        method: 'get',
        controller: controllers.update.update.companyController
    },
    {
        path: '/update/stocks',
        method: 'get',
        controller: controllers.update.update.stockController
    }
]
