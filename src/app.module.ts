import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerController } from './application/controllers/customer.controller';
import { ManagerController } from './application/controllers/manager.controller';
import { AccountController } from './application/controllers/account.controller';
import { CustomerService } from './domain/service/customer.service';
import { ManagerService } from './domain/service/manager.service';
import { AccountService } from './domain/service/account.service';
import { Customer } from './domain/entity/customer.entity';
import { Manager } from './domain/entity/manager.entity';
import { Account } from './domain/entity/account.entity';
import * as dotenv from 'dotenv';

dotenv.config();


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',  
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Customer, Manager, Account],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Customer, Manager, Account]),
  ],
  controllers: [
    AppController,
    CustomerController,
    ManagerController,
    AccountController,
  ],
  providers: [
    AppService,
    CustomerService,
    ManagerService,
    AccountService,
  ],
})
export class AppModule {}
