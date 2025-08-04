// Database schema and task scheduling system
export interface DatabaseTask {
  id: string;
  machineId: string;
  machineName: string;
  taskName: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  category: 'maintenance' | 'inspection' | 'cleaning' | 'safety';
  estimatedTimeMinutes: number;
  requiredTools?: string[];
  safetyNotes?: string[];
  
  // Scheduling fields
  isActive: boolean;
  createdDate: Date;
  lastCompletedDate?: Date;
  lastCompletedBy?: string;
  nextDueDate: Date;
  
  // Weekly task specific
  weeklyDay?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  
  // Monthly task specific  
  monthlyDate?: number; // Day of month (1-31)
  
  // Completion tracking
  completionHistory: TaskCompletion[];
}

export interface TaskCompletion {
  id: string;
  completedDate: Date;
  completedBy: string;
  completedByRole: string;
  shift?: 'morning' | 'afternoon' | 'night';
  notes?: string;
  timeSpentMinutes?: number;
  issuesFound?: string[];
  correctiveActions?: string[];
}

export interface ExcelTaskData {
  machineId: string;
  machineName: string;
  taskName: string;
  description?: string;
  frequency: string;
  category?: string;
  estimatedTime?: number;
  weeklyDay?: string;
  monthlyDate?: number;
}

// Task scheduling logic
export class TaskScheduler {
  /**
   * Calculate next due date based on frequency and last completion
   */
  static calculateNextDueDate(
    frequency: string, 
    lastCompletedDate: Date | null, 
    weeklyDay?: string,
    monthlyDate?: number
  ): Date {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (!lastCompletedDate) {
      // First time task - due today
      return today;
    }

    const lastCompleted = new Date(lastCompletedDate.getFullYear(), lastCompletedDate.getMonth(), lastCompletedDate.getDate());
    
    switch (frequency.toLowerCase()) {
      case 'daily':
        // Daily tasks: if completed today, next due is tomorrow
        const nextDay = new Date(lastCompleted);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
        
      case 'weekly':
        // Weekly tasks: if completed today, next due is same day next week
        const nextWeek = new Date(lastCompleted);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek;
        
      case 'monthly':
        // Monthly tasks: next due is same date next month
        const nextMonth = new Date(lastCompleted);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        if (monthlyDate) {
          nextMonth.setDate(monthlyDate);
        }
        return nextMonth;
        
      case 'quarterly':
        // Quarterly tasks: next due is 3 months later
        const nextQuarter = new Date(lastCompleted);
        nextQuarter.setMonth(nextQuarter.getMonth() + 3);
        return nextQuarter;
        
      case 'annually':
        // Annual tasks: next due is same date next year
        const nextYear = new Date(lastCompleted);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return nextYear;
        
      default:
        // Default to daily if frequency is unknown
        const defaultNext = new Date(lastCompleted);
        defaultNext.setDate(defaultNext.getDate() + 1);
        return defaultNext;
    }
  }

  /**
   * Check if a task is due today
   */
  static isTaskDueToday(task: DatabaseTask): boolean {
    const today = new Date();
    const todayStr = today.toDateString();
    const dueDateStr = task.nextDueDate.toDateString();
    
    return todayStr === dueDateStr;
  }

  /**
   * Check if a task is overdue
   */
  static isTaskOverdue(task: DatabaseTask): boolean {
    const today = new Date();
    return task.nextDueDate < today;
  }

  /**
   * Get tasks that should be displayed today
   */
  static getTasksForToday(allTasks: DatabaseTask[]): {
    due: DatabaseTask[];
    overdue: DatabaseTask[];
    upcoming: DatabaseTask[];
  } {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const due: DatabaseTask[] = [];
    const overdue: DatabaseTask[] = [];
    const upcoming: DatabaseTask[] = [];
    
    allTasks.forEach(task => {
      if (!task.isActive) return;
      
      if (this.isTaskOverdue(task)) {
        overdue.push(task);
      } else if (this.isTaskDueToday(task)) {
        due.push(task);
      } else if (task.nextDueDate <= tomorrow) {
        upcoming.push(task);
      }
    });
    
    return { due, overdue, upcoming };
  }

  /**
   * Complete a task and update next due date
   */
  static completeTask(
    task: DatabaseTask, 
    completedBy: string, 
    completedByRole: string,
    shift?: string,
    notes?: string,
    timeSpentMinutes?: number,
    issuesFound?: string[],
    correctiveActions?: string[]
  ): DatabaseTask {
    const now = new Date();
    
    // Create completion record
    const completion: TaskCompletion = {
      id: `completion-${Date.now()}`,
      completedDate: now,
      completedBy,
      completedByRole,
      shift: shift as any,
      notes,
      timeSpentMinutes,
      issuesFound,
      correctiveActions
    };
    
    // Update task
    const updatedTask: DatabaseTask = {
      ...task,
      lastCompletedDate: now,
      lastCompletedBy: completedBy,
      nextDueDate: this.calculateNextDueDate(
        task.frequency, 
        now, 
        task.weeklyDay, 
        task.monthlyDate
      ),
      completionHistory: [...task.completionHistory, completion]
    };
    
    return updatedTask;
  }
}

