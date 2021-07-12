// Erro customizado para os throws das requisicoes
class RequestError extends Error {
  constructor (message, httpCode = 500) {
    super(message)
    this.httpCode = httpCode
  }
}

/**
 * @description Encapsula o controller em uma Promise e trata excecoes
 * @param {function} fn
 * @returns {Function}
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch((error) => sendError(res, error, req.t('errors.internal')))
}

/**
 * @description Cria o objeto padrao de resposta
 * @param {{ data: object, error: Boolean, message: String }} params
 * @returns {Json}
 */
const createResponse = ({ data = null, error = false, message = '' }) => ({
  data,
  error,
  message
})

/**
 * @description Retorna um erro na response
 * @param {Response} res
 * @param {Error} error
 * @param {string} defaultMessage
 */
const sendError = (res, error, defaultMessage = 'Internal Error') => {
  // Esconde o conteudo das excecoes desconhecidas lancadas em producao
  if (process.env.NODE_ENV !== 'dev' && !(error instanceof RequestError)) {
    error = new Error(defaultMessage)
  }
  // Adiciona a stack em ambiente de desenvolvimento
  if (process.env.NODE_ENV === 'dev') {
    error.message += ` (${error.stack.replace(/\s+/g, ' ')})`
  }
  res.status(error.httpCode || 500).json(createResponse({
    error: true,
    message: error.message || '500'
  }))
}

module.exports = {
  RequestError,
  asyncHandler,
  createResponse,
  sendError
}
