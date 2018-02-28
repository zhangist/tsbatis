import { expect } from "chai";
import * as path from "path";
import {
    ConnectionFactory,
    MysqlConnectionConfig,
    PgConnectionConfig,
    SqliteConnectionConfig
} from "../../src/index";

describe(".connectionFactory", () => {
    describe("#getConnection", () => {
        it("get sqlite connection", (done) => {
            const filepath = path.join(__dirname, "../../", "test", "northwind.db");
            const sqliteConnectionConfig = new SqliteConnectionConfig();
            sqliteConnectionConfig.filepath = filepath;
            const connFactory = new ConnectionFactory(sqliteConnectionConfig, true);
            connFactory.getConnection()
                .then((conn) => {
                    if (conn) {
                        done();
                    } else {
                        done("cannot get conenction");
                    }
                })
                .catch((err) => {
                    done(err);
                });
        });

        it("get mysql connection", (done) => {
            const config = new MysqlConnectionConfig();
            config.database = "northwind";
            config.host = "localhost";
            config.user = "travis";
            const connFactory = new ConnectionFactory(config, true);
            connFactory.getConnection()
                .then((conn) => {
                    if (conn) {
                        done();
                    } else {
                        done("cannot get conenction");
                    }
                })
                .catch((err) => {
                    done(err);
                });
        });

        it("get pg connection", (done) => {
            const config = new PgConnectionConfig();
            config.database = "northwind";
            config.host = "localhost";
            config.user = "travis";
            const connFactory = new ConnectionFactory(config, true);
            connFactory.getConnection()
                .then((conn) => {
                    if (conn) {
                        done();
                    } else {
                        done("cannot get conenction");
                    }
                })
                .catch((err) => {
                    done(err);
                });
        });

        it("should get error if config cannot be resolved", (done) => {
            try {
                const connFactory = new ConnectionFactory(null, true);
                done("should have error");
            } catch (e) {
                done();
            }
        });
    });
});
