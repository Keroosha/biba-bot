import { Client } from "discord.js";
import Knex from "knex";
import file from "fs";
import path from "path";
import { registerMemberAutoAssign } from "./member-auto-assign/member-auto-assign";
import { registerPidorBot, RegisterPidorBotDependencies } from "./pidor-bot/pidor-bot";
import { createPidorPostgresStorage } from "./pidor-bot/storage/pidor-bot-storage";
import { BibaBotConfig } from "./types";

const readConfig = () => file.readFileSync(path.join(process.cwd(), "config.json")).toString();
const fetchAllGuild = (x: Client) => x.guilds.cache.map((x) => x.members.fetch());

const config: BibaBotConfig = JSON.parse(readConfig());

const discord = new Client();
const knex = Knex({
  client: "pg",
  connection: config.database,
  migrations: {
    directory: "./migrations",
    loadExtensions: [".js", ".ts"],
  },
});
const pidorStorage = createPidorPostgresStorage(knex);

const pidorBotConfig: RegisterPidorBotDependencies = {
  storage: pidorStorage,
  config: config.pidorBot,
};

(async () => {
  await knex.migrate.latest();
  registerMemberAutoAssign(config.autoAssign.groups)(discord);
  registerPidorBot(pidorBotConfig)(discord);
  discord.on("ready", () => console.log("Я родился блядь"));

  await discord.login(config.token);
  await Promise.all(fetchAllGuild(discord));
})();
