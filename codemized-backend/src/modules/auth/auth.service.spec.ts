import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import {
  EmailAlreadyExistsException,
  InvalidCredentialsException,
} from '../../common/exceptions/business.exceptions';

const mockUser: User = {
  id: 'uuid-001',
  name: 'Carlos Admin',
  email: 'admin@test.com',
  passwordHash: 'hashed_password',
  projects: Promise.resolve([]),
  assignedTasks: Promise.resolve([]),
  comments: Promise.resolve([]),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserRepository = {
  findOne: jest.fn(),
  create:  jest.fn(),
  save:    jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock_jwt_token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService,              useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // ── register ──────────────────────────────────────────────────────────────
  describe('register', () => {
    it('should register a new user and return accessToken + user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.register({
        name: 'Carlos Admin',
        email: 'admin@test.com',
        password: 'password123',
      });

      expect(result.accessToken).toBe('mock_jwt_token');
      expect(result.user.email).toBe(mockUser.email);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw EmailAlreadyExistsException if email is taken', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({ name: 'X', email: 'admin@test.com', password: '123456' }),
      ).rejects.toThrow(EmailAlreadyExistsException);
    });
  });

  // ── login ─────────────────────────────────────────────────────────────────
  describe('login', () => {
    it('should login and return accessToken + user', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login({
        email: 'admin@test.com',
        password: 'password',
      });

      expect(result.accessToken).toBe('mock_jwt_token');
      expect(result.user.id).toBe(mockUser.id);
    });

    it('should throw InvalidCredentialsException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@test.com', password: 'password' }),
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('should throw InvalidCredentialsException if password is wrong', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.login({ email: 'admin@test.com', password: 'wrong' }),
      ).rejects.toThrow(InvalidCredentialsException);
    });
  });
});
