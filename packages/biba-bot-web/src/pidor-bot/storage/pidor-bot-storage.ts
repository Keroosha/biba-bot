import Knex from "knex";

export type PidorModel = {
  guildId: string;
  pidorId: string;
  randomHash?: string;
  assignDate: string;
};

export type PidorStorage = {
  getCurrentPidor: (guidId: string) => Promise<PidorModel | undefined>;
  setCurrentPidor: (guildId: string, pdrModel: PidorModel) => Promise<void>;
  resetCurrentPidor: (guildId: string) => Promise<void>;
};

export type PidorStorageInmemory = PidorStorage & {
  _pdrStorage: { [key: string]: PidorModel | undefined };
};

export type PidorStoragePostgres = PidorStorage & {
  _connection: Knex;
};

export const createPidorInmemoryStorage = (): PidorStorageInmemory => ({
  _pdrStorage: {},
  async getCurrentPidor(guildId) {
    return this._pdrStorage[guildId];
  },
  async setCurrentPidor(guildId, x) {
    this._pdrStorage[guildId] = x;
  },
  async resetCurrentPidor(guildId) {
    this._pdrStorage[guildId] = undefined;
  },
});

export const createPidorPostgresStorage = (connection: Knex): PidorStoragePostgres => ({
  _connection: connection,
  getCurrentPidor(guildId) {
    return this._connection<PidorModel>("pidors").first("*").where("guildId", guildId);
  },
  async setCurrentPidor(guildId, x) {
    const exist = await this.getCurrentPidor(guildId);
    if (!exist) return this._connection<PidorModel>("pidors").insert(x);
    return this._connection<PidorModel>("pidors").where("guildId", guildId).update(x);
  },
  resetCurrentPidor(guildId) {
    return this._connection<PidorModel>("pidors").where("guildId", guildId).delete();
  },
});
