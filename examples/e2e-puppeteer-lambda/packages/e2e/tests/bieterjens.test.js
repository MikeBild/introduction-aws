const username = process.env.USERNAME_BID
const password = process.env.PASSWORD_BID
const baseUrl = process.env.BASE_URL

describe('Bieter User - Standardansicht', () => {
  var pageLive;

  beforeAll(async () => {
    jest.setTimeout(20000)
    const pageLogin = await browser.newPage();
    await pageLogin.goto(`${baseUrl}/login.html`, { waitUntil: 'networkidle2' })

    const usernameInput = await pageLogin.$('#login_email')
    await usernameInput.type(username)
    const passwordInput = await pageLogin.$('#login_password')
    await passwordInput.type(password)

    await Promise.all([
      pageLogin.evaluate(() => document.querySelector('#action').click()),
      browser.waitForTarget(target => target.url() === `${baseUrl}/my_activity.html`),
    ])

    await pageLogin.close();

    pageLive = await browser.newPage();
  })

  afterAll(async () => {
    const page = await browser.newPage();
    await page.goto(`${baseUrl}/logout.html`, { waitUntil: 'networkidle2' })
    pageLive.close
  })

  test(`Benutzername ${username} biete auf aktiven Artikel`, async () => {
    
    await pageLive.goto(`${baseUrl}/live_bid_panel/index.php?language=de`, { waitUntil: 'networkidle2' });

    var r;
    
      await pageLive.evaluate(() => document.querySelector('#save_inet_bid').click());
      r = Math.random()*5000;
      await pageLive.waitFor(r);
    
      await pageLive.evaluate(() => document.querySelector('#save_inet_bid').click());
      r = Math.random()*5000;
      await pageLive.waitFor(r);
    
      await pageLive.evaluate(() => document.querySelector('#save_inet_bid').click());
      r = Math.random()*5000;
      await pageLive.waitFor(r);
    
      await pageLive.evaluate(() => document.querySelector('#save_inet_bid').click());
      r = Math.random()*5000;
      await pageLive.waitFor(r);
    
      await pageLive.evaluate(() => document.querySelector('#save_inet_bid').click());
      r = Math.random()*5000;
      await pageLive.waitFor(r);
    
      await pageLive.evaluate(() => document.querySelector('#save_inet_bid').click());
      r = Math.random()*5000;
      await pageLive.waitFor(r);
    
      await pageLive.evaluate(() => document.querySelector('#save_inet_bid').click());
      r = Math.random()*5000;
      await pageLive.waitFor(r);

  })
})