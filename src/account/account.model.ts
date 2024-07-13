import { Customer } from '../customer/customer.model'

export class Account {
    balance: number = 0;
    customer: Customer;
    type: string;

    constructor(customer: Customer, type: string) {
        this.customer = customer;
        this.type = type;
    }

    deposit(amount: number): void {
        this.balance += amount;
    }

    withdraw(amount: number): void {
        if (this.balance >= amount) {
            this.balance -= amount;
        } else {
            throw new Error("Saldo insuficiente");
        }
    }

    checkBalance(): number {
        return this.balance;
    }

    transfer(destination: Account, amount: number): void {
        this.withdraw(amount);
        destination.deposit(amount);
    }
}