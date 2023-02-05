import { readFile } from "node:fs/promises";
import { got } from "got";
import "dotenv/config";

import { sequelize } from "../database.js";
const { Youtube } = sequelize.models;

const { YOUTUBE_API_KEY, YOUTUBE_WEBHOOK_URL } = process.env;
const { youtubeChannel } = await readFile("./share/youtube.json", "utf8")
  .then((json) => JSON.parse(json))
  .catch(({ message }) => console.error(message));

const client = got.extend({
  prefixUrl: "https://www.googleapis.com/youtube/v3/",
  searchParams: {
    key: YOUTUBE_API_KEY,
    part: "contentDetails,snippet",
    order: "date",
  },
});

const fetchVideo = async (uploadsPlaylistId, storedVideos) => {
  try {
    const { items: videos } = await client
      .get(`playlistItems`, { searchParams: { playlistId: uploadsPlaylistId } })
      .json();

    if (!videos.length) return;

    for await (const video of videos) {
      const videoId = video["contentDetails"]["videoId"];

      if (storedVideos?.find(({ id }) => id === videoId)) continue;

      await got(YOUTUBE_WEBHOOK_URL, {
        method: "POST",
        json: { content: `https://youtu.be/${videoId}` },
      });

      await Youtube.create({
        id: videoId,
        channel: video["snippet"]["channelTitle"],
        title: video["snippet"]["title"],
        descr: video["snippet"]["description"],
        thumb: video["snippet"]["thumbnails"]["high"]["url"],
        channelId: video["snippet"]["channelId"],
        createdAt: video["snippet"]["publishedAt"],
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export const youtubeFeed = async () => {
  const storedVideos = await Youtube.findAll();
  for (const { uploadsPlaylistId } of youtubeChannel) {
    await fetchVideo(uploadsPlaylistId, storedVideos);
  }
};
