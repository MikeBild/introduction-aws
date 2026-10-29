const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()

invokeE2E()

function invokeE2E() {
  const params = {
    FunctionName: 'e2e-puppeteer-function',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify({})
  }

  lambda.invoke(params, function (err, data) {
    if (err) return console.error(err)

    console.log(data.Payload)
  })
}