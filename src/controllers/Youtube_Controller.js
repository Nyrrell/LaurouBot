import { database } from "../database/database.js";

export const getAllChannels = async () => {
  return database.from("Youtube_Channel").select();
};

export const getChannelByChannelId = async (channelId) => {
  return database.from("Youtube_Channel").select().where({ channelId: channelId });
};

export const addChannel = async (collection) => {
  const trx = await database.transaction();

  return trx("Youtube_Channel")
    .insert({
      username: collection["username"],
      channelId: collection["youtubeChannel"]["id"],
      title: collection["youtubeChannel"]["snippet"]["title"],
      customUrl: collection["youtubeChannel"]["snippet"]?.["customUrl"],
      uploadPlaylist: collection["youtubeChannel"]["contentDetails"]["relatedPlaylists"]["uploads"],
    })
    .then(() => {
      return trx("Youtube_Notification").insert({
        channelId: collection["youtubeChannel"]["id"],
        message: collection["notification"],
        role: collection["role"],
      });
    })
    .then(trx.commit)
    .catch(trx.rollback);
};
