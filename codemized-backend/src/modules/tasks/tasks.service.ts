import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TaskNotFoundException,
  UserNotFoundException,
} from '../../common/exceptions/business.exceptions';
import { User } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { AssignTaskDto, CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(projectId: string, dto: CreateTaskDto, currentUser: User): Promise<Task> {
    // Validates project exists and user owns it
    await this.projectsService.findByIdAndOwner(projectId, currentUser.id);

    const task = this.taskRepository.create({
      ...dto,
      projectId,
    });

    return this.taskRepository.save(task);
  }

  async findByProject(projectId: string, currentUser: User): Promise<Task[]> {
    // Validates access to the project
    await this.projectsService.findByIdAndOwner(projectId, currentUser.id);

    return this.taskRepository.find({
      where: { projectId },
      relations: ['assignee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'project'],
    });
    if (!task) throw new TaskNotFoundException(id);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, currentUser: User): Promise<Task> {
    const task = await this.findById(id);
    await this.projectsService.findByIdAndOwner(task.projectId, currentUser.id);

    Object.assign(task, dto);
    return this.taskRepository.save(task);
  }

  async assignUser(id: string, dto: AssignTaskDto, currentUser: User): Promise<Task> {
    const task = await this.findById(id);
    await this.projectsService.findByIdAndOwner(task.projectId, currentUser.id);

    const assignee = await this.userRepository.findOne({ where: { id: dto.assigneeId } });
    if (!assignee) throw new UserNotFoundException(dto.assigneeId);

    task.assigneeId = dto.assigneeId;
    task.assignee = assignee;
    return this.taskRepository.save(task);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const task = await this.findById(id);
    await this.projectsService.findByIdAndOwner(task.projectId, currentUser.id);
    await this.taskRepository.remove(task);
  }
}