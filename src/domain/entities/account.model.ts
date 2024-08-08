import { Customer } from './customer.model';
import { PaymentType } from '../enums/account.enum';

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
    if (this.hasSufficientFunds(amount)) {
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

  hasSufficientFunds(amount: number): boolean {
    return this.balance >= amount;
  }

  processPayment(amount: number, paymentType: PaymentType, paymentDetail: string): void {
    this.withdraw(amount);
    if (paymentType === PaymentType.PIX) {
      console.info(`Pagamento de R$${amount} feito via pix: ${paymentDetail}`);
    } else if (paymentType === PaymentType.BILL) {
      console.info(`Pagamento de R$${amount} feito via boleto: ${paymentDetail}`);
    } else {
      throw new Error('Tipo de pagamento inválido');
    }
  }
}