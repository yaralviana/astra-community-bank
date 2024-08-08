import { Controller, Get, Put, Post, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AccountService } from '../../domain/services/account.service';
import { CustomerService } from 'src/domain/services/customer.service';
import { AccountDto } from '../dto/account.dto';
import { PaymentType } from '../../domain/enums/account.enum';

@Controller('accounts')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
  ) {}

  @Post()
  async createAccount(
    @Body('customerId') customerId: string,
    @Body('type') type: string,
    @Body('extra') extra: number,
  ): Promise<AccountDto> {
    try {
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
      }
      const account = await this.accountService.createAccount(customer, type, extra);
      return new AccountDto(account);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':customerId/:type')
  async getAccountById(
    @Param('customerId') customerId: string,
    @Param('type') type: string,
  ): Promise<AccountDto> {
    try {
      const account = await this.accountService.getAccountById(customerId, type);
      if (!account) {
        throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
      }
      return new AccountDto(account);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':customerId/:type')
  async deleteAccount(
    @Param('customerId') customerId: string,
    @Param('type') type: string,
  ): Promise<void> {
    try {
      await this.accountService.deleteAccount(customerId, type);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':customerId/:type')
  async updateAccountType(
    @Param('customerId') customerId: string,
    @Param('type') type: string,
    @Body('newType') newType: string,
  ): Promise<AccountDto> {
    try {
      const account = await this.accountService.getAccountById(customerId, type);
      if (!account) {
        throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
      }
      account.type = newType;
      return new AccountDto(account);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

   @Post(':customerId/:type/pay')
  async processPayment(
    @Param('customerId') customerId: string,
    @Param('type') type: string,
    @Body('amount') amount: number,
    @Body('paymentType') paymentType: PaymentType,
    @Body('paymentDetail') paymentDetail: string,
  ): Promise<AccountDto> {
    try {
      const account = this.accountService.getAccountById(customerId, type);
      if (!account) {
        throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
      }
      if (!account.hasSufficientFunds(amount)) {
        throw new HttpException('Saldo insuficiente', HttpStatus.BAD_REQUEST);
      }
      account.processPayment(amount, paymentType, paymentDetail);
      return new AccountDto(account);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Ocorreu um erro no servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
