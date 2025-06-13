import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

// dotenv.config()

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) throw new Error('TOKEN is missing');
    this.bot = new Telegraf(token);
  }

  onModuleInit() {
    this.bot.start((ctx) => {
      ctx.reply(
        'Привет! Здесь ты можешь отправить мне какую-то интересную новость или просто отправить мне сообщение.',
      );
    });

    this.bot.on('text', (ctx) => {
      ctx.reply('You write');
    });

    this.bot.launch();
    console.log('Bot start');
  }
}
