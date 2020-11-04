export type PidorStorage = {
  getCurrentPidor: () => string | undefined;
  setCurrentPidor: (pdrId: string) => void;
  resetCurrentPidor: () => void;
};

export type PidorStorageInmemory = PidorStorage & {
  _pdrId?: string;
};

export const createPidorInmemoryStorage = (): PidorStorageInmemory => ({
  _pdrId: undefined,
  getCurrentPidor() {
    return this._pdrId;
  },
  setCurrentPidor(x: string) {
    this._pdrId = x;
  },
  resetCurrentPidor() {
    this._pdrId = undefined;
  },
});
