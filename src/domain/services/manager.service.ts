import { Injectable } from '@nestjs/common';
import { Manager } from '../entities/manager.model';
import { Customer } from 'src/domain/entities/customer.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ManagerService {
    private managers: Manager[] = [];

    createManager(fullName: string): Manager {
        const id = uuidv4();
        const manager = new Manager(fullName, id);
        this.managers.push(manager);
        return manager;
    }

    getManagers(): Manager[] {
        return this.managers;
    }

    getManagerById(id: string): Manager {
        return this.managers.find(manager => manager.id === id);
    }

    updateManager(id: string, fullName: string): Manager {
        const manager = this.getManagerById(id);
        if (!manager) {
            throw new Error('Gerente não encontrado');
        }
        manager.fullName = fullName;
        return manager;
    }

    deleteManager(id: string): void {
        this.managers = this.managers.filter(data => data.id !== id);
    }
}
