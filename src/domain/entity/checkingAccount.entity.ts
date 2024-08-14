import { Account } from "./account.entity";
import { Customer } from './customer.entity'

export class CheckingAccount extends Account {
    overdraftLimit: number = 0;

    constructor(customer: Customer, overdraftLimit: number) {
        super(customer, 'checking');
        this.overdraftLimit = overdraftLimit;
    }
}
