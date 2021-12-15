const login = async (page, url, login, password) => {
  await page.goto(url)

  try {
    await page.waitForSelector('#login', { timeout: 3000 })
  } catch (err) {
    console.log(err.message)
    await page.click('button.ui-btn', { delay: 300 })
  }
  await page.waitForSelector('#login')

  await page.type('#login', login)
  await page.click('button.ui-btn', { delay: 300 })

  await page.waitForSelector('#password')
  await page.type('#password', password)
  await page.click('button.ui-btn', { delay: 300 })

  await page.waitForNavigation()

  console.log('\x1b[32m%s\x1b[0m', 'Login successful!')
}

// in case you'll need it you have it
const logout = async (page, url) => {
  await page.goto(url)
  await page.click('#user-block', { delay: 100 })
  await page.click('a[href^="/auth/?logout=yes"]')

  await page.waitForSelector('#authorize-layout')
}

module.exports = { login, logout }
