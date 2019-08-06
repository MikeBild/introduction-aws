const username = process.env.USERNAME_AUKTIONATOR
const password = process.env.PASSWORD_AUKTIONATOR
const baseUrl = process.env.BASE_URL

describe('Bieter User - Standardansicht', () => {
  var pageLive

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
    await pageLive.goto(`${baseUrl}/live_bid_panel/index.php?language=de`, { waitUntil: 'networkidle2' });

  })

  afterAll(async () => {
    await pageLive.close();
    const pageLogout = await browser.newPage();
    await pageLogout.goto(`${baseUrl}/logout.html`, { waitUntil: 'networkidle2' })
  })

  test(`Benutzername ${username} mit gültigem Passwort sollte sich anmelden können`, async () => {
    const page = await browser.newPage();
    await page.goto(`${baseUrl}`, { waitUntil: 'networkidle2' })

    const found = (await page.content()).match("My Van Ham")
    await expect(found[0]).toBe("My Van Ham")

    await page.close();
  })

  test(`User kann sich in das Live Panel einloggen als USER`, async () => {
    
    //Prüfen ob User wirklich eingeloggt ist
    const found = (await pageLive.content()).match("ausgeloggt")
    if (found != null) {
      await expect(found[0]).not.toBe("ausgeloggt")
    }


    
  })

  test(`Gebote abgeben in Live Panel`, async () => {
    if (pageLive.$('#save_inet_bid_by_auctioneer').length == 0) {
      await expect(false).toBe(true)
    }

    await pageLive.evaluate(() => document.querySelector('#save_inet_bid_by_auctioneer').click())

    /*
    await pageLive.waitFor(2000);
    await pageLive.evaluate(() => document.querySelector('#save_hall_bid').click());
    await pageLive.waitFor(2000);
    await pageLive.evaluate(() => document.querySelector('#save_hall_bid').click());
    await pageLive.waitFor(2000);
    await pageLive.evaluate(() => document.querySelector('#save_hall_bid').click());
*/
  })
})