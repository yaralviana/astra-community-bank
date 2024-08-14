import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Customer } from './customer.entity';
import { Account } from './account.entity';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @OneToMany(() => Customer, customer => customer.manager, { cascade: true })
  customers: Customer[];

  constructor(fullName?: string) {
    if (fullName) {
      this.fullName = fullName;
      this.customers = [];
    }
  }

  addCustomer(customer: Customer): void {
    if (!this.customers) {
      this.customers = [];
    }
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
