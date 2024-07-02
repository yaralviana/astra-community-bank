export class CustomerDto {
    id: string;
    fullName: string;
    address: string;
    phone: string;
    managerId: string;

    constructor(customer) {
        this.id = customer.id;
        this.fullName = customer.fullName;
        this.address = customer.address;
        this.phone = customer.phone;
        this.managerId = customer.manager.id;
    }
}