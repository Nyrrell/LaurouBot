import { ButtonStyle, SlashCommand } from "slash-create";

import { Raid_Boss_Components } from "../components/Raid_Boss_Components.js";
import { findComponent } from "../utils.js";

const component = new Raid_Boss_Components();

export default class Raid_boss_checker extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "raid",
      description: "Initialisation du suivi de boss",
      guildIDs: creator.client,
      defaultPermission: false,
      requiredPermissions: ["MANAGE_GUILD"],
      options: [component.commandsOptions],
    });
  }

  async run(ctx) {
    await ctx.defer();
    const mode = component.commandsOptions.choices.find((mode) => mode.value === ctx.options.mode);

    await ctx.send({
      embeds: [component.embedInteraction(mode)],
      components: component.componentInteraction(),
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
