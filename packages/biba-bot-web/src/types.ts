import { PidorBotConfig } from "./pidor-bot/pidor-bot";
import Knex from "knex";

export type AutoAssignConfig = {
  groups: string[];
};

export type BibaBotConfig = {
  token: string;
  randomOrgToken: string;
  autoAssign: AutoAssignConfig;
  pidorBot: PidorBotConfig;
  database: Knex.PgConnectionConfig;
};

type GenerateIntegersParams = {
  /* Required */
  n: number;
  // The number of random integers to generate (valid values: [1-10000]).
  min: number;
  // Lower bound for random integers (valid values: [-1e9 - 1e9] and `< max`).
  max: number;
  // Upper bound for random integers (valid values: [-1e9 - 1e9] and `> min`).

  /* Optional */
  replacement?: boolean;
  // Whether or not the generated numbers can contain duplicates (default: true).
  base?: number;
  // The base of the generated numbers (default: 10; valid values: 2, 8, 10 or 16).
  // If `base` is any value other than 10, the generated numbers will be returned as strings.
};

type RandomOrgResponseBasic<T> = {
  random: {
    /* Your requested bits, Sir. */
    data: T[];
    // Array containing your requested random numbers or strings.
    completionTime: string;
    // The time that request was completed, in ISO 8601 format (parsable with new Date(isoString)).
  };
  bitsUsed: number;
  // The number of random bits generated in this request.
  bitsLeft: number;
  // An estimate of the number of remaining bits you can request.
  requestsLeft: number;
  // An estimate of the number of remaining api calls you can make.
  advisoryDelay: number;
  // The recommended number of milliseconds you should wait before making another request.
};

type RamdomOrgResponseSigned<T> = RandomOrgResponseBasic<T> & {
  random: {
    method: string;
    // The name of the method you called.
    hashedApiKey: string;
    // A base64-encoded SHA-512 hash of your api key.
    // This allows you to provide this response to a third party without having to disclose your api key.
    /*
          The parameters of your request will also be included here in the response.
          E.g. for `generateSignedStrings`, you would receive:
          n, length, characters & replacement
         */
    serialNumber: number;
    // The serial number of this response (unique to your api key's requests).
    userData?: unknown;
    // Copied from the original request's `userData` parameter or `null` if not specified.
    license: {};
    // An object describing the license terms under which the random data in this response can be used.
  };
  signature: string;
  // A base64-encoded signature of `response.random`, signed with Random.org's private key.
};

export type RandomOrgApiProvider = {
  generateIntegers: (params: GenerateIntegersParams) => Promise<RandomOrgResponseBasic<number>>;
};
