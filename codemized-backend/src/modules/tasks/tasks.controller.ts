import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AssignTaskDto, CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a task in a project' })
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.tasksService.create(projectId, dto, user);
    return { data, message: 'Task created successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks in a project' })
  async findAll(@Param('projectId') projectId: string, @CurrentUser() user: User) {
    const data = await this.tasksService.findByProject(projectId, user);
    return { data, message: 'Tasks retrieved successfully' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.tasksService.findById(id);
    return { data, message: 'Task retrieved successfully' };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.tasksService.update(id, dto, user);
    return { data, message: 'Task updated successfully' };
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign a task to a user' })
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignTaskDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.tasksService.assignUser(id, dto, user);
    return { data, message: 'Task assigned successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.tasksService.remove(id, user);
  }
}