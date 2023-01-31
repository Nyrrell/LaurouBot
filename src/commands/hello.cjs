const { SlashCommand, CommandOptionType } = require("slash-create");

module.exports = class HelloCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "hello",
      description: "Says hello to you.",
      guildIDs: "578303060108116002",
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
    return ctx.options.food
      ? `You like ${ctx.options.food}? Nice!`
      : `Wesh, ${ctx.member.displayName}!`;
  }
};