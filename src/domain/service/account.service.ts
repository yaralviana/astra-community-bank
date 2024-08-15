import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from 'src/domain/entity/customer.entity';
import { Account } from '../entity/account.entity';
import { CheckingAccount } from '../entity/checkingAccount.entity';
import { SavingsAccount } from '../entity/savingAccount.entity';
import { AccountType } from '../enum/account.enum';
import { Transaction} from '../entity/transaction.entity';
import { TransactionType } from '../enum/transaction.enum';
import { PaymentType } from '../enum/account.enum';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createAccount(customerId: string, type: string, extra?: number): Promise<Account> {
    if (extra <= 0) {
      throw new Error('O depósito deve ser maior que 0');
    }

    if (!customerId) {
      throw new Error('O ID do cliente é obrigatório');
    }

    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    let account: Account;
    if (type === AccountType.CHEKING) {
      account = new CheckingAccount(customer, extra || 0);
    } else if (type === AccountType.SAVINGS) {
      account = new SavingsAccount(customer, extra || 0);
    } else {
      throw new Error('Tipo de conta inválido');
    }

    account.deposit(extra);
    return this.accountRepository.save(account);
  }

  async getAccounts(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async getAccountById(accountId: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: ['customer'],
    });
    if (!account) {
      throw new Error('Conta não encontrada');
    }
    return account;
  }

  async updateAccount(account: Account): Promise<Account> {
    return this.accountRepository.save(account);
  }

  async deleteAccount(accountId: string): Promise<void> {
    const account = await this.getAccountById(accountId);
    if (account) {
      await this.accountRepository.remove(account);
    }
  }

  async getTransactionHistory(accountId: string): Promise<Transaction[]> {
    const account = await this.getAccountById(accountId);
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    return this.transactionRepository.find({
      where: { account },
      order: { createdAt: 'DESC' },
    });
  }

    async processPaymentAndSaveTransaction(
    accountId: string,
    amount: number,
    paymentType: PaymentType,
    paymentDetail: string,
  ): Promise<Account> {
    const account = await this.getAccountById(accountId);
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    if (!account.hasSufficientFunds(amount)) {
      throw new Error('Saldo insuficiente');
    }

    account.processPayment(amount, paymentType, paymentDetail);

    await this.updateAccount(account);

    const transaction = this.transactionRepository.create({
      account,
      amount,
      type: TransactionType.WITHDRAW, 
      createdAt: new Date(),
    });

    await this.transactionRepository.save(transaction);

    return account;
  }
}
