import { SlashCommand, CommandOptionType } from "slash-create";

import { ansiColor, Table } from "../utils.js";

const commandHint = [
  "```ansi\n" + ansiColor("/way", "white", 0),
  ansiColor("[ZONE]", "yellow", 0),
  ansiColor("[XX.XX]", "red", 0),
  ansiColor("[YY.YY]", "green", 0),
  ansiColor("[DESCRIPTION]", "blue", 0),
  "```",
];

const zone = [
  [ansiColor("NOM DE LA ZONE", "blue", 1), ansiColor("IDENTIFIANT", "yellow", 1)],
  ["Rivages de l'Éveil", `#2022`],
  ["Plaines d'Ohn'ahra", `#2023`],
  ["Travée Azur", `#2024`],
  ["Thaldraszus", `#2025`],
  ["Valdrakken", `#2112`],
];

const tableConfig = {
  columns: [{ paddingRight: 3 }, { alignment: "center" }],
};

export default class Tomtom extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "tomtom",
      description: "Affiche les identifiants des zones pour tomtom",
      guildIDs: creator.client,
      defaultPermission: false,
      requiredPermissions: ["MANAGE_GUILD"],
      options: [
        {
          type: CommandOptionType.STRING,
          name: "zone",
          description: "Quelle zone ?",
          required: true,
          choices: [
            {
              name: "Dragonflight",
              value: "dragonflight",
            },
          ],
        },
      ],
    });
  }

  async run(ctx) {
    return commandHint.join(" ") + "```ansi\n" + Table(zone, tableConfig) + "```";
  }
}
