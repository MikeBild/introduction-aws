const dotenv = require('dotenv')
const { App } = require('@aws-cdk/core')
const E2EPuppeteer = require('./stack')

const app = new App()

new E2EPuppeteer(app, 'E2E-Puppeteer', {
  ...dotenv.config().parsed,
})

app.synth()