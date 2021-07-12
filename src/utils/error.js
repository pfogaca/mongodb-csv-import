/**
 * @description Encapsula um try...catch para um await
 * @param {Async} target
 * @param {Function} mapper
 * @returns {[ error: Error?, data: any? ]}
 */
const safeAwait = async (target, mapper = (el) => el) => {
  try {
    return [
      null,
      mapper(await (typeof target === 'function' ? target() : target))
    ]
  } catch (err) {
    return [ err, null ]
  }
}

module.exports = { safeAwait }
