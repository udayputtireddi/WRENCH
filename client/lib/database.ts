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
  progressSaves: TaskProgress[];
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  completedDate: Date;
  notes?: string;
  timeSpentMinutes?: number;
  photos?: string[]; // Base64 encoded images
  checklistItems: { id: string; text: string; completed: boolean }[];
}

export interface TaskProgress {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  savedDate: Date;
  checklistItems: { id: string; text: string; completed: boolean }[];
  notes?: string;
  photos?: string[];
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
        // Daily task: Add 1 day
        // Completed Monday 8/4 → Next due Tuesday 8/5
        next.setDate(next.getDate() + 1);
        break;
        
      case 'weekly':
        // Weekly task: Add exactly 7 days
        // Completed Monday 8/4 → Next due Monday 8/11
        // Completed Monday 8/11 → Next due Monday 8/18
        next.setDate(next.getDate() + 7);
        break;
        
      case 'monthly':
        // Monthly task: Add 1 month
        next.setMonth(next.getMonth() + 1);
        break;
    }
    
    return next;
  }

  static completeTask(
    taskId: string, 
    userId: string, 
    userName: string, 
    checklistItems: { id: string; text: string; completed: boolean }[],
    notes?: string,
    photos?: string[]
  ): boolean {
    const task = taskDatabase.find(t => t.id === taskId);
    if (!task) return false;

    const completion: TaskCompletion = {
      id: `completion-${Date.now()}`,
      taskId,
      userId,
      userName,
      completedDate: new Date(),
      notes,
      photos: photos || [],
      checklistItems
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

  static saveTaskProgress(
    taskId: string,
    userId: string,
    userName: string,
    checklistItems: { id: string; text: string; completed: boolean }[],
    notes?: string,
    photos?: string[]
  ): boolean {
    const task = taskDatabase.find(t => t.id === taskId);
    if (!task) return false;

    const progress: TaskProgress = {
      id: `progress-${Date.now()}`,
      taskId,
      userId,
      userName,
      savedDate: new Date(),
      checklistItems,
      notes,
      photos: photos || []
    };

    // Initialize progressSaves if it doesn't exist (for backward compatibility)
    if (!task.progressSaves) {
      task.progressSaves = [];
    }

    // Remove any previous progress saves for this task by this user
    task.progressSaves = task.progressSaves.filter(p => !(p.taskId === taskId && p.userId === userId));
    task.progressSaves.push(progress);

    return true;
  }

  static getTaskProgress(taskId: string, userId: string): TaskProgress | null {
    const task = taskDatabase.find(t => t.id === taskId);
    if (!task) return null;

    // Initialize progressSaves if it doesn't exist (for backward compatibility)
    if (!task.progressSaves) {
      task.progressSaves = [];
    }

    return task.progressSaves.find(p => p.taskId === taskId && p.userId === userId) || null;
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
      completionHistory: [],
      progressSaves: []
    }));
  }

  static exportTasksToCSV(tasks: Task[]): string {
    const headers = [
      'Machine ID', 'Machine Name', 'Task Name', 'Description', 'Frequency',
      'Category', 'Estimated Time (min)', 'Weekly Day', 'Safety Notes', 'Required Tools',
      'Status', 'Next Due Date', 'Last Completed', 'Completion Count', 'Last Completed By'
    ];

    const rows = tasks.map(task => {
      const lastCompletion = task.completionHistory[task.completionHistory.length - 1];
      return [
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
        task.lastCompletedDate?.toLocaleDateString() || 'Never',
        task.completionHistory.length.toString(),
        lastCompletion?.userName || 'N/A'
      ];
    });

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
    // Ensure task has required properties initialized
    const initializedTask = {
      ...task,
      completionHistory: task.completionHistory || [],
      progressSaves: task.progressSaves || []
    };
    taskDatabase.push(initializedTask);
  }

  static addTasks(tasks: Task[]): void {
    // Ensure all tasks have required properties initialized
    const initializedTasks = tasks.map(task => ({
      ...task,
      completionHistory: task.completionHistory || [],
      progressSaves: task.progressSaves || []
    }));
    taskDatabase.push(...initializedTasks);
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completedToday = tasks.filter(t => 
      t.lastCompletedDate && 
      t.lastCompletedDate >= today
    ).length;

    const overdueTasks = tasks.filter(t => t.nextDueDate < new Date()).length;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const upcomingTasks = tasks.filter(t => {
      const dueDate = new Date(t.nextDueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === tomorrow.getTime();
    }).length;
    
    return {
      totalTasks: tasks.length,
      totalMachines: machines.length,
      completedToday,
      overdueTasks,
      upcomingTasks,
      totalCompletions: tasks.reduce((sum, task) => sum + task.completionHistory.length, 0),
      averageTaskTime: this.getAverageTaskTime(),
      mostActiveUser: this.getMostActiveUser(),
      machineEfficiency: this.getMachineEfficiency()
    };
  }

  static getAverageTaskTime(): number {
    const allCompletions = taskDatabase.flatMap(task => task.completionHistory);
    if (allCompletions.length === 0) return 0;
    
    const totalTime = allCompletions.reduce((sum, completion) => {
      return sum + (completion.timeSpentMinutes || 0);
    }, 0);
    
    return Math.round(totalTime / allCompletions.length);
  }

  static getMostActiveUser(): { name: string; completions: number } {
    const userCompletions = new Map<string, number>();
    
    taskDatabase.forEach(task => {
      task.completionHistory.forEach(completion => {
        const current = userCompletions.get(completion.userName) || 0;
        userCompletions.set(completion.userName, current + 1);
      });
    });

    let mostActive = { name: 'N/A', completions: 0 };
    userCompletions.forEach((completions, userName) => {
      if (completions > mostActive.completions) {
        mostActive = { name: userName, completions };
      }
    });

    return mostActive;
  }

  static getMachineEfficiency(): { [machineId: string]: number } {
    const efficiency: { [machineId: string]: number } = {};
    
    this.getMachines().forEach(machine => {
      const totalTasks = machine.tasks.length;
      const onTimeTasks = machine.tasks.filter(task => 
        task.lastCompletedDate && task.nextDueDate > new Date()
      ).length;
      
      efficiency[machine.id] = totalTasks > 0 ? Math.round((onTimeTasks / totalTasks) * 100) : 0;
    });

    return efficiency;
  }

  // Get filtered tasks based on completion status
  static getTasksByStatus(status: 'completed' | 'pending' | 'overdue'): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return taskDatabase.filter(task => {
      switch (status) {
        case 'completed':
          return task.lastCompletedDate && task.lastCompletedDate >= today;
        case 'overdue':
          return task.nextDueDate < new Date();
        case 'pending':
          return !task.lastCompletedDate || task.lastCompletedDate < today;
        default:
          return true;
      }
    });
  }
}

export default Database;
