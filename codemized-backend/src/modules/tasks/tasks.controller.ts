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
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { User } from "../users/entities/user.entity";
import { AssignTaskDto, CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";
import { TasksService } from "./tasks.service";

@ApiTags("Tasks")
@UseGuards(JwtAuthGuard)
@Controller("projects/:projectId/tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // ── Create ────────────────────────────────────────────────────────────────
  @Post()
  @ApiOperation({ summary: "Create a task inside a project" })
  create(
    @Param("projectId") projectId: string,
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.create(projectId, dto, user);
  }

  // ── List ──────────────────────────────────────────────────────────────────
  // Supports pagination: GET /projects/:projectId/tasks?page=1&limit=10
  @Get()
  @ApiOperation({ summary: "List tasks for a project" })
  findAll(
    @Param("projectId") projectId: string,
    @Query() pagination: PaginationDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.findByProject(projectId, user, pagination);
  }

  // ── Update ────────────────────────────────────────────────────────────────
  @Put(":id")
  @ApiOperation({ summary: "Update a task" })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.update(id, dto, user);
  }

  // ── Assign ────────────────────────────────────────────────────────────────
  @Patch(":id/assign")
  @ApiOperation({ summary: "Assign a task to a user" })
  assign(
    @Param("id") id: string,
    @Body() dto: AssignTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.tasksService.assignUser(id, dto, user);
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a task" })
  remove(@Param("id") id: string, @CurrentUser() user: User) {
    return this.tasksService.remove(id, user);
  }
}
