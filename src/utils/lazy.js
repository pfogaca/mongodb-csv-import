const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

/**
 * @description Injeta dependencias na funcao geradora de modulos lazy
 * @param {object} dependencies
 * @returns {Function}
 */
const genLazyDirModules = (dependencies) => {

  /**
   * @description Gera um proxy para carregar todos os modulos de um caminho
   *  de forma lazy, so instancia quando requisitado pela primeira vez
   * @param {string} path
   * @returns {Proxy}
   */
  const generator = (path) => {
    const lazySubmodules = readdirSync(path).reduce((prev, curr) => {
      if (curr === 'index.js') {
        return prev
      }
      const fullPath = join(path, curr)
      prev[curr.replace('.js', '')] = lstatSync(fullPath).isDirectory()
        ? { dir: true, value: fullPath }
        : { injectable: true, value: require(`${path}/${curr}`) }
      return prev
    }, {})
    return lazyModule(lazySubmodules)
  }

  /**
   * @description Gera um proxy de um objeto
   * @param {{ ${prop}: { dir: Boolean?, injectable: Boolean?, value: any } }} props
   * @returns {Proxy}
   */
  const lazyModule = (props) => new Proxy({}, {
    get (obj, prop) {
      if (!obj[prop]) {
        const el = (props[prop] || { value: {} })
        obj[prop] = el.dir
          ? generator(el.value)
          : el.injectable ? el.value(dependencies) : el.value
      }
      return obj[prop]
    }
  })
  
  return generator
}

module.exports = { genLazyDirModules }
