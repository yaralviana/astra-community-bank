import { ChildEntity, Column } from 'typeorm';
import { Account } from './account.entity';
import { Customer } from './customer.entity';

@ChildEntity('savings') 
export class SavingsAccount extends Account {
  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  interestRate: number;

  constructor(customer: Customer, interestRate: number) {
    super(customer, 'savings'); 
    this.interestRate = interestRate;
  }

  calculateInterest(): number {
    return this.balance * this.interestRate;
  }
}
