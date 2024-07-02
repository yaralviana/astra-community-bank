import { Injectable } from '@nestjs/common';
import { Customer } from 'src/customer/customer.model';
import { Account } from './account.model';
import { CheckingAccount } from './checkingAccount.model';
import { SavingsAccount } from './savingAccount.model';

@Injectable()
export class AccountService {
    private accounts: Account[] = [];

    createAccount(customer: Customer, type: string, extra?: number): Account {
        if (extra <= 0) {
            throw new Error('O depósito deve ser maior que 0');
        }

        let account: Account;
        if (type === 'checking') {
            account = new CheckingAccount(customer, extra || 0);
        } else if (type === 'savings') {
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