const {
  	createResponse,
  	sendError,
  	RequestError
} = require('../../../utils/request')

const https = require('https')
const moment = require('moment')
const csv = require('csv-parser')
const maxTries = 3
const fs = require('fs');

/**
 * @description Coleta informações da empresa
 * @param callback
 */
function retrieveCompanyInfo() {
    fs.readFile('company.csv', (err, data) => {
        if (err) throw err

        const str = data.toString()
        const strArray = str.split("\n")
        const resultArr = new Array()

        strArray.forEach(function(item) {
            const i = item.split("|")
            resultArr.push(i)
        })

        saveJSONFile(resultArr, 'company.json')
    })
}

/**
 * @description Coleta informações de ação
 * @param callback
 */
function retrieveDailyChanges() {
    fs.readFile('daily_change.csv', (err, data) => {
        if (err) throw err

        const str = data.toString()
        const strArray = str.split("\n")
        const resultArr = new Array()

        strArray.forEach(function(item) {
            const i = item.split(",")
            const tempObj = {
                date: String(i[0]),
                open: Number(i[1]),
                close: Number(i[4]),
                high: Number(i[2]),
                low: Number(i[3]),
                volume: Number(i[6])
            }
            resultArr.push(tempObj)
        })

        saveJSONFile(resultArr, 'daily_change.json')
    })
}

/**
 * @description Coleta informações de movimentos
 * @param callback
 */
function retrieveStockInfo() {
    fs.createReadStream('stock.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            return results
    })
}

function saveJSONFile(data, jsonFile) {
    console.log(JSON.stringify(data))
    fs.writeFileSync(jsonFile, JSON.stringify(data), function(err) {
        if (err) throw err

        console.log("The file was saved!")
    })
}

//module.exports = ({ dbRep }) => {
module.exports = () => {

    /**
     * @description Atualiza ou cria dados de empresa
     */
    const companyController = async (req, res) => {
        const companyInfo = await retrieveCompanyInfo()

        return(res.send('Sucesso'))

        return res.json(createResponse({
		    data: companyInfo,
		    message: 'Empresa criaada'
	    }))

        const checkCollection = await dbRep.update.checkCollection(companyInfo.name) //TODO limpar nome para criar collection

        if (checkCollection[0]) {
            return sendError(res, dbError, 'Erro ao conferir collection')
        }

        if (!checkCollection[1]) {
            await dbRep.update.createCollection(companyInfo.name) //TODO limpar nome para criar collection
        }

        const company = {
            name:       companyInfo.name,
            created_at: companyInfo.created_at,
            country:    companyInfo.country
        }

        await dbRep.update.updateCollection(company, companyInfo.name) //TODO limpar nome para criar collection

        return res.json(createResponse({
		    data: company,
		    message: 'Empresa criada'
	    }))
    }

    /**
     * @description Atualiza ou cria dados de ações
     */
    const stockController = async (req, res) => {
        const test = await retrieveDailyChanges()

        return(res.send('Sucesso'))


        const companyInfo = retrieveCompanyInfo()
        const stockInfo = retrieveStockInfo()
        const dailyChanges = retrieveDailyChanges()

        const checkCollection = await dbRep.update.checkCollection(companyInfo.name) //TODO limpar nome para criar collection

        if (checkCollection[0]) {
            return sendError(res, checkCollection[0], 'Erro ao conferir collection')
        }

        if (!checkCollection[1]) {
            return sendError(res, null, 'Empresa não existe')
        }

        const stock = {
            name:           stockInfo.name,
            market_name:    stockInfo.market_name,
            currency_name:  stockInfo.currency_name,
            currency:       stockInfo.currency,
            daily_change:   dailyChanges
        }

        await dbRep.update.updateCollection(company, companyInfo.name) //TODO limpar nome para criar collection
    }

    return {
        companyController,
        stockController,
    }
}