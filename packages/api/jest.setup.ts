// Configuración global de Jest para ES modules
jest.setTimeout(30000);

// Configurar variables de entorno para tests
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/appdb?schema=public";

// Suprimir logs durante los tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
