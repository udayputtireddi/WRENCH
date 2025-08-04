// Task management database system
export interface Task {
  id: string;
  machineId: string;
  machineName: string;
  taskName: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: 'maintenance' | 'inspection' | 'cleaning';
  estimatedTimeMinutes: number;
  weeklyDay?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  safetyNotes: string[];
  requiredTools: string[];
  isActive: boolean;
  createdDate: Date;
  nextDueDate: Date;
  lastCompletedDate?: Date;
  completionHistory: TaskCompletion[];
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  completedDate: Date;
  notes?: string;
  timeSpentMinutes?: number;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'operational' | 'maintenance' | 'offline';
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  tasks: Task[];
}

// Task scheduler for intelligent frequency-based scheduling
export class TaskScheduler {
  static calculateNextDueDate(
    frequency: Task['frequency'],
    lastCompleted: Date,
    weeklyDay?: Task['weeklyDay']
  ): Date {
    const next = new Date(lastCompleted);
    
    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        if (weeklyDay) {
          const dayMap = {
            monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5
          };
          const targetDay = dayMap[weeklyDay];
          const currentDay = next.getDay();
          const daysUntilNext = (7 + targetDay - currentDay) % 7 || 7;
          next.setDate(next.getDate() + daysUntilNext);
        } else {
          next.setDate(next.getDate() + 7);
        }
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
    }
    
    return next;
  }

  static completeTask(taskId: string, userId: string, userName: string, notes?: string): boolean {
    const task = taskDatabase.find(t => t.id === taskId);
    if (!task) return false;

    const completion: TaskCompletion = {
      id: `completion-${Date.now()}`,
      taskId,
      userId,
      userName,
      completedDate: new Date(),
      notes
    };

    task.completionHistory.push(completion);
    task.lastCompletedDate = completion.completedDate;
    task.nextDueDate = this.calculateNextDueDate(
      task.frequency,
      completion.completedDate,
      task.weeklyDay
    );

    return true;
  }
}

// Excel parsing utilities
export class ExcelParser {
  static parseExcelToTasks(excelData: any[]): Task[] {
    return excelData.map((row, index) => ({
      id: `task-${Date.now()}-${index}`,
      machineId: row['Machine ID'] || '',
      machineName: row['Machine Name'] || '',
      taskName: row['Task Name'] || '',
      description: row['Description'] || '',
      frequency: (row['Frequency'] || 'weekly').toLowerCase() as Task['frequency'],
      category: (row['Category'] || 'maintenance').toLowerCase() as Task['category'],
      estimatedTimeMinutes: parseInt(row['Estimated Time (min)']) || 30,
      weeklyDay: row['Weekly Day']?.toLowerCase() as Task['weeklyDay'],
      safetyNotes: row['Safety Notes'] ? [row['Safety Notes']] : [],
      requiredTools: row['Required Tools'] ? [row['Required Tools']] : [],
      isActive: true,
      createdDate: new Date(),
      nextDueDate: new Date(), // Will be calculated based on frequency
      completionHistory: []
    }));
  }

  static exportTasksToCSV(tasks: Task[]): string {
    const headers = [
      'Machine ID', 'Machine Name', 'Task Name', 'Description', 'Frequency',
      'Category', 'Estimated Time (min)', 'Weekly Day', 'Safety Notes', 'Required Tools',
      'Status', 'Next Due Date', 'Last Completed'
    ];

    const rows = tasks.map(task => [
      task.machineId,
      task.machineName,
      task.taskName,
      task.description,
      task.frequency,
      task.category,
      task.estimatedTimeMinutes.toString(),
      task.weeklyDay || '',
      task.safetyNotes.join('; '),
      task.requiredTools.join('; '),
      task.isActive ? 'Active' : 'Inactive',
      task.nextDueDate.toLocaleDateString(),
      task.lastCompletedDate?.toLocaleDateString() || 'Never'
    ]);

    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
  }
}

// In-memory database - starts empty, will be populated via Excel uploads
export const taskDatabase: Task[] = [];
export const machineDatabase: Machine[] = [];

// Database operations
export class Database {
  static addTask(task: Task): void {
    taskDatabase.push(task);
  }

  static addTasks(tasks: Task[]): void {
    taskDatabase.push(...tasks);
  }

  static getTasks(): Task[] {
    return taskDatabase;
  }

  static getTaskById(id: string): Task | undefined {
    return taskDatabase.find(t => t.id === id);
  }

  static getTasksByMachine(machineId: string): Task[] {
    return taskDatabase.filter(t => t.machineId === machineId);
  }

  static getMachines(): Machine[] {
    // Generate machines from tasks
    const machineMap = new Map<string, Machine>();
    
    taskDatabase.forEach(task => {
      if (!machineMap.has(task.machineId)) {
        machineMap.set(task.machineId, {
          id: task.machineId,
          name: task.machineName,
          type: 'Industrial Equipment',
          location: 'Production Floor',
          status: 'operational' as const,
          tasks: []
        });
      }
      machineMap.get(task.machineId)!.tasks.push(task);
    });

    return Array.from(machineMap.values());
  }

  static getMachineById(id: string): Machine | undefined {
    return this.getMachines().find(m => m.id === id);
  }

  static clearDatabase(): void {
    taskDatabase.length = 0;
    machineDatabase.length = 0;
  }

  static getAnalytics() {
    const tasks = this.getTasks();
    const machines = this.getMachines();
    
    return {
      totalTasks: tasks.length,
      totalMachines: machines.length,
      completedToday: tasks.filter(t => 
        t.lastCompletedDate && 
        t.lastCompletedDate.toDateString() === new Date().toDateString()
      ).length,
      overdueTasks: tasks.filter(t => t.nextDueDate < new Date()).length,
      upcomingTasks: tasks.filter(t => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return t.nextDueDate.toDateString() === tomorrow.toDateString();
      }).length
    };
  }
}

export default Database;
