require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')

const token = process.env.TOKEN
const bot = new TelegramApi(token, {polling: true})

const chat = {}

const start = async () => {
    bot.setMyCommands([
        {command: '/start', description: 'Start'}
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        try {
            if (text === '/start') {
                return bot.sendMessage(chatId, 'Hello, world!')
            }
            return bot.sendMessage(chatId, text)
        } catch(e) {
            return bot.sendMessage(chatId, 'Error!');
        }
    })
}

start()