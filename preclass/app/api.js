import jsonwebtoken from 'jsonwebtoken'
import { once } from 'node:events'
import { createServer } from 'node:http'

const VALID = {
  user: 'erickwendel',
  password: '123'
}
const TOKEN_KEY = "abc123"

async function loginRoute(request, response) {
  const { user, password } = JSON.parse(await once(request, "data"))
  if (user !== VALID.user || password !== VALID.password) {
    response.writeHead(400)
    response.end(JSON.stringify({ error: 'user invalid!' }))
    return
  }

  const token = jsonwebtoken.sign({ user, message: 'heyduude' }, TOKEN_KEY)

  response.end(JSON.stringify({ token }))
}

function validateHeaders(headers) {
  try {
    const auth = headers.authorization.replace(/bearer\s/ig, '')
    jsonwebtoken.verify(auth, TOKEN_KEY)
    return true
  } catch (error) {
    return false
  }
}

async function handler(request, response) {
  if (request.url === '/login' && request.method === "POST") {
    return loginRoute(request, response)
  }

  if (!validateHeaders(request.headers)) {
    response.writeHead(400)
    return response.end(JSON.stringify({ result: "invalid token!" }))
  }

  response.end(JSON.stringify({ result: 'Hey welcome!' }))  
}

const app = createServer(handler)
  .listen(3000, () => console.log('listening to 3000'))

export { app }