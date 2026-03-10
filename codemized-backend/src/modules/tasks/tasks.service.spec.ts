import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, TaskPriority } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import {
  TaskNotFoundException,
  UserNotFoundException,
} from '../../common/exceptions/business.exceptions';

const mockUser: User = {
  id: 'user-001',
  name: 'Carlos',
  email: 'carlos@test.com',
  passwordHash: 'hash',
  projects: Promise.resolve([]),
  assignedTasks: Promise.resolve([]),
  comments: Promise.resolve([]),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTask: Task = {
  id: 'task-001',
  title: 'Test Task',
  description: 'A test task',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  dueDate: null,
  projectId: 'proj-001',
  assigneeId: null,
  assignee: null,
  comments: Promise.resolve([]),
  project: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTaskRepository = {
  create:  jest.fn(),
  save:    jest.fn(),
  find:    jest.fn(),
  findOne: jest.fn(),
  remove:  jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
};

const mockProjectsService = {
  findByIdAndOwner: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockTaskRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: ProjectsService,          useValue: mockProjectsService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  // ── create ────────────────────────────────────────────────────────────────
  describe('create', () => {
    it('should create and return a task', async () => {
      mockProjectsService.findByIdAndOwner.mockResolvedValue({});
      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(
        'proj-001',
        { title: 'Test Task', status: TaskStatus.TODO, priority: TaskPriority.MEDIUM },
        mockUser,
      );

      expect(result.title).toBe('Test Task');
      expect(mockTaskRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  // ── findByProject ─────────────────────────────────────────────────────────
  describe('findByProject', () => {
    it('should return tasks for a project', async () => {
      mockProjectsService.findByIdAndOwner.mockResolvedValue({});
      mockTaskRepository.find.mockResolvedValue([mockTask]);

      const result = await service.findByProject('proj-001', mockUser);

      expect(result).toHaveLength(1);
      expect(result[0].projectId).toBe('proj-001');
    });
  });

  // ── findById ──────────────────────────────────────────────────────────────
  describe('findById', () => {
    it('should return a task by id', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findById('task-001');

      expect(result.id).toBe('task-001');
    });

    it('should throw TaskNotFoundException if not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(TaskNotFoundException);
    });
  });

  // ── update ────────────────────────────────────────────────────────────────
  describe('update', () => {
    it('should update and return the task', async () => {
      const updated = { ...mockTask, title: 'Updated Task' };
      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockProjectsService.findByIdAndOwner.mockResolvedValue({});
      mockTaskRepository.save.mockResolvedValue(updated);

      const result = await service.update('task-001', { title: 'Updated Task' }, mockUser);

      expect(result.title).toBe('Updated Task');
    });
  });

  // ── assignUser ────────────────────────────────────────────────────────────
  describe('assignUser', () => {
    it('should assign a user to a task', async () => {
      const assigned = { ...mockTask, assigneeId: 'user-001', assignee: mockUser };
      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockProjectsService.findByIdAndOwner.mockResolvedValue({});
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockTaskRepository.save.mockResolvedValue(assigned);

      const result = await service.assignUser('task-001', { assigneeId: 'user-001' }, mockUser);

      expect(result.assigneeId).toBe('user-001');
    });

    it('should throw UserNotFoundException if assignee does not exist', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockProjectsService.findByIdAndOwner.mockResolvedValue({});
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.assignUser('task-001', { assigneeId: 'ghost-user' }, mockUser),
      ).rejects.toThrow(UserNotFoundException);
    });
  });

  // ── remove ────────────────────────────────────────────────────────────────
  describe('remove', () => {
    it('should remove the task', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockProjectsService.findByIdAndOwner.mockResolvedValue({});
      mockTaskRepository.remove.mockResolvedValue(undefined);

      await expect(service.remove('task-001', mockUser)).resolves.not.toThrow();
      expect(mockTaskRepository.remove).toHaveBeenCalledWith(mockTask);
    });
  });
});
