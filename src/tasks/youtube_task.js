import { got } from "got";
import { getVideosUploadPlaylist } from "../modules/youtube_api.js";
import { addVideo, getAllChannels, getAllVideosByChannelId } from "../controllers/Youtube_Controller.js";

const { YOUTUBE_WEBHOOK_URL: webhook } = process.env;

const fetchVideo = async (channel) => {
  const storedVideos = await getAllVideosByChannelId(channel["channelId"]);
  if (!storedVideos.length) return;

  const uploadVideos = await getVideosUploadPlaylist(channel["uploadPlaylist"]);
  if (!uploadVideos.length) return;

  for await (const video of uploadVideos) {
    const videoId = video["contentDetails"]["videoId"];

    if (storedVideos?.find(({ id }) => id === videoId)) continue;

    await got(webhook, {
      method: "POST",
      json: {
        content: channel["message"]
          .replaceAll("{lien}", `https://youtu.be/${videoId}`)
          .replaceAll("{role}", `<@&${channel["role"]}>`),
      },
    });

    await addVideo(video);
  }
};

export const youtubeFeed = async () => {
  const youtubeChannels = await getAllChannels();
  if (!youtubeChannels.length) return;

  for (const channel of youtubeChannels) {
    await fetchVideo(channel);
  }
};
