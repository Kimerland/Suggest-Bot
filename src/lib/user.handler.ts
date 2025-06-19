import { Context } from 'telegraf';

export const handleUserMessage = async (ctx: Context, adminId: string) => {
  const message = ctx.message;
  if (!message) return;

  if ('sticker' in message || 'voice' in message || 'animation' in message) {
    await ctx.reply('Тип сообщения не поддерживается.');
    return;
  }

  const from = ctx.from;
  if (!from) return;

  const userInfo = `👤 Сообщение от пользователя:
  Username: @${from.username || 'нет'}
  ID: ${from.id}
  Имя: ${from.first_name} ${from.last_name || ''}`;

  if ('text' in message) {
    await ctx.telegram.sendMessage(
      adminId,
      `${userInfo}\n\n Сообщение: \n${message.text}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Ответить',
                callback_data: `reply:${from.id}`,
              },
            ],
          ],
        },
      },
    );
  }

  if ('photo' in message) {
    const photo = message.photo[message.photo.length - 1].file_id;
    await ctx.telegram.sendPhoto(adminId, photo, {
      caption: userInfo,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Ответить',
              callback_data: `reply:${from.id}`,
            },
          ],
        ],
      },
    });
  }

  await ctx.reply('Спасибо за ваше сообщение!');
};
