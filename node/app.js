const { say, receive_array } = require('ssvm_nodejs_starter');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa')
const app = new Koa()

const port = 3000

app.use(bodyParser())

// Logger

app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

// Calling Rust

app.use(async ctx => {
  if (ctx.method === 'POST') {
    const { body } = ctx.request
    ctx.assert(body.numbers, 'should have "numbers" key in the body')
    const squared = receive_array(body.numbers)
    ctx.body = JSON.stringify({ transformation: Array.from(squared) })
  } else {
    ctx.assert(ctx.query.name, 'should have a query param with "name"')
    ctx.body = JSON.stringify(say(ctx.query.name))
  }
})

app.listen(port)

