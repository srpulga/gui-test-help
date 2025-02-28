import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      database: 'sequelize',
      host: 'localhost',
      username: 'root',
      password: 'root',
      logging: (q) => console.log(q),
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TodosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}