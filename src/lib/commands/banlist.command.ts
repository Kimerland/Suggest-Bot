import { Context, Markup } from 'telegraf';
import { prisma } from 'prisma/prisma.service';

export async function banlistCommand(ctx: Context) {
  const banned = await prisma.bannedUser.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  if (!banned.length) {
    await ctx.reply('Список заблокированных пользователей пуст.');
    return;
  }

  const buttons = banned.map((user) => [
    Markup.button.callback(
      `${user.username || user.userId}`,
      `unban:${user.userId}`,
    ),
  ]);

  buttons.push([Markup.button.callback('« Закрыть »', 'close')]);

  await ctx.reply('📃 BanList \nPage 1/1', Markup.inlineKeyboard(buttons));
}
