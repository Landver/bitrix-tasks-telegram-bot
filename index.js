const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.BOT_TOKEN)

const parseWorkersForNewTasks = require('./utils/parser')

const sendReport = async () => {
  // Get string report from parser
  const report = await parseWorkersForNewTasks()
  if (!report) {
    console.log('\x1b[33m%s\x1b[0m', 'No new tasks found...')
    return
  }

  // Send report via telegram bot
  bot.sendMessage(process.env.CHAT_ID, report, {
    parse_mode: 'HTML',
  })

  console.log('\x1b[32m%s\x1b[0m', 'Report sent')
}

sendReport()
