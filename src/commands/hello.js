import { SlashCommand } from "slash-create";

class HelloCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "hello",
			description: "Dire bonjour à l'utilisateur",
      guildIDs: creator.client,
      defaultPermission: false,
      requiredPermissions: ["MANAGE_GUILD"],
    });
  }

  async run(ctx) {
    return `Wesh alors, ${ctx.member.displayName}!`;
  }
}

export { HelloCommand as Command };
