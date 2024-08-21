export class TransactionDto {
  id: string;
  type: string;
  amount: number;
  createdAt: Date;

  constructor(transaction) {
    this.id = transaction.id;
    this.type = transaction.type;
    this.amount = transaction.amount;
    this.createdAt = transaction.createdAt;
  }
}