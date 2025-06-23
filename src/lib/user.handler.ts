import { prisma } from 'prisma/prisma.service';
import { Context } from 'telegraf';

export const handleUserMessage = async (ctx: Context, adminId: string) => {
  const message = ctx.message;
  if (!message) return;

  if ('sticker' in message || 'voice' in message || 'animation' in message) {
    await ctx.reply('Тип сообщения не поддерживается.');
    return;
  }

  if (!ctx.from || !ctx.chat) {
    await ctx.reply('Не удалось получить информацию о пользователе или чате.');
    return;
  }

  const text = 'text' in message ? message.text : '';
  const userId = ctx.from?.id.toString();
  const chatId = ctx.chat.id.toString();
  const messageId = message.message_id;

  const from = ctx.from;
  if (!from) return;

  await prisma.suggestion.create({
    data: { userId, chatId, messageId, text },
  });

  const userInfo = `👤 ${from.first_name} ${from.last_name || ''}`;

  const sent = await ctx.telegram.sendMessage(
    adminId,
    `${text}
    \n ${userInfo}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🚫', callback_data: `ban:${from.id}` },
            { text: '🧹', callback_data: `clear:${from.id}` },
            { text: '🗑', callback_data: `delete:${from.id}` },
          ],
          [
            { text: '📝', callback_data: `note:${from.id}` },
            { text: '👤', callback_data: `info:${from.id}` },
          ],
          [{ text: 'Ответить', callback_data: `reply:${from.id}` }],
        ],
      },
    },
  );
  const isBanned = await prisma.bannedUser.findUnique({ where: { userId } });
  if (isBanned) {
    await ctx.reply('Вы заблокированы и не можете отправлять сообщения.');
    return;
  }

  await prisma.suggestion.create({
    data: {
      userId,
      chatId: adminId,
      messageId: sent.message_id,
      text: text || '',
    },
  });

  await ctx.reply('Спасибо за ваше сообщение!');
};
