// bot.js
const { Telegraf } = require('telegraf');
const axios = require('axios');
const { TELEGRAM_TOKEN, TRANSLATE_API_KEY, TRANSLATE_API_URL } = require('./config');

const bot = new Telegraf(TELEGRAM_TOKEN);

// Початкове вітання
bot.start((ctx) => {
    ctx.reply("Привіт! Я бот-перекладач. Введи текст для перекладу.");
});

// Обробка тексту для перекладу
bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    
    ctx.reply("На яку мову перекласти? Введи код мови (наприклад, en, uk, fr тощо).");
    
    bot.once('text', async (ctx) => {
        const targetLang = ctx.message.text;
        
        try {
            const response = await axios.get(TRANSLATE_API_URL, {
                params: {
                    q: text,
                    target: targetLang,
                    key: TRANSLATE_API_KEY
                }
            });
            
            const translatedText = response.data.translations[0].translatedText;
            ctx.reply(`Ось переклад: ${translatedText}`);
        } catch (error) {
            console.error(error);
            ctx.reply("На жаль, сталася помилка при перекладі. Спробуйте ще раз.");
        }
    });
});

// Запуск бота
bot.launch();
