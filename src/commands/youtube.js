import { SlashCommand, Collection } from "slash-create";

import { Youtube_Components } from "../components/Youtube_Components.js";
import { addChannel, getAllChannels, getChannelByChannelId, removeChannel } from "../controllers/Youtube_Controller.js";
import { getChannelDetails } from "../modules/youtube_api.js";

const component = new Youtube_Components();

export default class Youtube extends SlashCommand {
  collection = new Collection();

  constructor(creator) {
    super(creator, {
      name: "youtube",
      description: "Configuration des chaines Youtube à suivre",
      guildIDs: creator.client,
      defaultPermission: false,
      requiredPermissions: ["MANAGE_GUILD"],
      options: [component.commandsOptions],
    });
  }

  async run(ctx) {
    const { mode } = ctx.options;

    switch (mode) {
      case "list":
        return this.List(ctx);
      case "add":
        return this.Add(ctx);
      case "update":
        return this.Update(ctx);
      case "remove":
        return this.Remove(ctx);
      default:
        return "Erreur dans la selection du mode";
    }
  }

  async List(ctx) {
    const channels = await getAllChannels();

    if (Array.isArray(channels) && !Boolean(channels.length))
      return ctx.send({ content: "Aucune chaine youtube suivi" });

    return ctx.send({
      embeds: [component.embedListChannel(channels)],
    });
  }

  async Add(ctx) {
    await ctx.sendModal(
      {
        title: "Ajouter une chaine youtube à suivre",
        custom_id: "add_yt_channel",
        components: [component.textInput({ customId: "username", label: "Nom de la chaine" })],
      },
      async (mctx) => {
        const { values, customID } = mctx;
        await mctx.defer();

        const channel = await getChannelDetails(values.username.toLowerCase()).catch(() => false);
        if (!channel) return mctx.send("⛔ Pas de chaine trouver");

        const isInDatabase = await getChannelByChannelId(channel["id"]);
        if (Array.isArray(isInDatabase) && Boolean(isInDatabase.length))
          return mctx.send("⛔ Cette chaine est deja suivie !");

        await mctx.send({
          content: "Pour cette chaine Youtube ?",
          embeds: [component.embedChannel(channel)],
          components: [component.continueButton({ customId: customID })],
        });

        const { id: messageId } = await mctx.fetch();
        this.collection.set(messageId, { username: values.username, youtubeChannel: channel });
        await ctx.registerWildcardComponent(messageId, addInteraction);
      }
    );

    const addInteraction = async (ctx) => {
      const [customID, interaction] = ctx.customID.split(":");
      const messageID = ctx.message.id;

      if (interaction === "stop") {
        this.collection.delete(messageID);
        return ctx.editParent({ content: "", embeds: [component.AbortCmdEmbed()], components: [] });
      }

      const collector = this.collection.get(messageID);
      if (!collector)
        return ctx.editParent({
          content: "",
          embeds: [component.ErrorCmdEmbed("Un probleme est survenu, annulation !")],
          components: [],
        });

      if (!Object.hasOwn(collector, "notification")) {
        await ctx.sendModal(
          {
            title: "Ajouter un message de notification",
            custom_id: "notification",
            components: [component.paragraphInput({})],
          },
          async (mctx) => {
            collector["notification"] = mctx.values.notification;
            this.collection.set(messageID, collector);

            await mctx.editParent({
              content: "",
              embeds: [component.embedNotification(collector["notification"])],
            });
          }
        );
        return;
      }

      if (!Object.hasOwn(collector, "role")) {
        await ctx.editParent({
          content: "Quel est le rôle à notifier ?",
          embeds: [],
          components: [component.selectRole()],
        });

        return ctx.registerComponentFrom(messageID, "role", async (sctx) => {
          collector["role"] = sctx.values[0];
          collector["register"] = true;
          this.collection.set(messageID, collector);

          return sctx.editParent({
            content: "",
            embeds: [component.embedSummary(collector)],
            components: [component.continueButton({ customId: customID, label: "Enregistrer" })],
          });
        });
      }

      if (Object.hasOwn(collector, "register")) {
        await ctx.acknowledge();
        const trx = await addChannel(collector);
        this.collection.delete(messageID);

        const feedback =
          trx["sql"] === "ROLLBACK"
            ? component.ErrorCmdEmbed("Enregistrement de la chaine échoué !")
            : component.SuccessCmdEmbed("Enregistrement de la chaine réussi");
        return ctx.editParent({ embeds: [feedback], components: [] });
      }

      await ctx.editParent({ content: "Je... qu'est ce que quoi ?", embeds: [], components: [] });
    };
  }

  async Update(ctx) {
    const channels = await getAllChannels();

    if (Array.isArray(channels) && !Boolean(channels.length))
      return ctx.send("Aucune chaine youtube suivi", { ephemeral: true });

    await ctx.send({
      content: "Quel chaine Youtube voulez vous éditer ?",
      ephemeral: true,
      components: [component.selectYoutubeChannel(channels)],
    });
  }

  async Remove(ctx) {
    const customId = "remove_yt_channel";
    const channels = await getAllChannels();

    if (Array.isArray(channels) && !Boolean(channels.length))
      return ctx.send({ content: "Aucune chaine youtube suivi" });

    await ctx.send({
      content: "Quel chaine Youtube voulez vous supprimer ?",
      components: [component.selectYoutubeChannel(channels, customId)],
    });

    const { id: messageId } = await ctx.fetch();

    await ctx.registerWildcardComponent(messageId, async (sctx) => {
      const [_, interaction] = sctx.customID.split(":");

      if (!interaction) {
        const [channelId] = sctx.values;
        const channel = await getChannelByChannelId(channelId);
        this.collection.set(messageId, channel);

        return sctx.editParent({
          content: `Confirmer la suppression de la chaine **${channel.title}**`,
          components: [component.continueButton({ customId: customId })],
        });
      }

      const channel = this.collection.get(messageId);
      if (interaction === "continue") {
        this.collection.delete(messageId);
        const trx = await removeChannel(channel);

        if (trx > 0)
          return sctx.editParent({
            content: "",
            embeds: [component.SuccessCmdEmbed(`La chaine **${channel.title}** a bien été supprimée !`)],
            components: [],
          });

        return sctx.editParent({
          content: "",
          embeds: [component.ErrorCmdEmbed(`Suppression de la chaine **${channel.title}** échoué !`)],
          components: [],
        });
      }

      if (interaction === "stop") {
        this.collection.delete(messageId);
        return sctx.editParent({
          content: "",
          embeds: [component.AbortCmdEmbed(`Suppression de la chaine **${channel.title}** annuler !`)],
          components: [],
        });
      }
    });
  }

  async interaction(ctx) {
    if (!ctx.member.permissions.has("MANAGE_GUILD") || ctx.message.interaction.user.id !== ctx.user.id)
      return await ctx.send({
        content: "Tu n'as pas les droits nécessaires.",
        ephemeral: true,
      });
    //    const [interactionType] = ctx.customID.split(":");
  }

  onError(err, ctx) {
    return super.onError(err, ctx);
  }
}
