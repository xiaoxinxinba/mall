const api = {
  prod: require('./api/api.prod'),
  dev: require('./api/api.dev'),
  test: require('./api/api.test'),
  pre: require('./api/api.pre'),
  '0.64': require('./api/api.0.64'),
  '0.56': require('./api/api.0.56')
}
module.exports = {
  state: api[process.env.API_HOST]
}
