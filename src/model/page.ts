import { Entity } from "./entity";

export class Page<T extends Entity> {
    private pageNum: number;
    private pageSize: number;
    private total: number;
    private pages: number;
    private entities: T[];

    constructor(pageNum: number, pageSize: number, total: number, entities: T[]) {
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        this.total = total;
        this.entities = entities;
        this.pages = this.calPages(pageSize, total);
    }

    public getPageNum(): number {
        return this.pageNum;
    }

    public getPageSize(): number {
        return this.pageSize;
    }

    public getTotal(): number {
        return this.total;
    }

    public getPages(): number {
        return this.pages;
    }

    public getEntities(): T[] {
        return this.entities;
    }

    private calPages(pageSize: number, total: number) {
        return Math.ceil(total / pageSize);
    }
}
