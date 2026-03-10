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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { User } from '../users/entities/user.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ── Create ────────────────────────────────────────────────────────────────
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.create(dto, user);
  }

  // ── List ─────────────────────────────────────────────────────────────────
  // Supports pagination: GET /projects?page=1&limit=10
  @Get()
  @ApiOperation({ summary: 'List all projects for the authenticated user' })
  findAll(
    @Query() pagination: PaginationDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.findAllByUser(user.id, pagination);
  }

  // ── Get by ID ─────────────────────────────────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  // ── Update ────────────────────────────────────────────────────────────────
  @Put(':id')
  @ApiOperation({ summary: 'Update a project (owner only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.update(id, dto, user.id);
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project (owner only)' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.remove(id, user.id);
  }
}