import { Context } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { prisma } from 'prisma/prisma.service';

export const handleAdminMessage = async (ctx: Context) => {
  const adminId = ctx.from?.id.toString();
  if (!adminId) return;

  if ('message' in ctx && ctx.message && 'text' in ctx.message) {
    const session = await prisma.replySession.findUnique({
      where: { adminId },
    });

    if (session) {
      await ctx.telegram.sendMessage(session.userId, ctx.message.text);

      await prisma.replySession.delete({
        where: { adminId },
      });

      await ctx.reply('✅ Ответ отправлен.');
    }
  }

  if (
    'callbackQuery' in ctx &&
    ctx.callbackQuery &&
    'data' in ctx.callbackQuery
  ) {
    const callback = ctx.callbackQuery as CallbackQuery.DataQuery;

    if (callback.data.startsWith('reply:')) {
      const userId = callback.data.split(':')[1];

      await prisma.replySession.upsert({
        where: { adminId },
        update: { userId, createdAt: new Date() },
        create: { adminId, userId },
      });

      await ctx.reply('Напишите ответ пользователю:');
    }
  }
};
