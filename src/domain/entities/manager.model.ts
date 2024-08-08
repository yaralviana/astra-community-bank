import { Customer } from './customer.model'
import { Account } from './account.model'

export class Manager {
    fullName: string;
    id: string;
    customers: Customer[] = [];

    constructor(fullName: string, id: string) {
        this.fullName = fullName;
        this.id = id;
    }

    addCustomer(customer: Customer): void {
        this.customers.push(customer);
    }

    removeCustomer(customer: Customer): void {
        this.customers = this.customers.filter(data => data !== customer);
    }

    openAccount(customer: Customer, account: Account): void {
        customer.openAccount(account);
    }

    closeAccount(customer: Customer, account: Account): void {
        customer.closeAccount(account);
    }

    changeAccountType(customer: Customer, account: Account, newType: string): void {
        customer.changeAccountType(account, newType);
    }
}