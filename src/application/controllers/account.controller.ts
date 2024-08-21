import { Controller, Get, Put, Post, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AccountService } from '../../domain/service/account.service';
import { CustomerService } from 'src/domain/service/customer.service';
import { AccountDto } from '../dto/account.dto';
import { PaymentType } from '../../domain/enum/account.enum';

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

      const account = await this.accountService.createAccount(customerId, type, extra);
      
      return new AccountDto(account);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':accountId')
  async getAccountById(
    @Param('accountId') accountId: string,
  ): Promise<AccountDto> {
    try {
      const account = await this.accountService.getAccountById(accountId);
      if (!account) {
        throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
      }
      return new AccountDto(account);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':accountId')
  async deleteAccount(
    @Param('accountId') accountId: string,
  ): Promise<void> {
    try {
      await this.accountService.deleteAccount(accountId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':accountId')
  async updateAccountType(
    @Param('accountId') accountId: string,
    @Body('newType') newType: string,
  ): Promise<AccountDto> {
    try {
      const account = await this.accountService.getAccountById(accountId);
      if (!account) {
        throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
      }
      account.type = newType;
      return new AccountDto(account);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

@Post(':accountId/pay')
async processPayment(
  @Param('accountId') accountId: string,
  @Body('amount') amount: number,
  @Body('paymentType') paymentType: string,
  @Body('paymentDetail') paymentDetail: string,
): Promise<AccountDto> {
  try {
    if (!Object.values(PaymentType).includes(paymentType as PaymentType)) {
      throw new HttpException('Tipo de pagamento inválido', HttpStatus.BAD_REQUEST);
    }

    // Processa o pagamento e salva a transação
    const account = await this.accountService.processPaymentAndSaveTransaction(
      accountId,
      amount,
      paymentType as PaymentType,
      paymentDetail,
    );

    // Retorna a conta atualizada
    return new AccountDto(account);
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(error.message || 'Ocorreu um erro no servidor', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

}
