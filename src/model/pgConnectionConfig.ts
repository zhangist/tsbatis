import { DatabaseType } from "./databaseType";
import { IConnectionConfig } from "./iConnectionConfig";

export class PgConnectionConfig implements IConnectionConfig {
    public host: string;
    public port: number = 5432;
    public user: string;
    public password: string;
    public database: string;

    public getDatabaseType(): DatabaseType {
        return DatabaseType.PG;
    }
}
