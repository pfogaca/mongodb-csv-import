const moment = require('moment')
const DbRep = require('./repository')
const MongoClient = require('mongodb').MongoClient

/**
 * @description Cria uma instancia de MongoClient
 * @param {string} database
 * @returns {MongoClient}
 */
const createDbInstance = (database) => {

  return MongoClient.connect(database, { 
    'useNewUrlParser': true,
    'authSource': 'admin',
    auth :{
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    }
  })
}

module.exports = {
  createDbInstance,
  DbRep
}
