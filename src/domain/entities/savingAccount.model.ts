import { Account } from './account.model';
import { Customer } from './customer.model'

export class SavingsAccount extends Account {
    interestRate: number;

    constructor(customer: Customer, interestRate: number) {
        super(customer, 'savings');
        this.interestRate = interestRate;
    }

    calculateInterest(): number {
        return this.balance * this.interestRate;
    }
}