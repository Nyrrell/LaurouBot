import { ButtonStyle, CommandOptionType, ComponentType } from "slash-create";

import { Base_Components } from "./Base_Components.js";

export class Raid_Boss_Components extends Base_Components {
  commandsOptions = {
    type: CommandOptionType.STRING,
    name: "mode",
    description: "En quelle difficulté ?",
    required: true,
    choices: [
      {
        name: "Normal",
        value: "normal",
        color: "27ae60",
      },
      {
        name: "Hardcore",
        value: "hardcore",
        color: "c0392b",
      },
      {
        name: "Mythique",
        value: "mythic",
        color: "f39c12",
      },
    ],
  };

  embedInteraction = (mode) => ({
    title: `**Caveau des incarnations**`,
    description: `Suivi des boss en difficulté **${mode.name}**`,
    color: parseInt(mode.color, 16),
  });

  componentInteraction = () =>
    this.raid_component.map((gate) => ({
      type: ComponentType.ACTION_ROW,
      components: gate.map((boss) => ({
        type: ComponentType.BUTTON,
        style: ButtonStyle.DESTRUCTIVE,
        label: boss.label,
        custom_id: boss.custom_id,
      })),
    }));

  raid_component = [
    [
      { label: "Éranog", custom_id: "eranog" },
      { label: "Le Conseil", custom_id: "council" },
      { label: "Dathéa", custom_id: "dathea" },
    ],
    [
      { label: "Kurog", custom_id: "kurog" },
      { label: "Sennarth", custom_id: "sennarth" },
      { label: "Terros", custom_id: "terros" },
    ],
    [
      { label: "Diurna", custom_id: "diurna" },
      { label: "Raszageth", custom_id: "raszageth" },
    ],
  ];
}
