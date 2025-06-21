import { prisma } from 'prisma/prisma.service';
import { Context } from 'telegraf';

export async function clearCommand(ctx: Context) {
  const suggestions = await prisma.suggestion.findMany({
    where: { chatId: ctx.from?.id.toString() },
  });

  for (const suggestion of suggestions) {
    try {
      await ctx.telegram.deleteMessage(suggestion.chatId, suggestion.messageId);
    } catch (err) {
      console.warn(
        `Не удалось удалить сообщение ${suggestion.messageId}:`,
        err.message,
      );
    }
  }

  await prisma.suggestion.deleteMany({
    where: { chatId: ctx.from?.id.toString() },
  });
  await ctx.reply(`✅ Удалено сообщений из чата: ${suggestions.length}`);
}
