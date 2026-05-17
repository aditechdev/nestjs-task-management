/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './task.repository';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from '@/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TasksRepository) {}

  getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
  async getTaskById(id: string, user?: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });
    if (!found) throw new NotFoundException(`Task with ${id} not found`);
    return found;
  }
  async deleteTask(id: string, user?: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    console.log(result);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user?: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.taskStatus = status;
    await this.taskRepository.save(task);
    return task;
  }
}
