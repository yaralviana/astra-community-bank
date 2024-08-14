import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entity/customer.entity';
import { Manager } from 'src/domain/entity/manager.entity';
import { ManagerService } from 'src/domain/service/manager.service';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,
        private readonly managerService: ManagerService,
    ) {}

    async createCustomer(fullName: string, address: string, phone: string, managerId: string): Promise<Customer> {
        const manager = await this.managerService.getManagerById(managerId);
        if (!manager) {
            throw new NotFoundException('Gerente não encontrado');
        }

        const customer = this.customerRepository.create({ fullName, address, phone, manager });
        await this.customerRepository.save(customer);

        manager.addCustomer(customer);
        await this.managerService.updateManager(manager.id, manager.fullName);  

        return customer;
    }

    async getCustomers(): Promise<Customer[]> {
        return this.customerRepository.find({ relations: ['manager'] });
    }

    async getCustomerById(id: string): Promise<Customer> {
        const customer = await this.customerRepository.findOne({ where: { id }, relations: ['manager'] });
        if (!customer) {
            throw new NotFoundException('Cliente não encontrado');
        }
        return customer;
    }

    async updateCustomer(id: string, fullName: string, address: string, phone: string): Promise<Customer> {
        const customer = await this.getCustomerById(id);
        customer.fullName = fullName;
        customer.address = address;
        customer.phone = phone;
        return this.customerRepository.save(customer);
    }

    async deleteCustomer(id: string): Promise<void> {
        const result = await this.customerRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Cliente não encontrado');
        }
    }
}
