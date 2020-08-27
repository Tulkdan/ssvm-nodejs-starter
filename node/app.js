const { say } = require('ssvm_nodejs_starter');
const Koa = require('koa')
const app = new Koa()

const port = 3000

// Calling Rust

app.use(async (ctx, next) => {
  ctx.assert(ctx.query.name, 'should have a query param with "name"')

  ctx.state.compliment = say(ctx.query.name)
  await next()
})

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

// response

app.use(async ctx => {
  ctx.body = JSON.stringify(ctx.state)
})

app.listen(port)

