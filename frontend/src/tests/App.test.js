// Simple utility function tests
const validateTask = (task) => {
  if (!task) return false;
  if (!task.title) return false;
  if (task.title.trim() === '') return false;
  return true;
};

const formatTaskCount = (count) => {
  if (count === 0) return 'No tasks';
  if (count === 1) return '1 task';
  return `${count} tasks`;
};

describe('Task Tracker Utils', () => {
  it('validateTask accepts valid task', () => {
    const validTask = { title: 'Buy milk', completed: false };
    expect(validateTask(validTask)).toBe(true);
  });

  it('validateTask rejects empty title', () => {
    const invalidTask = { title: '', completed: false };
    expect(validateTask(invalidTask)).toBe(false);
  });

  it('formatTaskCount handles different counts', () => {
    expect(formatTaskCount(0)).toBe('No tasks');
    expect(formatTaskCount(1)).toBe('1 task');
    expect(formatTaskCount(5)).toBe('5 tasks');
  });
});
