-- USERS
INSERT INTO "users" (id, name, email, password_hash, created_at, updated_at) VALUES
(gen_random_uuid(), 'Carlos Admin', 'admin@projectflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(gen_random_uuid(), 'Ana García', 'ana@projectflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(gen_random_uuid(), 'Luis Martínez', 'luis@projectflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(gen_random_uuid(), 'Sofía López', 'sofia@projectflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW());

-- PROJECTS
INSERT INTO "projects" (id, name, description, creator_id, created_at, updated_at) VALUES
(gen_random_uuid(), 'ProjectFlow App', 'Plataforma de gestión de proyectos y tareas', (SELECT id FROM users WHERE email = 'admin@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'E-Commerce Redesign', 'Rediseño completo del sitio de e-commerce', (SELECT id FROM users WHERE email = 'ana@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Mobile App MVP', 'MVP de la app móvil para iOS y Android', (SELECT id FROM users WHERE email = 'admin@projectflow.com'), NOW(), NOW());

-- TASKS
INSERT INTO "tasks" (id, title, description, status, priority, project_id, assignee_id, created_at, updated_at) VALUES
(gen_random_uuid(), 'Setup NestJS backend', 'Configurar estructura base del backend', 'DONE', 'HIGH', (SELECT id FROM projects WHERE name = 'ProjectFlow App'), (SELECT id FROM users WHERE email = 'admin@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Diseñar base de datos', 'Modelar entidades y relaciones en PostgreSQL', 'DONE', 'HIGH', (SELECT id FROM projects WHERE name = 'ProjectFlow App'), (SELECT id FROM users WHERE email = 'ana@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Implementar autenticación JWT', 'Login, registro y guards con Passport', 'IN_PROGRESS', 'HIGH', (SELECT id FROM projects WHERE name = 'ProjectFlow App'), (SELECT id FROM users WHERE email = 'admin@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Crear endpoints de proyectos', 'CRUD completo para proyectos', 'IN_REVIEW', 'MEDIUM', (SELECT id FROM projects WHERE name = 'ProjectFlow App'), (SELECT id FROM users WHERE email = 'luis@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Documentar API con Swagger', 'Agregar decoradores a todos los endpoints', 'TODO', 'LOW', (SELECT id FROM projects WHERE name = 'ProjectFlow App'), (SELECT id FROM users WHERE email = 'sofia@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Wireframes homepage', 'Diseñar wireframes de la página principal', 'DONE', 'HIGH', (SELECT id FROM projects WHERE name = 'E-Commerce Redesign'), (SELECT id FROM users WHERE email = 'ana@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Integrar pasarela de pagos', 'Integración con Stripe', 'IN_PROGRESS', 'HIGH', (SELECT id FROM projects WHERE name = 'E-Commerce Redesign'), (SELECT id FROM users WHERE email = 'luis@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Optimizar imágenes de productos', 'Comprimir y servir imágenes con CDN', 'TODO', 'MEDIUM', (SELECT id FROM projects WHERE name = 'E-Commerce Redesign'), NULL, NOW(), NOW()),
(gen_random_uuid(), 'Setup React Native', 'Configurar proyecto base con Expo', 'IN_PROGRESS', 'HIGH', (SELECT id FROM projects WHERE name = 'Mobile App MVP'), (SELECT id FROM users WHERE email = 'sofia@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Pantalla de login', 'UI y lógica de autenticación en la app', 'TODO', 'HIGH', (SELECT id FROM projects WHERE name = 'Mobile App MVP'), (SELECT id FROM users WHERE email = 'sofia@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Push notifications', 'Configurar notificaciones con Firebase', 'TODO', 'MEDIUM', (SELECT id FROM projects WHERE name = 'Mobile App MVP'), NULL, NOW(), NOW());

-- COMMENTS
INSERT INTO "comments" (id, content, task_id, author_id, created_at, updated_at) VALUES
(gen_random_uuid(), 'Backend configurado y corriendo en local. Tests básicos pasando.', (SELECT id FROM tasks WHERE title = 'Setup NestJS backend'), (SELECT id FROM users WHERE email = 'admin@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Revisé el esquema, todo bien. Aprobado para merge.', (SELECT id FROM tasks WHERE title = 'Diseñar base de datos'), (SELECT id FROM users WHERE email = 'ana@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Trabajando en el JWT strategy, casi listo.', (SELECT id FROM tasks WHERE title = 'Implementar autenticación JWT'), (SELECT id FROM users WHERE email = 'admin@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Necesito feedback del equipo antes de hacer merge.', (SELECT id FROM tasks WHERE title = 'Crear endpoints de proyectos'), (SELECT id FROM users WHERE email = 'luis@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Stripe sandbox funcionando, falta el webhook.', (SELECT id FROM tasks WHERE title = 'Integrar pasarela de pagos'), (SELECT id FROM users WHERE email = 'luis@projectflow.com'), NOW(), NOW()),
(gen_random_uuid(), 'Expo configurado con TypeScript y navegación base.', (SELECT id FROM tasks WHERE title = 'Setup React Native'), (SELECT id FROM users WHERE email = 'sofia@projectflow.com'), NOW(), NOW());
