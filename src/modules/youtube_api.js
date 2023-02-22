import { got } from "got";

const { YOUTUBE_API_KEY } = process.env;

const youtube_api = got.extend({
  prefixUrl: "https://www.googleapis.com/youtube/v3/",
  searchParams: {
    key: YOUTUBE_API_KEY,
    part: "contentDetails,snippet",
  },
});

const regex = /(?<=<link rel="canonical" href="(https?:\/\/)?(www\.)?youtube\.com\/(channel|user)\/)[\w-]+/g;
const channel_id_from_url = (username) =>
  got(`https://www.youtube.com/@${username}`)
    .text()
    .then((body) => body.match(regex)[0]);

export const getChannelDetails = async (username) => {
  username = username.toLowerCase().trim();
  const { items } = await youtube_api.get("channels", { searchParams: { forUsername: username } }).json();

  if (items) return items[0];

  const channelId = await channel_id_from_url(username);
  if (!channelId) throw new Error("Pas trouver d'identifiant de chaine");

  const { items: itemsFromId } = await youtube_api.get("channels", { searchParams: { id: channelId } }).json();
  if (!itemsFromId) throw new Error("Pas de resultat obtenu");
  return itemsFromId[0];
};
