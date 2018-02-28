import {
    IConnectionConfig,
    MysqlConnectionConfig,
    PgConnectionConfig,
    SqliteConnectionConfig
} from "../model";
import { IConnection } from "./iConnection";
import { IConnectionPool } from "./iConnectionPool";
import { MysqlConnectionPool } from "./mysqlConnectionPool";
import { PgConnectionPool } from "./pgConnectionPool";
import { SqliteConnectionPool } from "./sqliteConnectionPool";

export class ConnectionFactory {
    private readonly pool: IConnectionPool;
    private readonly enableLog: boolean;
    constructor(config: IConnectionConfig, enableLog: boolean = false) {
        if (config instanceof MysqlConnectionConfig) {
            this.pool = new MysqlConnectionPool(config, enableLog);
        } else if (config instanceof PgConnectionConfig) {
            this.pool = new PgConnectionPool(config, enableLog);
        } else if (config instanceof SqliteConnectionConfig) {
            this.pool = new SqliteConnectionPool(config, enableLog);
        } else {
            throw new Error(`don't support ${config.getDatabaseType()}`);
        }
    }

    public getConnection(): Promise<IConnection> {
        return this.pool.getConnection();
    }
}
