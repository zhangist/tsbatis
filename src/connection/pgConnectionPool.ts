import { CommonHelper } from "../helper";
import { PgConnectionConfig } from "../model";
import { IConnection } from "./iConnection";
import { IConnectionPool } from "./iConnectionPool";
import { PgConnection } from "./pgConnection";

export class PgConnectionPool implements IConnectionPool {
    private readonly pool: any;
    private readonly enableLog: boolean;
    constructor(config: PgConnectionConfig, enableLog: boolean) {
        this.enableLog = enableLog;
        const pg = this.getDriver();

        this.pool = new pg.Pool({
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.user,
            password: config.password,
        });
    }

    public getConnection(): Promise<IConnection> {
        return new Promise<IConnection>((resolve, reject) => {
            this.pool.connect((err, client, release) => {
                if (CommonHelper.isNullOrUndefined(err)) {
                    const result = new PgConnection(client, release, this.enableLog);
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    private getDriver(): any {
        // tslint:disable-next-line:no-implicit-dependencies
        return require("pg");
    }
}
