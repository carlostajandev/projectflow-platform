import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProjectNotFoundException,
  ProjectOwnershipException,
} from '../../common/exceptions/business.exceptions';
import { User } from '../users/entities/user.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto, creator: User): Promise<Project> {
    const project = this.projectRepository.create({
      ...dto,
      creatorId: creator.id,
      creator,
    });
    return this.projectRepository.save(project);
  }

  async findAllByUser(userId: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { creatorId: userId },
      order: { createdAt: 'DESC' },
      relations: ['creator'],
    });
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
    if (!project) throw new ProjectNotFoundException(id);
    return project;
  }

  async findByIdAndOwner(id: string, userId: string): Promise<Project> {
    const project = await this.findById(id);
    if (project.creatorId !== userId) throw new ProjectOwnershipException();
    return project;
  }

  async update(id: string, dto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.findByIdAndOwner(id, userId);
    Object.assign(project, dto);
    return this.projectRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findByIdAndOwner(id, userId);
    await this.projectRepository.remove(project);
  }
}