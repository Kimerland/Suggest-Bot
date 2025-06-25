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

    if (callback.data.startsWith('ban:')) {
      const userId = callback.data.split(':')[1];
      const isBanned = await prisma.bannedUser.findUnique({
        where: { userId },
      });

      if (isBanned) {
        await ctx.reply('Пользователь уже заблокирован.');
        return;
      }

      const last = await prisma.suggestion.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      await prisma.bannedUser.create({
        data: {
          userId,
          reason: 'Fake all',
          username: last?.username
            ? `@${last.username}`
            : last?.firstName || userId,
        },
      });

      const suggestions = await prisma.suggestion.findMany({
        where: { userId },
      });

      for (const suggestion of suggestions) {
        try {
          await ctx.telegram.deleteMessage(
            suggestion.chatId,
            suggestion.messageId,
          );
        } catch (e) {
          console.error(`Не удалось удалить  ${suggestion.messageId}:`, e);
        }
      }

      await prisma.suggestion.deleteMany({ where: { userId } });
      await ctx.reply('Пользователь заблокирован и его сообщения удалены.');
    }

    if (callback.data.startsWith('clear:')) {
      const userId = callback.data.split(':')[1];
      const suggestions = await prisma.suggestion.findMany({
        where: { userId },
      });

      for (const suggestion of suggestions) {
        try {
          await ctx.telegram.deleteMessage(
            suggestion.chatId,
            suggestion.messageId,
          );
        } catch (e) {
          console.error(`Не удалось удалить ${suggestion.messageId}:`, e);
        }
      }

      await prisma.suggestion.deleteMany({ where: { userId } });
      await ctx.reply('Предложения пользователя очищены.');
    }

    if (callback.data.startsWith('delete:')) {
      const userId = ctx.callbackQuery.message?.message_id;
      const chatId = ctx.callbackQuery.message?.chat.id;
      if (userId && chatId) {
        await ctx.telegram.deleteMessage(chatId, userId);
      }
    }

    if (callback.data.startsWith('info:')) {
      const userId = callback.data.split(':')[1];
      const last = await prisma.suggestion.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (!last) {
        await ctx.reply('Пользователь не найден или у него нет предложений.');
        return;
      }

      const info = `👤 Имя: ${last.firstName || '-'} ${last.lastName || ''}
      \n🔗 Username: @${last.username || 'не указан'}
      \n🆔 ${last.userId}`;

      await ctx.reply(info);
    }

    if (callback.data.startsWith('unban:')) {
      const userId = callback.data.split(':')[1];
      await prisma.bannedUser.delete({ where: { userId } });
      await ctx.reply(`Пользователь ${userId} был разблокирован.`);
    }

    if (callback.data === 'close') {
      const messageId = ctx.callbackQuery.message?.message_id;
      const chatId = ctx.callbackQuery.message?.chat.id;
      if (messageId && chatId) {
        await ctx.telegram.deleteMessage(chatId, messageId);
      }
    }
  }
};
