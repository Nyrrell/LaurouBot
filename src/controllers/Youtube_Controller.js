import { getAllPlaylistsId, getAllVideosByPlaylistId } from "../modules/youtube_api.js";
import { database } from "../database/database.js";

export const getAllChannels = async () => {
  return database
    .from("Youtube_Channel")
    .select()
    .innerJoin("Youtube_Notification", "Youtube_Channel.channelId", "Youtube_Notification.channelId");
};

export const getChannelByChannelId = (channelId) => {
  return database.from("Youtube_Channel").select().where({ channelId: channelId }).first();
};

export const getAllVideosByChannelId = (channelId) => {
  return database.from("Youtube_Video").select().where({ channelId: channelId });
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

export const addVideo = (video) => {
  return database("Youtube_Video").insert({
    id: video["contentDetails"]["videoId"],
    channel: video["snippet"]["channelTitle"],
    title: video["snippet"]["title"],
    description: video["snippet"]["description"],
    thumbnail: video["snippet"]["thumbnails"]["high"]?.["url"],
    channelId: video["snippet"]["channelId"],
    createdAt: video["snippet"]["publishedAt"],
  });
};

export const populateYoutubeVideos = async (channelId) => {
  const trx = await database.transaction();

  const playlists = await getAllPlaylistsId(channelId);
  const videos = [];

  for (const playlist of playlists) {
    const videosList = await getAllVideosByPlaylistId(playlist);

    if (!videosList.length) return trx.rollback;
    for await (const video of videosList) {
      if (video["status"]["privacyStatus"] === "private") continue;
      videos.push({
        id: video["contentDetails"]["videoId"],
        channel: video["snippet"]["channelTitle"],
        title: video["snippet"]["title"],
        description: video["snippet"]["description"],
        thumbnail: video["snippet"]["thumbnails"]["high"]?.["url"],
        channelId: video["snippet"]["channelId"],
        createdAt: video["snippet"]["publishedAt"],
      });
    }
  }

  return trx("Youtube_Video").insert(videos).onConflict("id").ignore().then(trx.commit).catch(trx.rollback);
};

export const removeChannel = (channel) => {
  return database.from("Youtube_Channel").where("id", channel.id).delete();
};
