import { ChildEntity, Column } from 'typeorm';
import { Account } from './account.entity';
import { Customer } from './customer.entity';

@ChildEntity('checking')
export class CheckingAccount extends Account {
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  overdraftLimit: number;

  constructor(customer: Customer, overdraftLimit: number = 0) {
    super(customer, 'checking');
    this.overdraftLimit = overdraftLimit;
  }

  withdraw(amount: number): void {
    if (amount > this.balance + this.overdraftLimit) {
      throw new Error('Limite de cheque especial excedido');
    }
    this.balance -= amount;
  }
}
