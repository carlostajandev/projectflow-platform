import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  async create(@Body() dto: CreateProjectDto, @CurrentUser() user: User) {
    const data = await this.projectsService.create(dto, user);
    return { data, message: 'Project created successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'List all projects for the authenticated user' })
  async findAll(@CurrentUser() user: User) {
    const data = await this.projectsService.findAllByUser(user.id);
    return { data, message: 'Projects retrieved successfully' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const data = await this.projectsService.findByIdAndOwner(id, user.id);
    return { data, message: 'Project retrieved successfully' };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a project' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.projectsService.update(id, dto, user.id);
    return { data, message: 'Project updated successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.projectsService.remove(id, user.id);
  }
}