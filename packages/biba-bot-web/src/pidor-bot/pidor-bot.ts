import { Client, Collection, GuildMember, Message, TextChannel } from "discord.js";
import { PidorStorage, PidorStorageInmemory } from "./storage/pidor-bot-storage";

export type PidorBotConfig = {
  resetInterval: number;
  command: string;
  userChannel: string;
};

export type RegisterPidorBotDependencies = {
  storage: PidorStorage;
  config: PidorBotConfig;
};

type Members = Collection<string, GuildMember>;

const toMilliseconds = (x: number) => x * 1000 * 60 * 60;

const pidorBotMessageFilter = (config: PidorBotConfig) => (msg: Message) =>
  msg.channel.isText() &&
  msg.content === config.command &&
  (msg.channel as TextChannel).name === config.userChannel;

const assignNewPidor = (storage: PidorStorage) => (members: Members) => {
  const [member] = members.random(1);
  storage.setCurrentPidor(member.id);
  return member;
};

const findPidorInCache = (pidorId: string | undefined) => (members: Members) =>
  members.find((x) => x.id === pidorId);

const anouncePidor = (channel: TextChannel) => (pidor: GuildMember) =>
  channel.send(`Пидорас дня: ${pidor.toString()}`);

const getOrAssignNewPidor = (storage: PidorStorage) => (members: Members) =>
  findPidorInCache(storage.getCurrentPidor())(members) ?? assignNewPidor(storage)(members);

const pidorBot = ({ config, storage }: RegisterPidorBotDependencies) => (msg: Message) =>
  pidorBotMessageFilter(config)(msg)
    ? anouncePidor(msg.channel as TextChannel)(
        getOrAssignNewPidor(storage)(msg.guild!.members.cache)
      )
    : Promise.resolve();

export const registerPidorBot = ({ storage, config }: RegisterPidorBotDependencies) => (
  client: Client
) => {
  setInterval(() => storage.resetCurrentPidor(), toMilliseconds(config.resetInterval));
  client.on("message", pidorBot({ storage, config }));
};
