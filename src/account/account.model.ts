import { Customer } from '../customer/customer.model'

export abstract class Account {
    balance: number
    customer: Customer

    constructor(initialBalance: number, customer: Customer) {
        this.balance = initialBalance
        this.customer = customer
    }

    deposit(amount: number): void {
        this.balance += amount
    }

    withdraw(amount: number): void {
        if (amount <= this.balance) {
            this.balance -= amount
        } else {
            throw new Error('Saldo insuficiente!')
        }
    }

    checkBalance(): number {
        return this.balance
    }

    abstract transfer(destination: Account, amount: number): void
}