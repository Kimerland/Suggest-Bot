import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { handleAdminMessage } from 'src/lib/admin.handler';
import { banlistCommand } from 'src/lib/commands/banlist.command';
import { clearCommand } from 'src/lib/commands/clear.command';
import { helpCommand } from 'src/lib/commands/help.command';
import { handleUserMessage } from 'src/lib/user.handler';
import { Markup, Telegraf } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) throw new Error('TOKEN is missing');
    this.bot = new Telegraf(token);
  }

  adminKeyBoard = Markup.keyboard([
    ['🧹 Очистить предложку (/rm)'],
    ['ℹ️ Помощь (/help)', '🚫 Banlist (/banlist)'],
  ]).resize();

  onModuleInit() {
    const adminId = this.configService.get<string>('ADMIN_CHAT_ID');
    if (!adminId) return;

    this.bot.start((ctx) => {
      if (ctx.from.id.toString() === adminId) {
        ctx.reply(
          'Бот запущен, нижняя клавиатура загружена!',
          this.adminKeyBoard,
        );
      } else {
        ctx.reply(
          'Привет! Здесь ты можешь отправить мне какую-то интересную новость или просто отправить мне сообщение.',
        );
      }
    });

    this.bot.hears('🧹 Очистить предложку (/rm)', clearCommand);

    this.bot.hears('ℹ️ Помощь (/help)', helpCommand);

    this.bot.hears('🚫 Banlist (/banlist)', banlistCommand);

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