// Excel parsing utilities
export class ExcelParser {
  /**
   * Parse Excel data and convert to database tasks
   */
  static parseExcelToTasks(excelData: ExcelTaskData[]): DatabaseTask[] {
    return excelData.map((row, index) => {
      const now = new Date();
      
      // Determine weekly day if it's a weekly task
      let weeklyDay: any = undefined;
      if (row.frequency.toLowerCase() === 'weekly' && row.weeklyDay) {
        weeklyDay = row.weeklyDay.toLowerCase();
      }
      
      const task: DatabaseTask = {
        id: `task-${row.machineId}-${index}`,
        machineId: row.machineId,
        machineName: row.machineName,
        taskName: row.taskName,
        description: row.description || '',
        frequency: this.normalizeFrequency(row.frequency),
        category: this.normalizeCategory(row.category),
        estimatedTimeMinutes: row.estimatedTime || 30,
        requiredTools: [],
        safetyNotes: [],
        isActive: true,
        createdDate: now,
        nextDueDate: TaskScheduler.calculateNextDueDate(row.frequency, null),
        weeklyDay,
        monthlyDate: row.monthlyDate,
        completionHistory: []
      };
      
      return task;
    });
  }
  
  private static normalizeFrequency(frequency: string): 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' {
    const freq = frequency.toLowerCase().trim();
    if (freq.includes('daily')) return 'daily';
    if (freq.includes('weekly')) return 'weekly';
    if (freq.includes('monthly')) return 'monthly';
    if (freq.includes('quarterly')) return 'quarterly';
    if (freq.includes('annual')) return 'annually';
    return 'daily'; // default
  }
  
  private static normalizeCategory(category?: string): 'maintenance' | 'inspection' | 'cleaning' | 'safety' {
    if (!category) return 'maintenance';
    const cat = category.toLowerCase().trim();
    if (cat.includes('inspect')) return 'inspection';
    if (cat.includes('clean')) return 'cleaning';
    if (cat.includes('safety')) return 'safety';
    return 'maintenance';
  }
}

// Sample data based on your Trumpf 5000 Punch sheet
export const sampleTrumpfTasks: ExcelTaskData[] = [
  // Daily tasks
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Visual Inspection of Turret, Tables, Make sure rails are clear',
    frequency: 'daily',
    category: 'inspection',
    estimatedTime: 10
  },
  {
    machineId: 'TRUMPF-5000-001', 
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Chip Vacuum System: Clean Chip Flag, replace seal if needed',
    frequency: 'daily',
    category: 'cleaning',
    estimatedTime: 15
  },
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch', 
    taskName: 'Visual inspection of chip conveyor belt and guarding condition',
    frequency: 'daily',
    category: 'inspection',
    estimatedTime: 10
  },
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Inspect Tooling During Setup for proper clearance, setup and alignment',
    frequency: 'daily',
    category: 'inspection', 
    estimatedTime: 20
  },
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Clean Punching Tool holder and check stripper segment',
    frequency: 'daily',
    category: 'cleaning',
    estimatedTime: 15
  },
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Wipe Glass Sheet Master Section Cups and replace as needed',
    frequency: 'daily',
    category: 'cleaning',
    estimatedTime: 10
  },
  
  // Weekly tasks
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Clean strainer and filter on Chip Vacuum System - Suction Tube',
    frequency: 'weekly',
    weeklyDay: 'monday',
    category: 'cleaning',
    estimatedTime: 30
  },
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch', 
    taskName: 'Inspect Punching Fluid Reservoir fill as needed',
    frequency: 'weekly',
    weeklyDay: 'tuesday',
    category: 'maintenance',
    estimatedTime: 20
  },
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Inspect Tapping Fluid Reservoir fill as needed',
    frequency: 'weekly', 
    weeklyDay: 'wednesday',
    category: 'maintenance',
    estimatedTime: 20
  },
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Clean the index pin',
    frequency: 'weekly',
    weeklyDay: 'thursday',
    category: 'cleaning',
    estimatedTime: 15
  },
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Clean sensor and deflector for stripper detection',
    frequency: 'weekly',
    weeklyDay: 'friday',
    category: 'cleaning', 
    estimatedTime: 15
  },
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Clean Tool Cartridge Rail',
    frequency: 'weekly',
    weeklyDay: 'friday',
    category: 'cleaning',
    estimatedTime: 20
  },
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Wipe Excess Oil From Slides',
    frequency: 'weekly',
    weeklyDay: 'friday',
    category: 'cleaning',
    estimatedTime: 15
  },
  {
    machineId: 'TRUMPF-5000-001',
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Wipe Machine Down',
    frequency: 'weekly',
    weeklyDay: 'friday',
    category: 'cleaning',
    estimatedTime: 25
  },
  {
    machineId: 'TRUMPF-5000-001', 
    machineName: 'Trumpf 5000 Punch',
    taskName: 'Sharpen Any Dull Tooling',
    frequency: 'weekly',
    weeklyDay: 'friday',
    category: 'maintenance',
    estimatedTime: 45
  }
];
