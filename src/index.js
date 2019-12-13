require('dotenv').config()
const cluster = require('cluster')
const workers = process.env.WORKERS || require('os').cpus().length
const app = require('./lib/express')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

// Require the fastify framework and instantiate it

// Worker for unstopped api
if (cluster.isMaster  && !module.parent) {
  console.log('start cluster with %s workers', workers)
  for (var i = 0; i < workers; ++i) {
    var worker = cluster.fork().process;
    console.log('worker %s started.', worker.pid)
  }
  cluster.on('exit', function(worker) {
    console.log('worker %s died. restart...', worker.process.pid)
    cluster.fork()
  });
} else {
  // Require external modules
  const config = require('./config')

  if (!module.parent) {
  // Connect to DB
    mongoose.connect(config.db.url, {useNewUrlParser: true })
      .then(() => console.log('MongoDB connected...'))
      .catch(err => {
        console.log(err)
        process.exit(1)
      })
    app.listen(config.port, () => console.log(`Server start at port ${config.port}`))
    app.on('error', (e) => {
      console.error(`ERROR: ${e.message}`);
    });
  }
}

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

module.exports = app
// Run the server!
