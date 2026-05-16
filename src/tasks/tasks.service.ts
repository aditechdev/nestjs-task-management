import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;
    let tempTask = this.tasks;
    if (status) {
      tempTask = tempTask.filter((f) => f.status === status);
    }
    if (search) {
      tempTask = tempTask.filter((f) => {
        const title = f.title.toLowerCase();
        const description = f.description.toLowerCase();
        const searchLower = search.toLocaleLowerCase();
        const isTitleMatch = title.includes(searchLower);
        const isDiscriptionMatch = description.includes(searchLower);
        if (isTitleMatch || isDiscriptionMatch) {
          return true;
        }
        return false;
      });
    }
    return tempTask;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((t) => t.id === id);
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((f) => f.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
