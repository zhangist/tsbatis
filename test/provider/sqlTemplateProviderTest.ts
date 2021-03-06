import { CustomSortDescriptor } from '../../src/model/customSortDescriptor';
import { expect } from "chai";
import * as path from "path";
import { DynamicQuery, FilterDescriptor, SqlTemplateProvider, CustomFilterDescriptor } from "../../src";
import { MysqlConnection, SqliteConnection } from "../../src/connection";
import { DatabaseType, SqliteConnectionConfig, SortDescriptor, FilterCondition } from "../../src/model";
import { RowBounds } from "../../src/model/rowBounds";
import { Customer } from "../db/entity/customer";
import { SqlTemplate } from "../../src/model/sqlTemplate";
import { FilterOperator } from "../../src/model/filterOperator";
import { SortDirection } from "../../src/model/sortDirection";
import { FilterGroupDescriptor } from '../../src/model/filterGroupDescriptor';
import { Student } from '../model/student';
import { ErrorModel } from '../model/ErrorModel';

describe(".SqlTemplateProvider", () => {
    describe("#getPkColumn", () => {
        it("should return 'id' if pk is 'id'", () => {
            const result = SqlTemplateProvider.getPkColumn<Customer>(new Customer());
            expect("id").to.be.eq(result.property);
        });
    });

    describe("#getInsert", () => {
        it("should get insert sql template", () => {
            const newCustomer = new Customer();
            newCustomer.id = "1";
            newCustomer.companyName = "test";
            newCustomer.contactName = "test";
            newCustomer.contactTitle = "test";
            const result = SqlTemplateProvider.getInsert(newCustomer, false);
            expect("INSERT INTO Customer (CompanyName, ContactName, ContactTitle, " +
                "Address, City, Region, PostalCode, Country, Phone, Fax) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").to.be.eq(result.sqlExpression);
        });

        it("should insertSelective sql template", () => {
            const newCustomer = new Customer();
            newCustomer.id = "1";
            newCustomer.companyName = "test";
            newCustomer.contactName = "test";
            newCustomer.contactTitle = "test";
            const result = SqlTemplateProvider.getInsert(newCustomer, true);
            expect("INSERT INTO Customer (CompanyName, ContactName, ContactTitle) " +
                "VALUES (?, ?, ?)").to.be.eq(result.sqlExpression);
        });
    });

    describe("#getDeleteByPk", () => {
        it("should get deleteBypk sql template", () => {
            const result = SqlTemplateProvider.getDeleteByPk<Customer>(Customer, "2");
            const expectValue = `DELETE FROM Customer WHERE Id = ?`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });

        it("should throw error if don't have key column", () => {
            const test = () => {
                SqlTemplateProvider.getDeleteByPk<ErrorModel>(ErrorModel, "1");
            };

            expect(test).to.throw(Error);
        });
    });

    describe("#getDelete", () => {
        it("should get delete sql template", () => {
            const example = new Customer();
            example.id = "3";
            example.address = "test";
            const result = SqlTemplateProvider.getDelete(example);
            const expectValue = `DELETE FROM Customer WHERE Id = ? AND Address = ?`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });
    });

    describe("#getDeleteByDynamicQuery", () => {
        it("should get DeleteByDynamicQuery sql template", () => {
            const query = DynamicQuery.createIntance<Customer>();
            const idFilter = new FilterDescriptor<Customer>((u) => u.id, FilterOperator.EQUAL, "1");
            const addressFilter = new FilterDescriptor<Customer>((u) => u.address, FilterOperator.START_WITH, "test");
            query.addFilters(idFilter, addressFilter);
            const result = SqlTemplateProvider.getDeleteByDynamicQuery<Customer>(Customer, query);
            const expectValue = `DELETE FROM Customer WHERE Id = ? AND Address LIKE ?`;
            expect(expectValue).to.be.eq(result.sqlExpression);
            expect("1").to.be.eq(result.params[0]);
            expect("test%").to.be.eq(result.params[1]);
        });
    });

    describe("#getUpdateByPk", () => {
        it("should getUpdateByPk sql template", () => {
            const example = new Customer();
            example.id = "2";
            example.address = "test";
            const result = SqlTemplateProvider.getUpdateByPk(example, true);
            const expectValue = `UPDATE Customer SET Address = ? WHERE Id = ?`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });

        it("should throw error if don't have key column", () => {
            const test = () => {
                SqlTemplateProvider.getUpdateByPk<ErrorModel>(new ErrorModel(), true);
            };

            expect(test).to.throw(Error);
        });
    });

    describe("#getSelectByPk", () => {
        it("should getSelectByPk sql template", () => {
            const result = SqlTemplateProvider.getSelectByPk<Customer>(Customer, "1");
            // tslint:disable-next-line:max-line-length
            const expectValue = `SELECT Id AS id, CompanyName AS company_name, ContactName AS contact_name, ContactTitle AS contact_title, Address AS address, City AS city, Region AS region, PostalCode AS postal_code, Country AS country, Phone AS phone, Fax AS fax FROM Customer WHERE Id = ?`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });

        it("should throw error if don't have key column", () => {
            const test = () => {
                SqlTemplateProvider.getSelectByPk<ErrorModel>(ErrorModel, "1");
            };

            expect(test).to.throw(Error);
        });
    });

    describe("#getSelect", () => {
        it("should getSelect sql template", () => {
            const example = new Customer();
            example.id = "1";
            example.address = "test";
            const result = SqlTemplateProvider.getSelect(example);
            // tslint:disable-next-line:max-line-length
            const expectValue = `SELECT Id AS id, CompanyName AS company_name, ContactName AS contact_name, ContactTitle AS contact_title, Address AS address, City AS city, Region AS region, PostalCode AS postal_code, Country AS country, Phone AS phone, Fax AS fax FROM Customer WHERE Id = ? AND Address = ?`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });
    });

    describe("#getSelectCountByPk", () => {
        it("should getSelectCountByPk", () => {
            const result = SqlTemplateProvider.getSelectCountByPk<Customer>(Customer, "1");
            const expectValue = `SELECT COUNT(0) FROM Customer WHERE Id = ?`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });

        it("should throw error is empty don't have key column", () => {
            const test = () => {
                SqlTemplateProvider.getSelectCountByPk<ErrorModel>(ErrorModel, "1");
            };
            expect(test).to.throw(Error);
        });
    });

    describe("#getSelectCount", () => {
        it("should getSelectCount sql template", () => {
            const example = new Customer();
            example.id = "1";
            example.address = "test";
            const result = SqlTemplateProvider.getSelectCount(example);
            const expectValue = `SELECT COUNT(0) FROM Customer WHERE Id = ? AND Address = ?`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });
    });

    describe("#getSelectByDynamicQuery", () => {
        it("should getSelectByDynamicQuery sql template", () => {
            const idFilter = new FilterDescriptor<Customer>((u) => u.id, FilterOperator.EQUAL, "1");
            const query = DynamicQuery.createIntance<Customer>();
            query.addFilters(idFilter);
            const result = SqlTemplateProvider.getSelectByDynamicQuery<Customer>(Customer, query);
            // tslint:disable-next-line:max-line-length
            const expectValue = `SELECT Id AS id, CompanyName AS company_name, ContactName AS contact_name, ContactTitle AS contact_title, Address AS address, City AS city, Region AS region, PostalCode AS postal_code, Country AS country, Phone AS phone, Fax AS fax FROM Customer WHERE Id = ?`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });
    });

    describe("#getSelectCountByDynamicQuery", () => {
        it("should getSelectCountByDynamicQuery sql template", () => {
            const idFilter = new FilterDescriptor<Customer>((u) => u.id, FilterOperator.EQUAL, "1");
            const addressFiler = new FilterDescriptor<Customer>((u) => u.address, FilterOperator.START_WITH, "test");
            const query = DynamicQuery.createIntance<Customer>();
            query.addFilters(idFilter, addressFiler);
            const result = SqlTemplateProvider.getSelectCountByDynamicQuery<Customer>(Customer, query);
            const expectValue = `SELECT COUNT(0) FROM Customer WHERE Id = ? AND Address LIKE ?`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });
    });

    describe("#getSelectSql", () => {
        it("should getSelectSql sql template", () => {
            const result = SqlTemplateProvider.getSelectSql<Customer>(Customer);
            // tslint:disable-next-line:max-line-length
            const expectValue = `SELECT Id AS id, CompanyName AS company_name, ContactName AS contact_name, ContactTitle AS contact_title, Address AS address, City AS city, Region AS region, PostalCode AS postal_code, Country AS country, Phone AS phone, Fax AS fax FROM Customer`;
            expect(expectValue).to.be.eq(result);
        });
    });

    describe("#getSelectCountSql", () => {
        it("should getSelectCountSql sql template", () => {
            const result = SqlTemplateProvider.getSelectCountSql<Customer>(Customer);
            const expectValue = `SELECT COUNT(0) FROM Customer`;
            expect(expectValue).to.be.eq(result);
        });
    });

    describe("#getSqlByDynamicQuery", () => {
        it("should return sql if dynamic query is null", () => {
            const result = SqlTemplateProvider.getSqlByDynamicQuery<Customer>(Customer, "SELECT * FROM Customer", null);
            const expectValue = `SELECT * FROM Customer`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });

        it("should return sql with filter and order if dynamic query has filter and sort", () => {
            const addressFilter = new FilterDescriptor<Customer>((u) => u.address, FilterOperator.START_WITH, "test");
            const idSort = new SortDescriptor<Customer>((u) => u.id, SortDirection.DESC);
            const query = DynamicQuery.createIntance<Customer>();
            query.addFilters(addressFilter);
            query.addSorts(idSort);

            // tslint:disable-next-line:max-line-length
            const result = SqlTemplateProvider.getSqlByDynamicQuery<Customer>(Customer, "SELECT * FROM Customer", query);
            const expectValue = `SELECT * FROM Customer WHERE Address LIKE ? ORDER BY Id DESC`;
            expect(expectValue).to.be.eq(result.sqlExpression);
            expect("test%").to.be.eq(result.params[0]);
        });
    });

    describe("#getColumnsExpression", () => {
        it("shoud getColumnExpression sql template", () => {
            const result = SqlTemplateProvider.getColumnsExpression<Customer>(Customer);
            // tslint:disable-next-line:max-line-length
            const expectValue = `Id AS id, CompanyName AS company_name, ContactName AS contact_name, ContactTitle AS contact_title, Address AS address, City AS city, Region AS region, PostalCode AS postal_code, Country AS country, Phone AS phone, Fax AS fax`;
            expect(expectValue).to.be.eq(result);
        });

        it("should has error if entity is null", () => {
            const test = () => {
                SqlTemplateProvider.getColumnsExpression<Customer>(null);
            };
            expect(test).to.throw(Error);
        });
    });

    describe("#getColumnInfos", () => {
        it("should get columnInfos", () => {
            const columnInfos = SqlTemplateProvider.getColumnInfos<Customer>(Customer);
            expect(true).to.be.eq(columnInfos.length > 0);
            expect("Id").to.be.eq(columnInfos[0].columnName);
        });

        it("should has error if entity is null", () => {
            const test = () => {
                SqlTemplateProvider.getColumnInfos<Customer>(null);
            };
            expect(test).to.throw(Error);
        });
    });

    // filter
    describe("#getFilterExpressionByFilterDescriptor", () => {
        it("should getFilterExpressionByFilterDescriptor sql template", () => {
            const idFilter = new FilterDescriptor<Customer>((u) => u.id, FilterOperator.EQUAL, "1");
            // tslint:disable-next-line:max-line-length
            const result = SqlTemplateProvider.getFilterExpressionByFilterDescriptor(Customer, idFilter);
            const expectValue = "Id = ?";
            expect(expectValue).to.be.eq(result.sqlExpression);
            expect("1").to.be.eq(result.params[0]);
        });
    });

    describe("#getFilterExpressionByCustomFilterDescriptor", () => {
        it("should getFilterExpressionByCustomFilterDescriptor sql template", () => {
            const customFilter = new CustomFilterDescriptor();
            customFilter.expression = `CASE {0} THEN {1} ELSE {2} END`;
            customFilter.params = [3, 1, 0];
            const result = SqlTemplateProvider
                .getFilterExpressionByCustomFilterDescriptor<Customer>(Customer, customFilter);
            const expectValue = `CASE ? THEN ? ELSE ? END`;
            expect(expectValue).to.be.eq(result.sqlExpression);
            expect(3).to.be.eq(result.params[0]);
            expect(1).to.be.eq(result.params[1]);
            expect(0).to.be.eq(result.params[2]);
        });
    });

    describe("#getFilterExpressionByFilterBase", () => {
        it("should getFilterExpressionByFilterDescriptor sql template", () => {
            const idFilter = new FilterDescriptor<Customer>((u) => u.id, FilterOperator.EQUAL, "1");
            // tslint:disable-next-line:max-line-length
            const result = SqlTemplateProvider.getFilterExpressionByFilterBase(Customer, idFilter);
            const expectValue = "Id = ?";
            expect(expectValue).to.be.eq(result.sqlExpression);
            expect("1").to.be.eq(result.params[0]);
        });

        it("should getFilterExpressionByCustomFilterDescriptor sql template", () => {
            const customFilter = new CustomFilterDescriptor();
            customFilter.expression = `CASE {0} THEN {1} ELSE {2} END`;
            customFilter.params = [3, 1, 0];
            const result = SqlTemplateProvider
                .getFilterExpressionByFilterBase<Customer>(Customer, customFilter);
            const expectValue = `CASE ? THEN ? ELSE ? END`;
            expect(expectValue).to.be.eq(result.sqlExpression);
            expect(3).to.be.eq(result.params[0]);
            expect(1).to.be.eq(result.params[1]);
            expect(0).to.be.eq(result.params[2]);
        });

        it("should getFilterGroupDescriptor sql template", () => {
            const idFilter = new FilterDescriptor<Customer>((u) => u.id, FilterOperator.EQUAL, "1");
            // tslint:disable-next-line:max-line-length
            const addressFilter = new FilterDescriptor<Customer>(FilterCondition.OR, (u) => u.address, FilterOperator.START_WITH, "test");
            const groupFilter = new FilterGroupDescriptor();
            groupFilter.filters = [idFilter, addressFilter];
            const result = SqlTemplateProvider.getFilterExpressionByFilterBase<Customer>(Customer, groupFilter);
            const expectValue = `Id = ? OR Address LIKE ?`;
            expect(expectValue).to.be.eq(result.sqlExpression);
            expect("1").to.be.eq(result.params[0]);
            expect("test%").to.be.eq(result.params[1]);
        });

        it("should return empty sql template if filter is null", () => {
            const result = SqlTemplateProvider.getFilterExpressionByFilterBase<Customer>(Customer, null);
            expect("").to.be.eq(result.sqlExpression);
        });
    });

    // sort
    describe("#getSortExpressionBySortBase", () => {
        it("should getSortExpressionBySortDescriptor sql template", () => {
            const idSort = new SortDescriptor<Customer>((u) => u.id, SortDirection.DESC);
            const result = SqlTemplateProvider.getSortExpressionBySortBase<Customer>(Customer, idSort);
            const expectValue = `Id DESC`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });

        it("should getSortExpressionByCustomSortDescriptor sql template", () => {
            const customSort = new CustomSortDescriptor();
            customSort.expression = "CASE Id = {0} THEN {1} ELSE {2} END";
            customSort.direction = SortDirection.DESC;
            customSort.params = [3, 1, 0];
            const result = SqlTemplateProvider.getSortExpressionBySortBase<Customer>(Customer, customSort);
            const expectValue = "CASE Id = ? THEN ? ELSE ? END";
            expect(expectValue).to.be.eq(result.sqlExpression);
            expect(3).to.be.eq(result.params[0]);
            expect(1).to.be.eq(result.params[1]);
            expect(0).to.be.eq(result.params[2]);
        });

        it("should get empty sql template", () => {
            const result = SqlTemplateProvider.getSortExpressionBySortBase<Customer>(Customer, null);
            expect("").to.be.eq(result.sqlExpression);
        });
    });

    describe("#getSortExpressionBySortDescriptor", () => {
        it("should getSortExpressionBySortDescriptor sql template", () => {
            const idSort = new SortDescriptor<Customer>((u) => u.id, SortDirection.DESC);
            const result = SqlTemplateProvider.getSortExpressionBySortDescriptor<Customer>(Customer, idSort);
            const expectValue = `Id DESC`;
            expect(expectValue).to.be.eq(result.sqlExpression);
        });
    });

    describe("#getSortExpressionByCustomSortDescriptor", () => {
        it("should getSortExpressionByCustomSortDescriptor sql template", () => {
            const customSort = new CustomSortDescriptor();
            customSort.expression = "CASE Id = {0} THEN {1} ELSE {2} END";
            customSort.direction = SortDirection.DESC;
            customSort.params = [3, 1, 0];
            const result = SqlTemplateProvider.getSortExpressionByCustomSortDescriptor<Customer>(Customer, customSort);
            const expectValue = "CASE Id = ? THEN ? ELSE ? END";
            expect(3).to.be.eq(result.params[0]);
            expect(expectValue).to.be.eq(result.sqlExpression);
        });
    });
});
