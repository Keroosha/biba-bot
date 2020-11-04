import { Client } from "discord.js";
import file from "fs";
import path from "path";
import { registerMemberAutoAssign } from "./member-auto-assign/member-auto-assign";
import {
  PidorBotConfig,
  registerPidorBot,
  RegisterPidorBotDependencies,
} from "./pidor-bot/pidor-bot";
import { createPidorInmemoryStorage } from "./pidor-bot/storage/pidor-bot-storage";

type AutoAssignConfig = {
  groups: string[];
};

type BibaBotConfig = {
  token: string;
  autoAssign: AutoAssignConfig;
  pidorBot: PidorBotConfig;
};

const readConfig = () => file.readFileSync(path.join(process.cwd(), "config.json")).toString();
const fetchAllGuild = (x: Client) => x.guilds.cache.map((x) => x.members.fetch());

const config: BibaBotConfig = JSON.parse(readConfig());
const pidorBotConfig: RegisterPidorBotDependencies = {
  storage: createPidorInmemoryStorage(),
  config: config.pidorBot,
};

const discord = new Client();

(async () => {
  registerMemberAutoAssign(config.autoAssign.groups)(discord);
  registerPidorBot(pidorBotConfig)(discord);
  discord.on("ready", () => console.log("Я родился блядь"));

  await discord.login(config.token);
  await Promise.all(fetchAllGuild(discord));
})();
