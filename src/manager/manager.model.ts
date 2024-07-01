import { Customer } from '../customer/customer.model'
import { Account } from '../account/account.model'

export class Manager {
    fullName: string
    id: string
    clients: Customer[]

    constructor(fullName: string, id: string) {
        this.fullName = fullName
        this.id = id
        this.clients = []
    }

    addClient(client: Customer): void {
        this.clients.push(client)
    }

    removeClient(client: Customer): void {
        this.clients = this.clients.filter(item => item !== client)
    }

    openAccount(client: Customer, accountType: string): void {
    }

    closeAccount(client: Customer, account: Account): void {
        client.closeAccount(account)
    }

    changeAccountType(client: Customer, account: Account, newType: string): void {
        client.changeAccountType(account, newType)
    }
}
