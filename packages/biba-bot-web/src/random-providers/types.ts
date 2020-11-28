import { RandomOrgApiProvider } from "../types";
import { Collection, GuildMember } from "discord.js";

export type RandomProvider = {
  getRandom: (min: number, max: number) => Promise<number>;
};

export type RandomOrgProvider = RandomProvider & {
  _api: RandomOrgApiProvider;
};

export type DiscordJsRandomProvider = RandomProvider & {
  _members: Collection<string, GuildMember>;
  setMembers: (x: Collection<string, GuildMember>) => void;
};
