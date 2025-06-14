import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { handleAdminMessage } from 'src/lib/admin.handler';
import { handleUserMessage } from 'src/lib/user.handler';
import { Telegraf } from 'telegraf';

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

    const adminId = this.configService.get<string>('ADMIN_CHAT_ID');
    if (!adminId) return;

    this.bot.on('message', (ctx) => {
      if (ctx.from.id.toString() === adminId) {
        handleAdminMessage(ctx);
      } else {
        handleUserMessage(ctx, adminId);
      }
    });

    this.bot.on('callback_query', (ctx) => {
      handleAdminMessage(ctx);
    });

    this.bot.launch();
    console.log('Bot start');
  }
}
