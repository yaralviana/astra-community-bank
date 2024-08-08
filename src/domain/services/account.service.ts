import { Injectable } from '@nestjs/common';
import { Customer } from 'src/domain/entities/customer.model';
import { Account } from '../entities/account.model';
import { CheckingAccount } from '../entities/checkingAccount.model';
import { SavingsAccount } from '../entities/savingAccount.model';
import { AccountType } from '../enums/account.enum';

@Injectable()
export class AccountService {
    private accounts: Account[] = [];

    createAccount(customer: Customer, type: string, extra?: number): Account {
        if (extra <= 0) {
            throw new Error('O depósito deve ser maior que 0');
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
        this.accounts.push(account);
        customer.openAccount(account);
        return account;
    }

    getAccounts(): Account[] {
        return this.accounts;
    }

    getAccountById(customerId: string, type: string): Account {
        return this.accounts.find(account => account.customer.id === customerId && account.type === type);
    }

    deleteAccount(customerId: string, type: string): void {
        this.accounts = this.accounts.filter(account => !(account.customer.id === customerId && account.type === type));
    }
}