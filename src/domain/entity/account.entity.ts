import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Customer } from './customer.entity';
import { PaymentType } from '../enum/account.enum';
import { Transaction } from './transaction.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @ManyToOne(() => Customer, customer => customer.accounts, { eager: true })
  customer: Customer;

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions: Transaction[];  

  @Column()
  type: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;


  constructor(customer?: Customer, type?: string) {
    if (customer && type) {
      this.customer = customer;
      this.type = type;
      this.balance = 0;
    }
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
