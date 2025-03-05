require('dotenv').config()
const schedule = require('node-schedule')
const TelegramApi = require('node-telegram-bot-api')

const token = process.env.TOKEN
const bot = new TelegramApi(token, {polling: true})

const chat = {}

const getYearProgress = async () =>  {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1)
    const end = new Date(now.getFullYear()+1, 0, 1)

    const progress = (now - start)/(end - start)
    return (progress * 100).toFixed(2) + "%";
}

const sendNotification = async () => {
    const progress = await getYearProgress()
    await bot.sendMessage(chatId, `<b>The year 2025 is completed by <u>${progress}</u></b>🕔`, {parse_mode: 'HTML'})
}

schedule.scheduleJob("40 22 * * *", () => {
    console.log('Send message to users...')
    sendNotification();
})

const start = async () => {
    // bot.setMyCommands([
    //     {command: '/progress', description: 'Time'}
    // ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        try {
            if (text === '/start') {
                return bot.sendMessage(chatId, `Hello, <b>${msg.chat.username}</b>👋`, {parse_mode: 'HTML'})
            }
            else if (text === '/progress') {
                sendNotification()
            }
        } catch(e) {
            return bot.sendMessage(chatId, 'Error!');
        }
    })
}

start()