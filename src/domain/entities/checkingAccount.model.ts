import { Account } from "./account.model";
import { Customer } from './customer.model'

export class CheckingAccount extends Account {
    overdraftLimit: number = 0;

    constructor(customer: Customer, overdraftLimit: number) {
        super(customer, 'checking');
        this.overdraftLimit = overdraftLimit;
    }
}
