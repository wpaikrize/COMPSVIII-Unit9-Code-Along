const httpMocks = require('node-mocks-http');
const { EventEmitter } = require('events');
const app = require('../app');

const invokeRequest = (method, url, body) => {
  return new Promise((resolve, reject) => {
    const req = httpMocks.createRequest({ method, url, body });
    const res = httpMocks.createResponse({ eventEmitter: EventEmitter });

    res.on('end', () => resolve(res));
    res.on('finish', () => resolve(res));
    res.on('error', reject);

    app.handle(req, res);
  });
};

beforeEach(() => {
  if (typeof app.resetTasks === 'function') {
    app.resetTasks();
  }
});

test('GET /api/tasks returns all tasks', async () => {
  const response = await invokeRequest('GET', '/api/tasks');
  const tasks = response._getJSONData();

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(tasks)).toBe(true);
  expect(tasks.length).toBeGreaterThan(0);
});

test('POST /api/tasks creates new task', async () => {
  const response = await invokeRequest('POST', '/api/tasks', { title: 'Test task' });
  const task = response._getJSONData();

  expect(response.statusCode).toBe(201);
  expect(task.title).toBe('Test task');
  expect(task.completed).toBe(false);
});

test('POST /api/tasks accepts any title', async () => {
  const response = await invokeRequest('POST', '/api/tasks', { title: '' });
  expect(response.statusCode).toBe(201);
});
