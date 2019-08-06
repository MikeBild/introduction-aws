const jest = require('jest')
const chrome = require('chrome-aws-lambda')

const baseUrl = process.env.BASE_URL

module.exports = { run, test }

async function run() {
  await jest.run(['./tests'])
}

async function test() {
  let browser
  let page

  browser = await chrome.puppeteer.launch({
    args: chrome.args,
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
    slowMo: 0,
    devtools: true,
    timeout: 0,
  })
  page = await browser.newPage()

  const result = await page.goto(`${baseUrl}/live_bid_panel/index.php?language=de`, { waitUntil: 'networkidle2' })
  const title = await page.title()

  console.log({ title })
}