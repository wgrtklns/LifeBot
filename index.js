require('dotenv').config()
const schedule = require('node-schedule')
const TelegramApi = require('node-telegram-bot-api')

const token = process.env.TOKEN
const bot = new TelegramApi(token, {polling: true})

const chatsId = new Set()

const getYearProgress = async () =>  {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1)
    const end = new Date(now.getFullYear()+1, 0, 1)

    const progress = (now - start)/(end - start)
    return (progress * 100).toFixed(2) + "%";
}

const sendNotification = async () => {
    const progress = await getYearProgress()
    for (const chatId of chatsId) {
        try {
            console.log(`Message to chat: ${chatId} send`)
            await bot.sendMessage(chatId, `<b>The year 2025 is completed by <u>${progress}</u></b>🕔`, {parse_mode: 'HTML'})
        } catch (e) {
            console.error(`ChatId: ${chatsId}; Error: ${e}`)
        }
    }
    
}

schedule.scheduleJob("00 10 * * *", () => {
    console.log('Send message to users...')
    sendNotification();
})

const start = async () => {
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        chatsId.add(chatId)
        try {
            if (text === '/start') {
                return bot.sendMessage(chatId, `Hello, <b>${msg.chat.username}</b>👋`, {parse_mode: 'HTML'})
            }
            else if (text === '/progress') {
                const progress = await getYearProgress();
                await bot.sendMessage(chatId, `<b>2025 is completed by ${progress}</b>`, {parse_mode: 'HTML'})
            }
        } catch(e) {
            console.error((chatId, `Error: ${e}`))
            return bot.sendMessage(chatId, `Error!`);
        }
    })
}

start()
console.log('=======> Server started <=======')