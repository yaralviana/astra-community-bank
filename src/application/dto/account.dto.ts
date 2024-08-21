export class AccountDto {
    id: string;
    balance: number;
    type: string;
    customerId: string;

    constructor(account) {
        this.id = account.id;
        this.balance = account.balance;
        this.type = account.type;
        this.customerId = account.customer.id;
    }
}