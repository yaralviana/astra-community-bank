import { v4 as uuidv4 } from 'uuid'
import { Account } from './account.model'
import { Manager } from './manager.model'

export class Customer {
    id: string
    fullName: string
    address: string
    phone: string
    accounts: Account[] = []
    manager: Manager

    constructor(fullName: string, address: string, phone: string, manager: Manager) {
        this.id = uuidv4()
        this.fullName = fullName
        this.address = address
        this.phone = phone
        this.accounts = []
        this.manager = manager
    }

    openAccount(account: Account): void {
        this.accounts.push(account)
    }

    closeAccount(account: Account): void {
        this.accounts = this.accounts.filter(item => item !== account)
    }

    changeAccountType(account: Account, newType: string): void {
        account.type = newType;
    }
}
