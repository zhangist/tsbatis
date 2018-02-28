import * as path from "path";
import { PgConnectionPool } from "../../src/connection/pgConnectionPool";
import { PgConnectionConfig } from "../../src/index";
import { Student } from "../db/entity/student";

export class PgConnectionTestHelper {

    public async testTransactionInsert(): Promise<void> {
        try {
            const config = new PgConnectionConfig();
            config.database = "northwind";
            config.host = "localhost";
            config.user = "travis";
            const pool = new PgConnectionPool(config, true);
            const conn = await pool.getConnection();
            const newStudent = new Student();
            newStudent.name = new Date().toString();
            newStudent.age = 30;
            await conn.beginTransaction();
            const insertSqlTemplate = `INSERT INTO student values($1, $2)`;
            await conn.run(insertSqlTemplate, [newStudent.name, newStudent.age]);
            await conn.commit();
            const selectMatchStudentTemplate = `SELECT * FROM student where name = $1`;
            const matchStudent = await conn.selectEntities<Student>(
                Student, selectMatchStudentTemplate, [newStudent.name]);
            await conn.release();
            return new Promise<void>((resolve, reject) => {
                if (matchStudent.length === 1) {
                    resolve();
                } else {
                    reject("could not find insert student");
                }
            });
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    public async testTransactionInsertThenRollback(): Promise<void> {
        try {
            const config = new PgConnectionConfig();
            config.database = "northwind";
            config.host = "localhost";
            config.user = "travis";
            const pool = new PgConnectionPool(config, true);
            const conn = await pool.getConnection();
            const newStudent = new Student();
            newStudent.name = "rollback" + new Date().toString();
            newStudent.age = 30;
            await conn.beginTransaction();
            const insertSqlTemplate = `INSERT INTO student values($1, $2)`;
            await conn.run(insertSqlTemplate, [newStudent.name, newStudent.age]);
            await conn.rollback();
            const selectMatchStudentTemplate = `SELECT * FROM student where name = $1`;
            const matchStudent = await conn.selectEntities<Student>(
                Student, selectMatchStudentTemplate, [newStudent.name]);
            await conn.release();
            return new Promise<void>((resolve, reject) => {
                if (matchStudent.length === 0) {
                    resolve();
                } else {
                    reject("should not find insert item since rollback");
                }
            });
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }
}
