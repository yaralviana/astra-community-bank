import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from '../entity/manager.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
  ) {}

  async createManager(fullName: string): Promise<Manager> {
    const manager = this.managerRepository.create({ fullName });
    return this.managerRepository.save(manager);
  }

  async getManagers(): Promise<Manager[]> {
    return this.managerRepository.find({ relations: ['customers'] });
  }

  async getManagerById(id: string): Promise<Manager> {
    const manager = await this.managerRepository.findOne({ where: { id }, relations: ['customers'] });
    if (!manager) {
      throw new NotFoundException('Gerente não encontrado');
    }
    return manager;
  }

  async updateManager(id: string, fullName: string): Promise<Manager> {
    const manager = await this.getManagerById(id);
    manager.fullName = fullName;
    return this.managerRepository.save(manager);
  }

  async deleteManager(id: string): Promise<void> {
    const result = await this.managerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Gerente não encontrado');
    }
  }
}
