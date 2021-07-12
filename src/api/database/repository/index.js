const { genLazyDirModules } = require('../../../utils/lazy')

module.exports = (dependencies) => genLazyDirModules(dependencies)(__dirname)
