import { CommandOptionType, SlashCommand } from "slash-create";

export class HelloCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "hello",
      description: "Says hello to you.",
      guildIDs: creator.client,
      defaultPermission: false,
      requiredPermissions: ["MANAGE_GUILD"],
      options: [
        {
          type: CommandOptionType.STRING,
          name: "food",
          description: "What food do you like?",
        },
      ],
    });
  }

  async run(ctx) {
    return ctx.options.food ? `You like ${ctx.options.food}? Nice!` : `Wesh alors, ${ctx.member.displayName}!`;
  }
}
