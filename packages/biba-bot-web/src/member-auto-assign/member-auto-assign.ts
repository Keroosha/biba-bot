import { Client, Collection, GuildMember, Role, RoleManager } from "discord.js";

const filterRoles = (roles: string[]) => (cache: Collection<string, Role>) =>
  cache.filter((x) => roles.includes(x.name));

const memberAutoAssign = (roles: string[]) => async (member: GuildMember) =>
  member.roles.add(filterRoles(roles)(member.guild.roles.cache));

export const registerMemberAutoAssign = (roles: string[]) => (client: Client) =>
  client.on("guildMemberAdd", memberAutoAssign(roles));
