const login = async (page, url, login, password) => {
  await page.goto(url)

  try {
    await page.waitForSelector('#login', { timeout: 3000 })
  } catch (err) {
    console.log(err.message)
    await page.click('button.ui-btn', { delay: 300 })
  }
  await page.waitForSelector('#login')
  // await page.screenshot({ path: './screenshots/1.init.png' })

  await page.type('#login', login)
  // // await page.screenshot({ path: './screenshots/2.after_filling_login.png' })
  await page.click('button.ui-btn', { delay: 300 })
  // // await page.screenshot({ path: './screenshots/3.after_login_button_click.png' })

  await page.waitForSelector('#password')
  // // await page.screenshot({ path: './screenshots/4.after_navigate_to_pass.png' })
  await page.type('#password', password)
  // // await page.screenshot({ path: './screenshots/5.after_filling_pass.png' })
  await page.click('button.ui-btn', { delay: 300 })

  await page.waitForNavigation()
  // // await page.screenshot({ path: './screenshots/6.after_login.png' })

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
