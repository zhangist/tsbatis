import * as lodash from "lodash";
import { CommonHelper } from "../helper";
import { DatabaseType, Entity, RowBounds, SqlTemplate } from "../model";
import { MappingProvider } from "../provider";
import { IConnection } from "./iConnection";

export class PgConnection implements IConnection {
    private readonly client: any;
    private readonly releaseFunc: any;
    private readonly enableLog: boolean;
    constructor(client: any, release: any, enableLog: boolean = false) {
        this.client = client;
        this.releaseFunc = release;
        this.enableLog = enableLog;
    }

    public getDataBaseType(): DatabaseType {
        return DatabaseType.PG;
    }

    public getRowBoundsExpression(rowBounds: RowBounds): string {
        const offset = rowBounds.offset;
        const limit = rowBounds.limit;
        return `limit ${offset}, ${limit}`;
    }

    public run(sql: string, params: any[]): Promise<any> {
        this.log(`run:\r\nsql: ${sql}\r\nparams: ${params}`);
        return new Promise<any>((resolve, reject) => {
            this.client.query(sql, params, (err, result) => {
                if (CommonHelper.isNullOrUndefined(err)) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
    }

    public select(sql: string, params: any[]): Promise<any[]> {
        this.log(`select:\r\nsql: ${sql}\r\nparams: ${params}`);
        return new Promise<any[]>((resolve, reject) => {
            this.client.query(sql, params, (err, result) => {
                if (CommonHelper.isNullOrUndefined(err)) {
                    resolve(result.rows);
                } else {
                    reject(err);
                }
            });
        });
    }
    public selectCount(sql: string, params: any[]): Promise<number> {
        this.log(`selectCount:\r\nsql: ${sql}\r\nparams: ${params}`);
        return new Promise<number>((resolve, reject) => {
            console.log("select count start");
            this.client.query(sql, params, (err, result) => {
                try {
                    if (CommonHelper.isNullOrUndefined(err)) {
                        resolve(result.rowCount);
                    } else {
                        reject(err);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    public selectEntities<T extends Entity>(
        entityClass: new () => T, sql: string, params: any[]): Promise<T[]> {
        this.log(`selectEntities:\r\nsql: ${sql}\r\nparams: ${params}`);
        return new Promise<T[]>((resolve, reject) => {
            this.client.query(sql, params, (err, result) => {
                try {
                    if (CommonHelper.isNullOrUndefined(err)) {
                        const entities = MappingProvider.toEntities<T>(entityClass, result.rows, true);
                        resolve(entities);
                    } else {
                        reject(err);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    public beginTransaction(): Promise<void> {
        this.log("beginTransaction...");
        return new Promise<void>((resolve, reject) => {
            this.client.query('BEGIN', (err) => {
                if (CommonHelper.isNullOrUndefined(err)) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

    public rollback(): Promise<void> {
        this.log("rollback...");
        return new Promise<void>((resolve, reject) => {
            this.client.query('ROLLBACK', (err) => {
                if (CommonHelper.isNullOrUndefined(err)) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

    public commit(): Promise<void> {
        this.log("commit...");
        return new Promise<void>((resolve, reject) => {
            this.client.query('COMMIT', (err) => {
                if (CommonHelper.isNullOrUndefined(err)) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

    public release(): Promise<void> {
        this.log("release...");
        return new Promise<void>((resolve, reject) => {
            try {
                this.releaseFunc();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    private log(log: string): void {
        if (!CommonHelper.isNullOrUndefined(this.enableLog)
            && this.enableLog) {
            console.log(`[TSBATIS] ${log}`);
        }
    }
}
