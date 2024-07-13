import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerController } from './customer/customer.controller';
import { ManagerController } from './manager/manager.controller';
import { AccountController } from './account/account.controller';
import { CustomerService } from './customer/customer.service';
import { ManagerService } from './manager/manager.service';
import { AccountService } from './account/account.service';

@Module({
  imports: [],
  controllers: [CustomerController, ManagerController, AccountController],
  providers: [CustomerService, ManagerService, AccountService],
})
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
