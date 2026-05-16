import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
})
export class AppModule {}
//Each aplocation has atleast 1 module
// Module are singelton
// It is a good practice to have 1 module per folder
