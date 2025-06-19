import { Context } from 'telegraf';

export async function clearCommand(ctx: Context) {
  await ctx.reply('444');
//   need SQL DB + prisma
}
