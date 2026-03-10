import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CommentNotFoundException,
  TaskNotFoundException,
} from '../../common/exceptions/business.exceptions';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { CreateCommentDto } from './dto/comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(taskId: string, dto: CreateCommentDto, author: User): Promise<Comment> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new TaskNotFoundException(taskId);

    const comment = this.commentRepository.create({
      content: dto.content,
      taskId,
      authorId: author.id,
      author,
    });

    return this.commentRepository.save(comment);
  }

  async findByTask(taskId: string): Promise<Comment[]> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new TaskNotFoundException(taskId);

    return this.commentRepository.find({
      where: { taskId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new CommentNotFoundException(id);

    // Only the author can delete their comment
    if (comment.authorId !== userId) {
      throw new CommentNotFoundException(id);
    }

    await this.commentRepository.remove(comment);
  }
}