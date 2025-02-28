import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Auth } from '../users/decorators/auth.decorator';
import { User } from '../users/entities/user.entity';
import { PublicRoute } from '../auth/decorators/public-route.decorator';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Auth() user: User) {
    return this.todosService.create(createTodoDto, user);
  }

  @PublicRoute()
  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @PublicRoute()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/me')
  findMyTodos(@Auth() user: User) {
    return this.todosService.findAllByUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Auth() user: User,
  ) {
    return this.todosService.update(id, updateTodoDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Auth() user: User) {
    return this.todosService.remove(id, user);
  }
} 