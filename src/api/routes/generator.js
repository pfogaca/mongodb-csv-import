/**
 * @description Cria as rotas no formato do 'config.js' no router
 * @param {Router} router
 * @param {Array} routes
 * @param {string} relativePath
 */
const createRoutes = (router, routes, relativePath = '') =>
  routes.forEach((route) => {
    const fullPath = `${relativePath}${route.path}`
    if (route.subroutes) {
      createRoutes(router, route.subroutes, fullPath)
      return
    }
    router[route.method](fullPath, route.controller)
  })

module.exports = createRoutes
