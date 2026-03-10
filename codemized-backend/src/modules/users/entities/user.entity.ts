import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash' })
  @Exclude()
  passwordHash: string;

  // ── Relations ──────────────────────────────────────────────────────────────
  @OneToMany(() => Project, (project) => project.creator, { lazy: true })
  projects: Promise<Project[]>;

  @OneToMany(() => Task, (task) => task.assignee, { lazy: true })
  assignedTasks: Promise<Task[]>;

  @OneToMany(() => Comment, (comment) => comment.author, { lazy: true })
  comments: Promise<Comment[]>;
}
