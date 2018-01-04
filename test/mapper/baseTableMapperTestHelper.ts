import * as path from "path";
import { MysqlConnectionPool } from "../../src/connection/mysqlConnectionPool";
import { BaseTableMapper, ConnectionFactory, MysqlConnectionConfig, SqliteConnectionConfig } from "../../src/index";
import { Book } from "../db/entity/book";
import { Student } from "../db/entity/student";
import { FilterDescriptor } from "../../src/model/filterDescriptor";
import { FilterOperator, DynamicQuery } from "../../src/model/index";

export class BaseTableMapperTestHelper {
    private readonly sqliteConnectionFactory: ConnectionFactory;
    private readonly mysqlConnectionFactory: ConnectionFactory;
    private readonly studentMapper: StudentMapper;

    constructor() {
        const filepath = path.join(__dirname, "../../", "test", "northwind.db");
        const sqliteConfig = new SqliteConnectionConfig();
        sqliteConfig.filepath = filepath;
        this.sqliteConnectionFactory = new ConnectionFactory(sqliteConfig, true);

        const mysqlConfig = new MysqlConnectionConfig();
        mysqlConfig.database = "northwind";
        mysqlConfig.host = "localhost";
        mysqlConfig.user = "travis";
        this.mysqlConnectionFactory = new ConnectionFactory(mysqlConfig, true);
    }

