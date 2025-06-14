import { Context } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { replyMap } from 'src/lib/reply.model';

export const handleAdminMessage = async (ctx: Context) => {
  if ('message' in ctx && ctx.message && ctx.from) {
    const replying = replyMap.get(ctx.from.id);

    if (replying && 'text' in ctx.message) {
      await ctx.telegram.sendMessage(
        replying,
        `Ответ от администратора: \n${ctx.message.text}`,
      );
      await ctx.reply('Ответ отправлен');
      replyMap.delete(ctx.from.id);
    }
  }

  if (
    'callbackQuery' in ctx &&
    ctx.callbackQuery &&
    'data' in ctx.callbackQuery &&
    ctx.from
  ) {
    const callback = ctx.callbackQuery as CallbackQuery.DataQuery;

    if (callback.data?.startsWith('reply:')) {
      const userId = callback.data.split(':')[1];
      replyMap.set(ctx.from.id, parseInt(userId));
      await ctx.reply('Напишите ответ пользователю:');
    }
    return;
  }
};
