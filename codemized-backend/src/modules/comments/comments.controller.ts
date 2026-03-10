import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/comment.dto';
import { CommentsService } from './comments.service';

@ApiTags('Comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a comment to a task' })
  async create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.commentsService.create(taskId, dto, user);
    return { data, message: 'Comment added successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'List all comments for a task' })
  async findAll(@Param('taskId') taskId: string) {
    const data = await this.commentsService.findByTask(taskId);
    return { data, message: 'Comments retrieved successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.commentsService.remove(id, user.id);
  }
}