import { column } from "../../../decorator";
import { TableEntity } from "../../../model";

export class OrderDetailStatus extends TableEntity {
    @column("id", true, false)
    public id: number;
    @column("status_name")
    public statusName: string;

    public getTableName(): string {
        return "order_details_status";
    }
}
