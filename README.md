# Bitrix bot reporting of commited hours

### To launch script run `npm start`

**After every launch puppeteer stores all cache, cookies and other information in `user_data` directory.**

> There may be issue at first launch, if there is no `user_data` directory, or if it is not empty. In this case you need to _empty_ `user_data` directory.

If authentication fails at first login puppeteer implements login logic running function exported from `utils/login.js`.

For now login function saving screenshots of different login stages into `screenshots` directory.
