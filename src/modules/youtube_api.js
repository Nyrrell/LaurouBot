import { got } from "got";

const { YOUTUBE_API_KEY } = process.env;

const youtube_api = got.extend({
  prefixUrl: "https://www.googleapis.com/youtube/v3/",
  searchParams: {
    key: YOUTUBE_API_KEY,
    part: "contentDetails,snippet",
    maxResults: 50,
  },
});

const regex = /(?<=<link rel="canonical" href="(https?:\/\/)?(www\.)?youtube\.com\/(channel|user)\/)[\w-]+/g;
const channel_id_from_url = (username) =>
  got(`https://www.youtube.com/@${username}`)
    .text()
    .then((body) => body.match(regex)[0]);

export const getChannelDetails = async (username) => {
  username = username.toLowerCase().trim();
  const { items } = await youtube_api
    .get("channels", { searchParams: { forUsername: username } })
    .json()
    .catch((err) => {
      console.log(err.message);
      return {};
    });

  if (items) return items[0];

  const channelId = await channel_id_from_url(username);
  if (!channelId) throw new Error("Pas trouver d'identifiant de chaine");

  const { items: itemsFromId } = await youtube_api.get("channels", { searchParams: { id: channelId } }).json();
  if (!itemsFromId) throw new Error("Pas de resultat obtenu");
  return itemsFromId[0];
};

export const getAllPlaylistsId = async (channelId) => {
  const playlistsId = [];

  const getPlaylistsId = async (pageToken = null) => {
    const { items, nextPageToken } = await youtube_api
      .get("playlists", {
        searchParams: {
          channelId: channelId,
          part: "id",
          ...(pageToken && { nextPageToken: pageToken }),
        },
      })
      .json()
      .catch((err) => {
        console.log(err.message);
        return {};
      });

    if (items) items.forEach((item) => playlistsId.push(item.id));
    if (nextPageToken) return getPlaylistsId(nextPageToken);
  };

  await getPlaylistsId();
  return playlistsId;
};

export const getAllVideosByPlaylistId = async (playlistId) => {
  const videos = [];

  const getVideos = async (pageToken = null) => {
    const { items, nextPageToken } = await youtube_api
      .get("playlistItems", {
        searchParams: {
          playlistId: playlistId,
          part: "contentDetails,snippet,status",
          ...(pageToken && { nextPageToken: pageToken }),
        },
      })
      .json()
      .catch((err) => {
        console.log(err);
        return {};
      });

    if (items) videos.push(...items);
    if (nextPageToken) return getVideos(nextPageToken);
  };

  await getVideos();
  return videos;
};

export const getVideosUploadPlaylist = async (uploadPlaylist, limit = 5) => {
  const { items } = await youtube_api
    .get("playlistItems", {
      searchParams: {
        playlistId: uploadPlaylist,
        order: "date",
        part: "contentDetails,snippet",
        maxResults: limit,
      },
    })
    .json()
    .catch((err) => {
      console.log(err);
      return { items: [] };
    });
  return items;
};
