import Knex from "knex";

import KnexConfig from "./knexfile.js";

export const database = Knex(KnexConfig);

//await database("Youtube_Channel").insert({
//  username: "channeltest",
//  customUrl: "custm",
//  channelId: "1234",
//});
//
//await database("Youtube_Video").insert({
//  id: "idtest" + Date.now().toString(),
//  channel: "channeltest",
//  title: "titletest",
//  description: "descriptiontest",
//  thumbnail: "thumbtest",
//  channelId: "1234",
//});
//
//database.destroy();
