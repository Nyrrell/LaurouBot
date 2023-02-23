import { SlashCommand, Collection } from "slash-create";

import {
  selectRole,
  continueButton,
  commandsOptions,
  textInputUsername,
  paragraphInputNotification,
  embedSummary,
  embedNotification,
  embedChannel,
  embedListChannel,
} from "../components/youtube_components.js";
import { addChannel, getAllChannels, getChannelByChannelId } from "../controllers/Youtube_Controller.js";
import { getChannelDetails } from "../modules/youtube_api.js";

export default class Youtube extends SlashCommand {
  collection = new Collection();

  constructor(creator) {
    super(creator, {
      name: "youtube",
      description: "Configuration des chaines Youtube à suivre",
      guildIDs: creator.client,
      defaultPermission: false,
      requiredPermissions: ["MANAGE_GUILD"],
      options: [commandsOptions],
    });
  }
  async run(ctx) {
    const { mode } = ctx.options;

    if (mode === "list") {
      const channels = await getAllChannels();

      if (Array.isArray(channels) && !Boolean(channels.length))
        return ctx.send("Aucune chaine youtube suivi", { ephemeral: true });

      return ctx.send({
        embeds: [embedListChannel(channels)],
        ephemeral: true,
      });
    }

    if (mode === "add") {
      await ctx.sendModal(
        {
          title: "Ajouter une chaine youtube à suivre",
          custom_id: "add_yt_channel",
          components: [textInputUsername],
        },
        async (mctx) => {
          const { values, customID } = mctx;
          await mctx.defer(true);

          const channel = await getChannelDetails(values.username.toLowerCase()).catch(() => false);
          if (!channel) return mctx.send("⛔ Pas de chaine trouver");

          const isInDatabase = await getChannelByChannelId(channel["id"]);
          if (Array.isArray(isInDatabase) && Boolean(isInDatabase.length))
            return mctx.send("⛔ Cette chaine est deja suivie !");

          await mctx.send({
            content: "Pour cette chaine Youtube ?",
            embeds: [embedChannel(channel)],
            components: [continueButton(customID)],
          });

          const { id: messageId } = await mctx.fetch();
          this.collection.set(messageId, { username: values.username, youtubeChannel: channel });
        }
      );
      return;
    }

    return "another choice";
  }

  async interaction(ctx) {
    if (!ctx.member.permissions.has("MANAGE_GUILD"))
      return await ctx.send({
        content: "Tu n'as pas les droits nécessaires.",
        ephemeral: true,
      });
    const interactionType = ctx.customID.split(":")[0];
    if (interactionType === "add_yt_channel") return this.addInteraction(ctx);
  }

  async addInteraction(ctx) {
    const [customID, interaction] = ctx.customID.split(":");
    const messageID = ctx.message.id;

    if (interaction === "stop") {
      this.collection.delete(messageID);
      return ctx.editParent("Annulation de l'opération !", { embeds: [], components: [] });
    }

    const collector = this.collection.get(messageID);
    if (!collector) return ctx.editParent("Un probleme est survenu, annulation !", { embeds: [], components: [] });

    if (!Object.hasOwn(collector, "notification")) {
      await ctx.sendModal(
        {
          title: "Ajouter un message de notification",
          custom_id: "notification",
          components: [paragraphInputNotification],
        },
        async (mctx) => {
          collector["notification"] = mctx.values.notification;
          this.collection.set(messageID, collector);

          await mctx.editParent({
            content: "**Apercu du message de notification**",
            embeds: [embedNotification(collector["notification"])],
          });
        }
      );
      return;
    }

    if (!Object.hasOwn(collector, "role")) {
      await ctx.editParent("Quel est le rôle à notifier ?", {
        embeds: [],
        components: [selectRole],
      });

      return ctx.registerComponentFrom(messageID, "role", async (sctx) => {
        collector["role"] = sctx.values[0];
        collector["register"] = true;
        this.collection.set(messageID, collector);

        return sctx.editParent({
          content: "**Récapitulatif de la commande**",
          embeds: [embedSummary(collector)],
          components: [continueButton(customID, "Enregistrer")],
        });
      });
    }

    if (Object.hasOwn(collector, "register")) {
      await ctx.acknowledge();
      const trx = await addChannel(collector);

      const feedback =
        trx["sql"] === "COMMIT" ? "✅ Enregistrement réussi !" : "❌ Une erreur est survenue enregistrement échoué !";
      return ctx.editParent({ content: feedback, embeds: [], components: [] });
    }

    await ctx.editParent({ content: "Je... qu'est ce que quoi ?", embeds: [], components: [] });
  }

  onError(err, ctx) {
    return super.onError(err, ctx);
  }
}
