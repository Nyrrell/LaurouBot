import { CommandOptionType, ComponentType, TextInputStyle } from "slash-create";

import { Base_Components } from "./Base_Components.js";

export class Youtube_Components extends Base_Components {
  commandsOptions = {
    type: CommandOptionType.STRING,
    name: "mode",
    description: "Que voulez vous faire ?",
    required: true,
    choices: [
      { name: "Lister", value: "list" },
      { name: "Ajouter", value: "add" },
      { name: "Modifier", value: "update" },
      { name: "Supprimer", value: "remove" },
      ],
  };

  selectYoutubeChannel = (channels, customId) => ({
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.STRING_SELECT,
        custom_id: customId,
        placeholder: "Fait un choix",
        options: channels.map((channel) => ({
          label: channel.title,
          value: channel.channelId,
        })),
      },
      ],
  });

  embedListChannel = (channels) => ({
    title: "🎬   Liste des chaines youtube suivies",
    color: this.color.green,
    description:
      "‎\n" +
      channels
        .map(
                (channel) =>
            `**• ${channel.title}**\n` +
            `> https://youtube.com/${channel.customUrl ? channel.customUrl : `/channel/${channel.channelId}`}\n` +
            `> Mis à jour ‧ \`${new Date(channel["updatedAt"]).toLocaleString("fr-FR", { dateStyle: "short" })}\`\n\n`
            )
        .join(""),
  });

  embedChannel = (channel) => ({
    title: channel["snippet"]["title"],
    description: channel["snippet"]["description"],
    url: "https://www.youtube.com/channel/" + channel["id"],
    color: this.color.red,
    thumbnail: {
      url: channel["snippet"]["thumbnails"]["default"]["url"],
    },
  });

  paragraphInput = ({}) => ({
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.TEXT_INPUT,
        label: "Message de la notification",
        style: TextInputStyle.PARAGRAPH,
        custom_id: "notification",
        value:
          "Ajouter la balise {role} pour définir l'emplacement du role dans le message\n" +
          "Ajouter la balise {lien} pour définir l'emplacement du lien de la vidéo\n" +
          "Example : Bonjour {role} voici le lien d'une video à regarder : {lien}",
      },
      ],
  });

  embedNotification = (message) => ({
    color: this.color.blue,
    title: "Apercu du message de notification :",
    description: message,
  });

  embedSummary = (collector) => ({
    color: this.color.blue,
    title: "Récapitulatif de la saisie :",
    fields: [
      {
        name: "Chaine à suivre :",
        value: collector["youtubeChannel"]?.["snippet"]?.["title"] || collector["username"],
      },
      {
        name: "Message de notification :",
        value: collector["notification"].replaceAll("{role}", `<@&${collector["role"]}>`),
      },
      ],
  });
}
