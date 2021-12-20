const getTaskIDs = async page =>
  await page.$$eval('a.task-title.task-status-text-color-in-progress', ids =>
    ids.map(id => id.getAttribute('href').split('/').at(-2))
  )

const getTodayTasks = async (taskIDs, page, url, worker) => {
  const projectTasks = []

  for (let id of taskIDs) {
    await page.goto(`${url}/company/personal/user/16/tasks/task/view/${id}/`, { waitUntil: 'networkidle0' })

    const project = await page.$eval('a.js-id-ms-plink-item-link.task-group-field-label', link => link.innerText)
    const task = await page.$eval('span#pagetitle', title => title.innerText)

    await page.click('span#task-time-switcher[data-id="time"]', { delay: 100 })

    // Retrieving commited hours
    const commitedHours = await page.$$eval('table#task-time-table tr.task-time-table-manually', (rows, worker) => {
      return rows
        .map(row => {
          const dateTime = row.querySelector('td.task-time-date-column span.task-time-date')
          const timeSpent = row.querySelector('td.task-time-spent-column')
          const comment = row.querySelector('.task-time-comment')
          const author = row.querySelector('td.task-time-author-column')

          if (author.innerText !== worker) return false // in case if 2 workers has the same task in bitrix.

          const date = dateTime.innerText.split(' ')[0].split('.').reverse().join('-')
          const today = new Date().toISOString().split('T')[0]

          if (date === today) {
            // Formatting commited hour structure:
            return [dateTime.innerText, timeSpent.innerText, comment.innerText]
          }
        })
        .filter(row => row && row.length)
    }, worker)

    // Formatting projectTasks structure:
    if (commitedHours.length) {
      projectTasks.push([project, task, [...commitedHours]])
    }
  }

  return projectTasks
}

module.exports = { getTaskIDs, getTodayTasks }
