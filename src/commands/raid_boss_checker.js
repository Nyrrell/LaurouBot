import { ButtonStyle, CommandOptionType, ComponentType, SlashCommand } from "slash-create";

import { choices, raid_component } from "../components/raid_boss.js";
import { findComponent } from "../utils.js";

export default class Raid_boss_checker extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "raid",
      description: "Initialisation du suivi de boss",
      guildIDs: creator.client,
      defaultPermission: false,
      requiredPermissions: ["MANAGE_GUILD"],
      options: [
        {
          type: CommandOptionType.STRING,
          name: "mode",
          description: "En quelle difficulté ?",
          required: true,
          choices,
        },
      ],
    });
  }

  async run(ctx) {
    await ctx.defer();
    const mode = choices.find((mode) => mode.value === ctx.options.mode);

    await ctx.send({
      embeds: [
        {
          title: `**Caveau des incarnations**`,
          description: `Suivi des boss en difficulté **${mode.name}**`,
          color: parseInt(mode.color, 16),
        },
      ],
      components: raid_component.map((gate) => ({
        type: ComponentType.ACTION_ROW,
        components: gate.map((boss) => ({
          type: ComponentType.BUTTON,
          style: ButtonStyle.DESTRUCTIVE,
          label: boss.label,
          custom_id: boss.custom_id,
        })),
      })),
    });
  }

  async interaction(ctx) {
    if (!ctx.member.permissions.has("MANAGE_GUILD"))
      return await ctx.send({
        content: "Tu n'as pas les droits nécessaires.",
        ephemeral: true,
      });

    const { components } = ctx.message;

    const component = findComponent(components, ctx.customID);
    component.style = component.style === ButtonStyle.DESTRUCTIVE ? ButtonStyle.SUCCESS : ButtonStyle.DESTRUCTIVE;

    await ctx.editParent({
      components: components,
    });
  }
}
