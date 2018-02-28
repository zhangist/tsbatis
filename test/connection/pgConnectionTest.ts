import { expect } from "chai";
import { PgConnection, PgConnectionPool } from "../../src/connection/index";
import { DatabaseType, PgConnectionConfig } from "../../src/index";
import { RowBounds } from "../../src/model/index";
import { Customer } from "../db/entity/customer";
import { PgConnectionTestHelper } from "./PgConnectionTestHelper";

describe(".pgConnection", () => {
    describe("#getDataBaseType", () => {
        it("should get pg", () => {
            const conn = new PgConnection(null, null);
            const result = conn.getDataBaseType();
            expect(DatabaseType.PG).to.be.eq(result);
        });
    });

    describe("#getRowBoundsExpression", () => {
        it("should return `limit 20, 10` if rowbounds.offset is 20, rowbounds.limit 10", () => {
            const conn = new PgConnection(null, null);
            const rowbounds = new RowBounds(20, 10);
            const result = conn.getRowBoundsExpression(rowbounds);
            expect("limit 20, 10").to.be.eq(result);
        });
    });

    describe("#run", () => {
        it("should get any value", (done) => {
            const config = new PgConnectionConfig();
            config.database = "northwind";
            config.host = "localhost";
            config.user = "travis";
            const pool = new PgConnectionPool(config, true);
            pool.getConnection()
                .then((conn) => {
                    return conn.run("SELECT table_name FROM information_schema.tables", []);
                }).then((value) => {
                    console.log("run value: ", value);
                    if (value) {
                        done();
                    } else {
                        done("show return value");
                    }
                })
                .catch((err) => {
                    done(err);
                });
        }).timeout(1000);
    });

    describe("#select", () => {
        it("should get any value", (done) => {
            const config = new PgConnectionConfig();
            config.database = "northwind";
            config.host = "localhost";
            config.user = "travis";
            const pool = new PgConnectionPool(config, true);
            pool.getConnection()
                .then((conn) => {
                    return conn.select("SELECT COUNT(0) FROM customer WHERE id=$1", ["ALFKI"]);
                }).then((value) => {
                    console.log("run value: ", value);
                    if (value.length === 1) {
                        done();
                    } else {
                        done("show return value must equal 1");
                    }
                })
                .catch((err) => {
                    done(err);
                });
        }).timeout(1000);
    });

    describe("#selectCount", () => {
        it("should select customer", (done) => {
            const config = new PgConnectionConfig();
            config.database = "northwind";
            config.host = "localhost";
            config.user = "travis";
            const pool = new PgConnectionPool(config, true);
            pool.getConnection()
                .then((conn) => {
                    return conn.selectCount("SELECT COUNT(0) FROM customer", []);
                }).then((value) => {
                    console.log("get count: ", value);
                    if (value > 0) {
                        done();
                    } else {
                        done("count should greater than 0");
                    }
                })
                .catch((err) => {
                    done(err);
                });
        }).timeout(1000);
    });

    describe("#selectEntities", () => {
        it("should selectEntities", (done) => {
            const config = new PgConnectionConfig();
            config.database = "northwind";
            config.host = "localhost";
            config.user = "travis";
            const pool = new PgConnectionPool(config, true);
            pool.getConnection()
                .then((conn) => {
                    return conn.selectEntities<Customer>(Customer, "SELECT COUNT(0) FROM customer", []);
                }).then((value) => {
                    console.log("selectEntities: ", value);
                    if (value.length > 0) {
                        done();
                    } else {
                        done("count should greater than 0");
                    }
                })
                .catch((err) => {
                    done(err);
                });
        }).timeout(1000);
    });

    describe("#transaction", () => {
        const testHelper = new PgConnectionTestHelper();
        it("insert", (done) => {
            testHelper.testTransactionInsert()
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it("insertThenRollback", (done) => {
            testHelper.testTransactionInsertThenRollback()
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });
});
