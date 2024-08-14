import { Account } from './account.entity';
import { Customer } from './customer.entity'

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