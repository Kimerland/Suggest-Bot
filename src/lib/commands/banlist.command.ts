import { Context } from 'telegraf';

export async function banlistCommand(ctx: Context) {
  await ctx.reply('banlist is empty');
  //   need SQL DB + prisma (mac not win)
}
