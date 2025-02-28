import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo)
    private todoModel: typeof Todo,
  ) {}

  async create(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
    return this.todoModel.create({
      ...createTodoDto,
      userId: user.id,
    });
  }

  async findAll(): Promise<Todo[]> {
    return this.todoModel.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, user: User): Promise<Todo> {
    const todo = await this.findOne(id);

    if (todo.userId !== user.id) {
      throw new ForbiddenException('You can only update your own todos');
    }

    await todo.update(updateTodoDto);
    return todo;
  }

  async remove(id: number, user: User): Promise<void> {
    const todo = await this.findOne(id);

    if (todo.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own todos');
    }

    await todo.destroy();
  }

  async findAllByUser(user: User): Promise<Todo[]> {
    return this.todoModel.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }
} 