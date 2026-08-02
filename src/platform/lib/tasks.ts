import { AgentTask } from '../types';

export const isTaskOverdue = (task: AgentTask): boolean => {
  if (task.status === 'Completed') return false;
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  // Ensure we compare based on date only if dueDate is YYYY-MM-DD
  return dueDate < now;
};
