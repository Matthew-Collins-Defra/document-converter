const hapi = require('hapi')
const config = require('./config')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  const validate = async (request, username, password, h) => {
    console.log('validate called')
    if ((username === 'user') && (password === 'LetMeIn')) {
      return { isValid: true, credentials: { id: 'user', username: 'user' } }
    } else {
      request.response.header('WWW-Authenticate', 'Basic realm=Authorization Required')
      return { isValid: false, credentials: null }
    }
  }

  // Register the plugins
  await server.register(require('hapi-auth-basic'))
  await server.auth.strategy('simple', 'basic', { validate: validate })
  await server.register(require('inert'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/api'))

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  return server
}

module.exports = createServer
