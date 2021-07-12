const Config = require('./config')
const Controllers = require('../controllers')
const express = require('express')
const generator = require('./generator')
const router = express.Router()

//module.exports = (dependencies) => {
//  const controllers = Controllers(dependencies)
//  const routes = Config(controllers)
//  generator(router, routes)
//  return router
//}

module.exports = () => {
  const controllers = Controllers()
  const routes = Config(controllers)
  generator(router, routes)
  return router
}