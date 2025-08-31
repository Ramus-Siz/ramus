declare module "sybase-promised" {
  export interface SybaseConfig {
    host: string;
    port: number;
    dbname: string;
    username: string;
    password: string;
  }

  export default class Sybase {
    constructor(config: SybaseConfig, jarPath?: string);

    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query<T = any>(sql: string): Promise<T[]>;
    call<T = any>(procName: string, params?: any[]): Promise<T[]>;
  }
}
