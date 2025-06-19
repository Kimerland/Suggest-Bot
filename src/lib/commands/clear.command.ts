import { prisma } from 'prisma/prisma.service';
import { Context } from 'telegraf';

export async function clearCommand(ctx: Context) {
  await prisma.suggestion.deleteMany();
  await ctx.reply('Все сообщения удалены!');
}
