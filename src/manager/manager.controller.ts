import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Manager } from './manager.model';
import { ManagerDto } from './manager.dto';

@Controller('managers')
export class ManagerController {
    constructor(private readonly managerService: ManagerService) { }

    @Post()
    createManager(
        @Body('fullName') fullName: string,
    ): ManagerDto {
        const manager = this.managerService.createManager(fullName);
        return new ManagerDto(manager);
    }

    @Get()
    getManagers(): ManagerDto[] {
        return this.managerService.getManagers().map(manager => new ManagerDto(manager));
    }

    @Get(':id')
    getManagerById(@Param('id') id: string): ManagerDto {
        const manager = this.managerService.getManagerById(id);
        return new ManagerDto(manager);
    }

    @Put(':id')
    updateManager(
        @Param('id') id: string,
        @Body('fullName') fullName: string,
    ): ManagerDto {
        const manager = this.managerService.updateManager(id, fullName);
        return new ManagerDto(manager);
    }

    @Delete(':id')
    deleteManager(@Param('id') id: string): void {
        this.managerService.deleteManager(id);
    }
}