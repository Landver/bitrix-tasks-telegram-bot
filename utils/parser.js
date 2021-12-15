const { readFileSync, writeFile } = require('fs')

const puppeteer = require('puppeteer')

const { login } = require('./authentication')
const { getTaskIDs, getTodayTasks } = require('./queries')
const { convertDateTime, strToMs, msToHours } = require('./serializers')

// Reading previous script launch time from file:
const { lastLaunchTime } = JSON.parse(readFileSync(`${__dirname}/../last_launch_time.json`, { encoding: 'utf-8' }))

const { BASE_URL, LOGIN, PASSWORD } = process.env
const WORKERS = JSON.parse(process.env.WORKERS)

// Initial string report that will be returned from main function
let stringReport = ''

module.exports = async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    env: process.env,
    userDataDir: './user_data',
  })

  console.log('\x1b[33m%s\x1b[0m', 'Parser launched...')

  const page = await browser.newPage()

  // Test for login state
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
    await page.waitForSelector('table[id^="TASKS_GRID"]', { timeout: 2000 })
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', 'Authentication error!')
    console.log('\x1b[33m%s\x1b[0m', 'Trying to login...')
    await login(page, BASE_URL, LOGIN, PASSWORD)
  }

  for (const workerID in WORKERS) {
    console.log(`Parsing ${[WORKERS[workerID]]}...`)

    await page.goto(`${BASE_URL}/company/personal/user/${workerID}/tasks/`, { waitUntil: 'networkidle0' })
    await page.waitForSelector('table[id^="TASKS_GRID"]', { timeout: 10000 })

    const taskIDs = await getTaskIDs(page)
    const tasksToday = await getTodayTasks(taskIDs, page, BASE_URL) // Get all tasks with hours commited today

    // Sum of all commited hours for today
    let timeSum = 0
    tasksToday.map(([ , , tasks]) => {
      tasks.map(([, timeSpent]) => {
        timeSum += strToMs(timeSpent)
      })
    })

    // Filter today tasks to get those with new commited hours
    const newestTasks = tasksToday
      .map(([projectName, taskName, tasks]) => [
        projectName,
        taskName,
        tasks.filter(([dateTime]) => Date.parse(convertDateTime(dateTime)) > lastLaunchTime),
      ])
      .filter(task => task[2].length > 0)

    // Initilize object to store individual workers report
    const workerReport = {}

    // Setting report object fields to be projects names
    for (let [projectName] of newestTasks) {
      workerReport[projectName] = []
    }

    // Filling report object with task data
    newestTasks.map(([projectName, taskName, tasks]) => {
      workerReport[projectName].push({
        task: taskName,
        hours: [...tasks],
      })
    })

    // Formatting a string from report object
    if (Object.keys(workerReport).length) {
      stringReport += `<b><u>${WORKERS[workerID]}:</u></b>\nTotal hours: ${msToHours(timeSum)}\n\n`
      for (const project in workerReport) {
        stringReport += `<u>${project}</u>:\n\n${workerReport[project].map(
          ({ task, hours }) =>
            `<b>${task}</b>:\n${hours.map(
              ([dateTime, timeSpent, comment]) => `<code>${dateTime.slice(11, -3)} ${timeSpent.slice(0, 5)}</code> - ${comment}\n`
            )}`
        )}\n`.replace(/,/g, '')
      }
    }
  }

  // Writing current time as new lauch time to file
  const newLaunchTime = { lastLaunchTime: Date.now() - 180000 } // workaround: substracting 2 min to prevent losing tasks that commited while script is running
  writeFile(`${__dirname}/../last_launch_time.json`, JSON.stringify(newLaunchTime), err => {
    if (err) {
      console.log(err)
      return
    }

    console.log('\x1b[32m%s\x1b[0m', 'Parsing successful')
  })

  await browser.close()

  return stringReport
}
