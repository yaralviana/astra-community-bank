import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerController } from './application/controllers/customer.controller';
import { ManagerController } from './application/controllers/manager.controller';
import { AccountController } from './application/controllers/account.controller';
import { CustomerService } from './domain/services/customer.service';
import { ManagerService } from './domain/services/manager.service';
import { AccountService } from './domain/services/account.service';

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
