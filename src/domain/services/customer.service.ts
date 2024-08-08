import { Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.model';
import { Manager } from 'src/domain/entities/manager.model';
import { ManagerService } from 'src/domain/services/manager.service';

@Injectable()
export class CustomerService {

    private customers: Customer[] = [];
    constructor(private managerService: ManagerService) { }

    createCustomer(fullName: string, id: string, address: string, phone: string, managerId: string): Customer {
        console.log('managers', this.managerService.getManagers());
        const manager = this.managerService.getManagerById(managerId);
        if (!manager) {
            throw new Error('Gerente não encontrado');
        }
        const customer = new Customer(fullName, address, phone, manager);
        this.customers.push(customer);
        manager.addCustomer(customer);
        return customer;
    }

    getCustomers(): Customer[] {
        return this.customers;
    }

    getCustomerById(id: string): Customer {
        return this.customers.find(item => item.id === id);
    }

    updateCustomer(id: string, fullName: string, address: string, phone: string): Customer {
        const customer = this.getCustomerById(id);
        if (!customer) {
            throw new Error('Cliente não encontrado');
        }
        customer.fullName = fullName;
        customer.address = address;
        customer.phone = phone;
        return customer;
    }

    deleteCustomer(id: string): void {
        this.customers = this.customers.filter(item => item.id !== id);
    }
}
