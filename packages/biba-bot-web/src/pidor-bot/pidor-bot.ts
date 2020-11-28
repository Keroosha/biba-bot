import { Client, Collection, GuildMember, Message, TextChannel } from "discord.js";
import { PidorModel, PidorStorage } from "./storage/pidor-bot-storage";
import add from "date-fns/add";
import format from "date-fns/format";

export type PidorBotConfig = {
  resetInterval: number;
  command: string;
  userChannel: string;
  assignRole?: string;
};

export type RegisterPidorBotDependencies = {
  storage: PidorStorage;
  config: PidorBotConfig;
};

type Members = Collection<string, GuildMember>;

const formatDate = (x: Date) => format(x, "dd.LL.yyyy HH:mm:ss");
const nextPidor = (x: PidorModel, interval: number) =>
  add(new Date(x.assignDate), {
    hours: interval,
  });

const pidorBotMessageFilter = (config: PidorBotConfig) => (msg: Message) =>
  msg.channel.isText() &&
  msg.content === config.command &&
  (msg.channel as TextChannel).name === config.userChannel;

const assignNewPidor = async (storage: PidorStorage, members: Members) => {
  const [member] = members.filter((x) => !x.user.bot).random(1);
  await storage.setCurrentPidor(member.guild.id, {
    guildId: member.guild.id,
    pidorId: member.id,
    assignDate: `${new Date().toUTCString()}`,
    randomHash: "",
  });
  return member;
};

const findPidorInCache = (pidorId: string | undefined) => (members: Members) =>
  members.find((x) => x.id === pidorId);

const announcePidor = (channel: TextChannel) => (pidor: GuildMember, nextPidorDate: Date) =>
  channel.send(
    `Пидорас дня: ${pidor.toString()}\n следующего пидора можно будет назначить - ${formatDate(
      nextPidorDate
    )}`
  );

const getOrAssignNewPidor = async (
  storage: PidorStorage,
  members: Members,
  guildId: string,
  interval: number,
  assignRole?: string
) => {
  const oldPidor = await storage.getCurrentPidor(guildId);
  const needAssignNewPidor = !oldPidor || nextPidor(oldPidor, interval) < new Date();
  const oldPidorMember = findPidorInCache(oldPidor?.pidorId)(members);

  if (needAssignNewPidor || !oldPidorMember) {
    const newPidor = await assignNewPidor(storage, members);
    const roleToAssign = newPidor.guild.roles.cache.find((x) => x.name === assignRole);
    if (roleToAssign) {
      await newPidor.roles.add(roleToAssign);
      await oldPidorMember?.roles.remove(roleToAssign);
    }
    return newPidor;
  }
  return oldPidorMember;
};

const pidorBot = ({ config, storage }: RegisterPidorBotDependencies) => async (msg: Message) => {
  if (!pidorBotMessageFilter(config)(msg)) return;

  const pidor = await getOrAssignNewPidor(
    storage,
    msg.guild!.members.cache,
    msg.guild!.id,
    config.resetInterval,
    config.assignRole
  );
  const pidorModel = await storage.getCurrentPidor(msg.guild!.id);
  await announcePidor(msg.channel as TextChannel)(
    pidor,
    nextPidor(pidorModel!, config.resetInterval)
  );
};

export const registerPidorBot = ({ storage, config }: RegisterPidorBotDependencies) => (
  client: Client
) => {
  client.on("message", pidorBot({ storage, config }));
};