    public async insertWithoutAutoIncreaseTest(): Promise<void> {
        try {
            await this.insertTestInternalWithoutAutoIncrease(this.sqliteConnectionFactory);
            await this.insertTestInternalWithoutAutoIncrease(this.mysqlConnectionFactory);
            return new Promise<void>((resolve) => resolve());
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    public async insertWithAutoIncreaseTest(): Promise<void> {
        try {
            await this.insertTestInternalWithAutoIncrease(this.sqliteConnectionFactory);
            await this.insertTestInternalWithAutoIncrease(this.mysqlConnectionFactory);
            return new Promise<void>((resolve) => resolve());
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    public async insertSelectiveWithAutoIncreaseTest(): Promise<void> {
        try {
            await this.insertSelectiveTestInternalWithAutoIncrease(this.sqliteConnectionFactory);
            await this.insertSelectiveTestInternalWithAutoIncrease(this.mysqlConnectionFactory);
            return new Promise<void>((resolve) => resolve());
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    public async updateByPrimaryKeyTest(): Promise<void> {
        try {
            await this.updateByPrimaryKeyInternal(this.sqliteConnectionFactory);
            await this.updateByPrimaryKeyInternal(this.mysqlConnectionFactory);
            return new Promise<void>((resolve) => resolve());
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    public async updateSelectiveByPrimaryKeyTest(): Promise<void> {
        try {
            await this.updateSelectiveByPrimaryKeyInternal(this.sqliteConnectionFactory);
            await this.updateSelectiveByPrimaryKeyInternal(this.mysqlConnectionFactory);
            return new Promise<void>((resolve) => resolve());
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    public async selectByExmapleTest(): Promise<void> {
        try {
            await this.selectByExampleInternal(this.sqliteConnectionFactory);
            await this.selectByExampleInternal(this.mysqlConnectionFactory);
            return new Promise<void>((resolve) => resolve());
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    public async selectCountByExmapleTest(): Promise<void> {
        try {
            await this.selectCountByExampleInternal(this.sqliteConnectionFactory);
            await this.selectCountByExampleInternal(this.mysqlConnectionFactory);
            return new Promise<void>((resolve) => resolve());
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    public async selectByDynamicQueryTest(): Promise<void> {
        try {
            await this.selectByDynamicQueryInternal(this.sqliteConnectionFactory);
            await this.selectByDynamicQueryInternal(this.mysqlConnectionFactory);
            return new Promise<void>((resolve) => resolve());
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    public async selectCountByDynamicQueryTest(): Promise<void> {
        try {
            await this.selectCountByDynamicQueryInternal(this.sqliteConnectionFactory);
            await this.selectCountByDynamicQueryInternal(this.mysqlConnectionFactory);
            return new Promise<void>((resolve) => resolve());
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    public async deleteByExampleTest(): Promise<void> {
        try {
            await this.deleteByExampleInternal(this.sqliteConnectionFactory);
            await this.deleteByExampleInternal(this.mysqlConnectionFactory);
            return new Promise<void>((resolve) => resolve());
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    private async insertTestInternalWithAutoIncrease(connectionFactory: ConnectionFactory): Promise<void> {
        try {
            const conn = await connectionFactory.getConnection();
            const mapper = new BookMapper(conn);
            const newBook = new Book();
            newBook.name = "book_" + new Date().toString();
            newBook.price = 20;
            const result = await mapper.insert(newBook);
            conn.release();
            if (result > 0 && newBook.id > 0) {
                return new Promise<void>((resolve) => resolve());
            } else {
                return new Promise<void>((resolve, reject) => reject("insert failed"));
            }
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    private async insertSelectiveTestInternalWithAutoIncrease(connectionFactory: ConnectionFactory): Promise<void> {
        try {
            const conn = await connectionFactory.getConnection();
            const mapper = new BookMapper(conn);
            const newBook = new Book();
            newBook.name = "book_" + new Date().toString();
            const result = await mapper.insertSelective(newBook);

            const searchBook = await mapper.selectByPrimaryKey(newBook.id);
            conn.release();
            if (result > 0 && newBook.id > 0 && searchBook && searchBook.price === 10) {
                return new Promise<void>((resolve) => resolve());
            } else {
                return new Promise<void>((resolve, reject) => reject("insert failed"));
            }
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    private async insertTestInternalWithoutAutoIncrease(connectionFactory: ConnectionFactory): Promise<void> {
        try {
            const conn = await connectionFactory.getConnection();
            const mapper = new StudentMapper(conn);
            const newStudent = new Student();
            newStudent.name = "mapperTest_" + new Date().toString();
            newStudent.age = 30;
            const result = await mapper.insert(newStudent);
            conn.release();
            if (result > 0) {
                return new Promise<void>((resolve) => resolve());
            } else {
                return new Promise<void>((resolve, reject) => reject("insert failed"));
            }
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    private async updateByPrimaryKeyInternal(connectionFactory: ConnectionFactory): Promise<void> {
        try {
            const conn = await connectionFactory.getConnection();
            try {
                const mapper = new BookMapper(conn);
                const newBook = new Book();
                newBook.name = "book_" + new Date().toString();
                const result = await mapper.insertSelective(newBook);
                const searchBook = await mapper.selectByPrimaryKey(newBook.id);
                if (result > 0 && newBook.id > 0 && searchBook && searchBook.price === 10) {
                    const updateBook = new Book();
                    updateBook.price = 100;
                    updateBook.name = newBook.name;
                    updateBook.id = newBook.id;
                    await mapper.updateByPrimaryKey(updateBook);
                    const updatedBook = await mapper.selectByPrimaryKey(newBook.id);
                    if (updatedBook
                        && updatedBook.price === 100
                        && updatedBook.name === newBook.name) {
                        return new Promise<void>((resolve) => resolve());
                    } else {
                        return new Promise<void>((resolve, reject) => reject("upate failed"));
                    }
                } else {
                    return new Promise<void>((resolve, reject) => reject("insert failed"));
                }
            } finally {
                conn.release();
            }
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    private async updateSelectiveByPrimaryKeyInternal(connectionFactory: ConnectionFactory): Promise<void> {
        try {
            const conn = await connectionFactory.getConnection();
            try {
                const mapper = new BookMapper(conn);
                const newBook = new Book();
                newBook.name = "book_" + new Date().toString();
                const result = await mapper.insertSelective(newBook);
                const searchBook = await mapper.selectByPrimaryKey(newBook.id);
                if (result > 0 && newBook.id > 0 && searchBook && searchBook.price === 10) {
                    const updateBook = new Book();
                    updateBook.price = 100;
                    // no need assign name
                    // updateBook.name = newBook.name;
                    updateBook.id = newBook.id;
                    await mapper.updateByPrimaryKeySelective(updateBook);
                    const updatedBook = await mapper.selectByPrimaryKey(newBook.id);
                    if (updatedBook
                        && updatedBook.price === 100
                        && updatedBook.name === newBook.name) {
                        return new Promise<void>((resolve) => resolve());
                    } else {
                        return new Promise<void>((resolve, reject) => reject("upate failed"));
                    }
                } else {
                    return new Promise<void>((resolve, reject) => reject("insert failed"));
                }
            } finally {
                conn.release();
            }
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    private async selectByExampleInternal(connectionFactory: ConnectionFactory): Promise<void> {
        try {
            const conn = await connectionFactory.getConnection();
            try {
                const sameBookName = "selectByExampleInternalBook_" + new Date().toString();
                const mapper = new BookMapper(conn);
                const newBook1 = new Book();
                newBook1.name = sameBookName;
                const newBook2 = new Book();
                newBook2.name = sameBookName;
                const insert1Result = await mapper.insertSelective(newBook1);
                if (insert1Result <= 0) {
                    return new Promise<void>((resolve, reject) => reject("insert faild"));
                }
                const insert2Result = await mapper.insertSelective(newBook2);
                if (insert2Result <= 0) {
                    return new Promise<void>((resolve, reject) => reject("insert faild"));
                }

                const searchBook = new Book();
                searchBook.name = sameBookName;
                const books = await mapper.selectByExample(searchBook);
                if (books.length === 2) {
                    return new Promise<void>((resolve, reject) => resolve());
                } else {
                    return new Promise<void>((resolve, reject) => reject("should get 2 items"));
                }
            } finally {
                conn.release();
            }
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    private async selectCountByExampleInternal(connectionFactory: ConnectionFactory): Promise<void> {
        try {
            const conn = await connectionFactory.getConnection();
            try {
                const sameBookName = "selectCountByExampleInternalBook_" + new Date().toString();
                const mapper = new BookMapper(conn);
                const newBook1 = new Book();
                newBook1.name = sameBookName;
                const newBook2 = new Book();
                newBook2.name = sameBookName;
                const insert1Result = await mapper.insertSelective(newBook1);
                if (insert1Result <= 0) {
                    return new Promise<void>((resolve, reject) => reject("insert faild"));
                }
                const insert2Result = await mapper.insertSelective(newBook2);
                if (insert2Result <= 0) {
                    return new Promise<void>((resolve, reject) => reject("insert faild"));
                }

                const searchBook = new Book();
                searchBook.name = sameBookName;
                const bookCount = await mapper.selectCountByExample(searchBook);
                if (bookCount === 2) {
                    return new Promise<void>((resolve, reject) => resolve());
                } else {
                    return new Promise<void>((resolve, reject) => reject("should get 2 items"));
                }
            } finally {
                conn.release();
            }
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    private async selectByDynamicQueryInternal(connectionFactory: ConnectionFactory): Promise<void> {
        try {
            const conn = await connectionFactory.getConnection();
            try {
                const sameBookName = "selectByDynamicQueryInternalBook" + new Date().toString();
                const mapper = new BookMapper(conn);
                const newBook1 = new Book();
                newBook1.name = sameBookName;
                const newBook2 = new Book();
                newBook2.name = sameBookName;
                const insert1Result = await mapper.insertSelective(newBook1);
                if (insert1Result <= 0) {
                    return new Promise<void>((resolve, reject) => reject("insert faild"));
                }
                const insert2Result = await mapper.insertSelective(newBook2);
                if (insert2Result <= 0) {
                    return new Promise<void>((resolve, reject) => reject("insert faild"));
                }

                const nameFilter = new FilterDescriptor<Book>((b) => b.name, FilterOperator.EQUAL, sameBookName);
                const query = DynamicQuery.createIntance<Book>().addFilters(nameFilter);
                const books = await mapper.selectByDynamicQuery(query);
                if (books.length === 2) {
                    return new Promise<void>((resolve, reject) => resolve());
                } else {
                    return new Promise<void>((resolve, reject) => reject("should get 2 items"));
                }
            } finally {
                conn.release();
            }
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    private async selectCountByDynamicQueryInternal(connectionFactory: ConnectionFactory): Promise<void> {
        try {
            const conn = await connectionFactory.getConnection();
            try {
                const sameBookName = "selectCountByDynamicQueryInternalBook" + new Date().toString();
                const mapper = new BookMapper(conn);
                const newBook1 = new Book();
                newBook1.name = sameBookName;
                const newBook2 = new Book();
                newBook2.name = sameBookName;
                const insert1Result = await mapper.insertSelective(newBook1);
                if (insert1Result <= 0) {
                    return new Promise<void>((resolve, reject) => reject("insert faild"));
                }
                const insert2Result = await mapper.insertSelective(newBook2);
                if (insert2Result <= 0) {
                    return new Promise<void>((resolve, reject) => reject("insert faild"));
                }

                const nameFilter = new FilterDescriptor<Book>((b) => b.name, FilterOperator.EQUAL, sameBookName);
                const query = DynamicQuery.createIntance<Book>().addFilters(nameFilter);
                const bookCount = await mapper.selectCountByDynamicQuery(query);
                if (bookCount === 2) {
                    return new Promise<void>((resolve, reject) => resolve());
                } else {
                    return new Promise<void>((resolve, reject) => reject("should get 2 items"));
                }
            } finally {
                conn.release();
            }
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }

    private async deleteByExampleInternal(connectionFactory: ConnectionFactory): Promise<void> {
        try {
            const conn = await connectionFactory.getConnection();
            try {
                const sameBookName = "deleteByExample" + new Date().toString();
                const mapper = new BookMapper(conn);
                const newBook1 = new Book();
                newBook1.name = sameBookName;
                const newBook2 = new Book();
                newBook2.name = sameBookName;
                const insert1Result = await mapper.insertSelective(newBook1);
                if (insert1Result <= 0) {
                    return new Promise<void>((resolve, reject) => reject("insert faild"));
                }
                const insert2Result = await mapper.insertSelective(newBook2);
                if (insert2Result <= 0) {
                    return new Promise<void>((resolve, reject) => reject("insert faild"));
                }

                const searchBook = new Book();
                searchBook.name = sameBookName;
                const deleteResult = await mapper.deleteByExample(searchBook);
                if (deleteResult === 2) {
                    return new Promise<void>((resolve) => resolve());
                } else {
                    return new Promise<void>((resolve, reject) => reject("delete count should be 2"));
                }
            } finally {
                conn.release();
            }
        } catch (e) {
            return new Promise<void>((resolve, reject) => reject(e));
        }
    }
}

// tslint:disable-next-line:max-classes-per-file
class StudentMapper extends BaseTableMapper<Student> {
    public getEntityClass(): new () => Student {
        return Student;
    }
}

// tslint:disable-next-line:max-classes-per-file
class BookMapper extends BaseTableMapper<Book> {
    public getEntityClass(): new () => Book {
        return Book;
    }
}
