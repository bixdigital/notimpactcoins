import { NextApiRequest, NextApiResponse } from 'next';
import TelegramBot from 'node-telegram-bot-api';

// Initialize the Telegram bot
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error('Telegram bot token is missing. Check your .env file.');
}

const bot = new TelegramBot(token);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Process the webhook update from Telegram
      const update = req.body;
      const chatId = update.message?.chat?.id;

      if (update.message?.text === '/start') {
        await bot.sendMessage(chatId, 'Welcome to NotImpactCoin Bot!');
      } else if (update.message?.text === '/boost') {
        await bot.sendMessage(chatId, 'Boost functionality is under development.');
      } else {
        await bot.sendMessage(chatId, `You said: ${update.message?.text}`);
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing Telegram update:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(404).send('Not Found');
  }
}
