export class ManagerDto {
    id: string;
    fullName: string;
    customers: string[];

    constructor(manager) {
        this.id = manager.id;
        this.fullName = manager.fullName;
        this.customers = manager.customers.map(customer => customer.id);
    }
}