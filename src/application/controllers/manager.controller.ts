import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ManagerService } from '../../domain/services/manager.service';
import { ManagerDto } from '../dto/manager.dto';
import { CustomerDto } from 'src/application/dto/customer.dto';
import { AccountDto } from 'src/application/dto/account.dto';
import { CustomerService } from 'src/domain/services/customer.service';
import { AccountService } from 'src/domain/services/account.service';

@Controller('managers')
export class ManagerController {
  constructor(
    private readonly managerService: ManagerService,
    private readonly customerService: CustomerService,
    private readonly accountService: AccountService,
  ) {}

  @Post()
  async createManager(@Body('fullName') fullName: string): Promise<ManagerDto> {
    try {
      const manager = await this.managerService.createManager(fullName);
      return new ManagerDto(manager);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getManagers(): Promise<ManagerDto[]> {
    try {
      const managers = await this.managerService.getManagers();
      return managers.map(manager => new ManagerDto(manager));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getManagerById(@Param('id') id: string): Promise<ManagerDto> {
    try {
      const manager = await this.managerService.getManagerById(id);
      if (!manager) {
        throw new HttpException('Gerente não encontrado', HttpStatus.NOT_FOUND);
      }
      return new ManagerDto(manager);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateManager(
    @Param('id') id: string,
    @Body('fullName') fullName: string,
  ): Promise<ManagerDto> {
    try {
      const manager = await this.managerService.updateManager(id, fullName);
      if (!manager) {
        throw new HttpException('Gerente não encontrado', HttpStatus.NOT_FOUND);
      }
      return new ManagerDto(manager);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteManager(@Param('id') id: string): Promise<void> {
    try {
      await this.managerService.deleteManager(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':managerId/customers')
  async addCustomer(
    @Param('managerId') managerId: string,
    @Body('fullName') fullName: string,
    @Body('id') id: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
  ): Promise<CustomerDto> {
    try {
      const manager = await this.managerService.getManagerById(managerId);
      if (!manager) {
        throw new HttpException('Gerente não encontrado', HttpStatus.NOT_FOUND);
      }
      const customer = await this.customerService.createCustomer(fullName, id, address, phone, managerId);
      manager.addCustomer(customer);
      return new CustomerDto(customer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':managerId/customers/:customerId')
  async removeCustomer(
    @Param('managerId') managerId: string,
    @Param('customerId') customerId: string,
  ): Promise<void> {
    try {
      const manager = await this.managerService.getManagerById(managerId);
      if (!manager) {
        throw new HttpException('Gerente não encontrado', HttpStatus.NOT_FOUND);
      }
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
      }
      manager.removeCustomer(customer);
      await this.customerService.deleteCustomer(customerId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':managerId/customers/:customerId/accounts')
  async openAccount(
    @Param('managerId') managerId: string,
    @Param('customerId') customerId: string,
    @Body('type') type: string,
    @Body('extra') extra: number,
  ): Promise<AccountDto> {
    try {
      const manager = await this.managerService.getManagerById(managerId);
      if (!manager) {
        throw new HttpException('Gerente não encontrado', HttpStatus.NOT_FOUND);
      }
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
      }
      if (extra <= 0) {
        throw new HttpException('O depósito deve ser maior que 0', HttpStatus.BAD_REQUEST);
      }
      const account = await this.accountService.createAccount(customer, type, extra);
      manager.openAccount(customer, account);
      return new AccountDto(account);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':managerId/customers/:customerId/accounts/:accountType')
  async closeAccount(
    @Param('managerId') managerId: string,
    @Param('customerId') customerId: string,
    @Param('accountType') accountType: string,
  ): Promise<void> {
    try {
      const manager = await this.managerService.getManagerById(managerId);
      if (!manager) {
        throw new HttpException('Gerente não encontrado', HttpStatus.NOT_FOUND);
      }
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
      }
      const account = await this.accountService.getAccountById(customerId, accountType);
      if (!account) {
        throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
      }
      manager.closeAccount(customer, account);
      await this.accountService.deleteAccount(customerId, accountType);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':managerId/customers/:customerId/accounts/:accountType')
  async changeAccountType(
    @Param('managerId') managerId: string,
    @Param('customerId') customerId: string,
    @Param('accountType') accountType: string,
    @Body('newType') newType: string,
  ): Promise<AccountDto> {
    try {
      const manager = await this.managerService.getManagerById(managerId);
      if (!manager) {
        throw new HttpException('Gerente não encontrado', HttpStatus.NOT_FOUND);
      }
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
      }
      const account = await this.accountService.getAccountById(customerId, accountType);
      if (!account) {
        throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
      }
      manager.changeAccountType(customer, account, newType);
      account.type = newType;
      return new AccountDto(account);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':managerId/customers')
  async getCustomers(@Param('managerId') managerId: string): Promise<CustomerDto[]> {
    try {
      const manager = await this.managerService.getManagerById(managerId);
      if (!manager) {
        throw new HttpException('Gerente não encontrado', HttpStatus.NOT_FOUND);
      }
      return manager.customers.map(customer => new CustomerDto(customer));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':managerId/customers/:customerId/accounts')
  async getAccounts(
    @Param('managerId') managerId: string,
    @Param('customerId') customerId: string,
  ): Promise<AccountDto[]> {
    try {
      const manager = await this.managerService.getManagerById(managerId);
      if (!manager) {
        throw new HttpException('Gerente não encontrado', HttpStatus.NOT_FOUND);
      }
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
      }
      return customer.accounts.map(account => new AccountDto(account));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}