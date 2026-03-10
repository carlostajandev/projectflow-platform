import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CommentsModule } from './modules/comments/comments.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // ── Config ──────────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // ── Database ────────────────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // ── Rate Limiting ────────────────────────────────────────────────────────
    // Global throttle applied to all routes via APP_GUARD below.
    // Auth endpoints override these limits with stricter values.
    ThrottlerModule.forRoot([
      {
        name:  'short',
        ttl:   1000,   // 1 second window
        limit: 20,     // max 20 requests per second globally
      },
      {
        name:  'long',
        ttl:   60000,  // 1 minute window
        limit: 200,    // max 200 requests per minute globally
      },
    ]),

    // ── Feature Modules ──────────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
    HealthModule,
  ],
  providers: [
    // Apply rate limiting globally to every route
    {
      provide:  APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}