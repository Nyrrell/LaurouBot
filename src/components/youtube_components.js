import { ButtonStyle, CommandOptionType, ComponentType, TextInputStyle } from "slash-create";

export const commandsOptions = {
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

export const textInputUsername = {
  type: ComponentType.ACTION_ROW,
  components: [
    {
      type: ComponentType.TEXT_INPUT,
      label: "Nom de la chaine",
      style: TextInputStyle.SHORT,
      custom_id: "username",
    },
  ],
};

export const paragraphInputNotification = {
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
};

export const selectRole = {
  type: ComponentType.ACTION_ROW,
  components: [
    {
      type: ComponentType.ROLE_SELECT,
      custom_id: "role",
    },
  ],
};

export const continueButton = (customID, label = "Continuer") => ({
  type: ComponentType.ACTION_ROW,
  components: [
    {
      type: ComponentType.BUTTON,
      style: ButtonStyle.SUCCESS,
      custom_id: customID ? `${customID}:continue` : "continue",
      label: label,
    },
    {
      type: ComponentType.BUTTON,
      style: ButtonStyle.DESTRUCTIVE,
      custom_id: customID ? `${customID}:stop` : "stop",
      label: "Annuler",
    },
  ],
});

export const embedListChannel = (channels) => ({
  title: "🎬   Liste des chaines youtube suivies",
  color: parseInt("27ae60", 16),
  description:
    "‎\n" +
    channels
      .map(
        (channel) =>
          `**• ${channel.title}**\n` +
          `> https://youtube.com/${channel.customUrl ? channel.customUrl : `/channel/${channel.channelId}`}\n` +
          `> Mis à jour ‧ \`${new Date(channel["updated_at"]).toLocaleString("fr-FR", { dateStyle: "short" })}\`\n\n`
      )
      .join(""),
});

export const embedChannel = (channel) => ({
  title: channel["snippet"]["title"],
  description: channel["snippet"]["description"],
  url: "https://www.youtube.com/channel/" + channel["id"],
  color: parseInt("ff0000", 16),
  thumbnail: {
    url: channel["snippet"]["thumbnails"]["default"]["url"],
  },
});

export const embedNotification = (message) => ({
  color: parseInt("2980b9", 16),
  description: message,
});

export const embedSummary = (collector) => ({
  color: parseInt("2980b9", 16),
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
