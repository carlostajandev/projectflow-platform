import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import {
  ProjectNotFoundException,
  ProjectOwnershipException,
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

const mockProject: Project = {
  id: 'proj-001',
  name: 'Test Project',
  description: 'A test project',
  creatorId: 'user-001',
  creator: mockUser,
  tasks: Promise.resolve([]),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProjectRepository = {
  create:  jest.fn(),
  save:    jest.fn(),
  find:    jest.fn(),
  findOne: jest.fn(),
  remove:  jest.fn(),
};

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: mockProjectRepository },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    jest.clearAllMocks();
  });

  // ── create ────────────────────────────────────────────────────────────────
  describe('create', () => {
    it('should create and return a project', async () => {
      mockProjectRepository.create.mockReturnValue(mockProject);
      mockProjectRepository.save.mockResolvedValue(mockProject);

      const result = await service.create(
        { name: 'Test Project', description: 'A test project' },
        mockUser,
      );

      expect(result.name).toBe('Test Project');
      expect(result.creatorId).toBe(mockUser.id);
      expect(mockProjectRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  // ── findAllByUser ─────────────────────────────────────────────────────────
  describe('findAllByUser', () => {
    it('should return all projects for a user', async () => {
      mockProjectRepository.find.mockResolvedValue([mockProject]);

      const result = await service.findAllByUser('user-001');

      expect(result).toHaveLength(1);
      expect(result[0].creatorId).toBe('user-001');
    });
  });

  // ── findById ──────────────────────────────────────────────────────────────
  describe('findById', () => {
    it('should return a project by id', async () => {
      mockProjectRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.findById('proj-001');

      expect(result.id).toBe('proj-001');
    });

    it('should throw ProjectNotFoundException if not found', async () => {
      mockProjectRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(ProjectNotFoundException);
    });
  });

  // ── findByIdAndOwner ──────────────────────────────────────────────────────
  describe('findByIdAndOwner', () => {
    it('should return project if user is the owner', async () => {
      mockProjectRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.findByIdAndOwner('proj-001', 'user-001');

      expect(result.id).toBe('proj-001');
    });

    it('should throw ProjectOwnershipException if user is not the owner', async () => {
      mockProjectRepository.findOne.mockResolvedValue(mockProject);

      await expect(
        service.findByIdAndOwner('proj-001', 'other-user'),
      ).rejects.toThrow(ProjectOwnershipException);
    });
  });

  // ── update ────────────────────────────────────────────────────────────────
  describe('update', () => {
    it('should update and return the project', async () => {
      const updated = { ...mockProject, name: 'Updated Name' };
      mockProjectRepository.findOne.mockResolvedValue(mockProject);
      mockProjectRepository.save.mockResolvedValue(updated);

      const result = await service.update('proj-001', { name: 'Updated Name' }, 'user-001');

      expect(result.name).toBe('Updated Name');
    });
  });

  // ── remove ────────────────────────────────────────────────────────────────
  describe('remove', () => {
    it('should remove the project', async () => {
      mockProjectRepository.findOne.mockResolvedValue(mockProject);
      mockProjectRepository.remove.mockResolvedValue(undefined);

      await expect(service.remove('proj-001', 'user-001')).resolves.not.toThrow();
      expect(mockProjectRepository.remove).toHaveBeenCalledWith(mockProject);
    });
  });
});
