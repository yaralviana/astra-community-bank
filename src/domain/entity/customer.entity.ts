import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Account } from './account.entity';
import { Manager } from './manager.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @OneToMany(() => Account, account => account.customer, { cascade: true })
  accounts: Account[];

  @ManyToOne(() => Manager, manager => manager.customers, { eager: true })
  manager: Manager;
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;


  openAccount(account: Account): void {
    if (!this.accounts) {
      this.accounts = [];
    }
    this.accounts.push(account);
  }

  closeAccount(account: Account): void {
    this.accounts = this.accounts.filter(item => item !== account);
  }

  changeAccountType(account: Account, newType: string): void {
    account.type = newType;
  }
}
