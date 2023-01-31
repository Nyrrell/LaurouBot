const { SlashCommand, ComponentType, ButtonStyle } = require("slash-create");

module.exports = class HelloCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "raid",
      description: "Initialisation du suivi de boss",
      guildIDs: "578303060108116002",
    });
  }

  async run(ctx) {
    await ctx.defer();
    await ctx.send("**Caveau des incarnations - Aile 1**", {
      components: [
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.BUTTON,
              style: ButtonStyle.DESTRUCTIVE,
              label: "Éranog",
              custom_id: "eranog",
            },
            {
              type: ComponentType.BUTTON,
              style: ButtonStyle.DESTRUCTIVE,
              label: "Dathéa",
              custom_id: "dathea",
            },
            {
              type: ComponentType.BUTTON,
              style: ButtonStyle.DESTRUCTIVE,
              label: "Le Conseil",
              custom_id: "council",
            },
          ],
        },
      ],
    });
  }
};
