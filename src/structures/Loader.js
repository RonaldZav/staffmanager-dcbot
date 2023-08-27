const { Message, Client } = require("discord.js");
const { Structure, Manager } = require("erela.js");
//const { nodes, SpotifyID, SpotifySecret } = require("../config/client");
const fetch = require("node-fetch").default;
const cheerio = require("cheerio");
const { readdirSync } = require("fs");

class Loader extends Manager {

  constructor(client) {
    super({ send: (id, payload) => this._sendPayload(id, payload), });

    this.client = client;
    this._loadEvents();

    this.getMetaThumbnail = async (uri) => {
      return await fetch(uri)
        .then(async (r) => {
          const body = await r.text();
          const $ = cheerio.load(body);
          return (
            $("meta[property='twitter:image']")?.attr("content") ??
            $("meta[property='og:image']")?.attr("content") ??
            null
          );
        })
        .catch(() => null);
    };
  }

  _sendPayload(id, payload) {
    const guild = this.client.guilds.cache.get(id);
    if (guild) return guild.shard.send(payload);
  }
  _loadEvents() {}}
  
module.exports = Loader;
