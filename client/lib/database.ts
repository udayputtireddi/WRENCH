// Task management database system with Supabase
import { supabase } from "./supabase";
import {
  TaskCompletionTracker,
  type TaskCompletionData,
} from "./taskCompletionTracking";

export interface Task {
  id: string;
  machineId: string;
  machineName: string;
  taskName: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  category: "maintenance" | "inspection" | "cleaning";
  estimatedTimeMinutes: number;
  weeklyDay?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
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
  status: "operational" | "maintenance" | "offline";
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  tasks: Task[];
}

// Task scheduler for intelligent frequency-based scheduling
export class TaskScheduler {
  static calculateNextDueDate(
    frequency: Task["frequency"],
    lastCompleted: Date,
    weeklyDay?: Task["weeklyDay"],
  ): Date {
    const next = new Date(lastCompleted);

    switch (frequency) {
      case "daily":
        next.setDate(next.getDate() + 1);
        break;
      case "weekly":
        next.setDate(next.getDate() + 7);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        break;
    }

    return next;
  }

  static async completeTask(
    taskId: string,
    userId: string,
    userName: string,
    checklistItems: { id: string; text: string; completed: boolean }[],
    notes?: string,
    photos?: string[],
    customCompletionDate?: Date,
    timeSpentMinutes?: number,
  ): Promise<boolean> {
    try {
      const completionDate = customCompletionDate || new Date();

      // Insert completion record
      const { data: completion, error: completionError } = await supabase
        .from("task_completions")
        .insert([
          {
            task_id: taskId,
            user_id: userId,
            user_name: userName,
            completed_date: completionDate.toISOString(),
            notes,
            time_spent_minutes: timeSpentMinutes,
            photos: photos || [],
            checklist_items: checklistItems,
          },
        ])
        .select()
        .single();

      if (completionError) {
        console.error("Error saving completion:", completionError);
        return false;
      }

      // Update task with new due date and last completed date
      const nextDueDate = this.calculateNextDueDate(
        await this.getTaskFrequency(taskId),
        completionDate,
      );

      const { error: updateError } = await supabase
        .from("tasks")
        .update({
          last_completed_date: completionDate.toISOString(),
          next_due_date: nextDueDate.toISOString(),
        })
        .eq("id", taskId);

      if (updateError) {
        console.error("Error updating task:", updateError);
        return false;
      }

      // Get task details for tracking
      const { data: task } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .single();

      if (task) {
        // Save to comprehensive tracking system
        TaskCompletionTracker.saveTaskCompletion({
          taskId,
          taskName: task.task_name,
          machineId: task.machine_id,
          machineName: task.machine_name,
          frequency: task.frequency,
          completedBy: userName,
          completedDate: completionDate,
          timeSpentMinutes: timeSpentMinutes || 0,
          notes: notes || "",
          photos: photos || [],
          checklistItems,
        });
      }

      // Clear any saved progress for this task/user
      await supabase
        .from("task_progress")
        .delete()
        .eq("task_id", taskId)
        .eq("user_id", userId);

      return true;
    } catch (error) {
      console.error("Error completing task:", error);
      return false;
    }
  }

  static async saveTaskProgress(
    taskId: string,
    userId: string,
    userName: string,
    checklistItems: { id: string; text: string; completed: boolean }[],
    notes?: string,
    photos?: string[],
  ): Promise<boolean> {
    try {
      // Upsert progress (update if exists, insert if not)
      const { error } = await supabase.from("task_progress").upsert(
        [
          {
            task_id: taskId,
            user_id: userId,
            user_name: userName,
            saved_date: new Date().toISOString(),
            checklist_items: checklistItems,
            notes,
            photos: photos || [],
          },
        ],
        {
          onConflict: "task_id,user_id",
        },
      );

      if (error) {
        console.error("Error saving progress:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error saving task progress:", error);
      return false;
    }
  }

  static async getTaskProgress(
    taskId: string,
    userId: string,
  ): Promise<TaskProgress | null> {
    try {
      const { data: progress, error } = await supabase
        .from("task_progress")
        .select("*")
        .eq("task_id", taskId)
        .eq("user_id", userId)
        .single();

      if (error || !progress) {
        return null;
      }

      return {
        id: progress.id,
        taskId: progress.task_id,
        userId: progress.user_id,
        userName: progress.user_name,
        savedDate: new Date(progress.saved_date),
        checklistItems: progress.checklist_items,
        notes: progress.notes,
        photos: progress.photos,
      };
    } catch (error) {
      console.error("Error getting task progress:", error);
      return null;
    }
  }

  private static async getTaskFrequency(
    taskId: string,
  ): Promise<Task["frequency"]> {
    const { data: task } = await supabase
      .from("tasks")
      .select("frequency")
      .eq("id", taskId)
      .single();

    return task?.frequency || "weekly";
  }
}

// Excel parsing utilities
export class ExcelParser {
  static parseExcelToTasks(excelData: any[]): Task[] {
    return excelData.map((row, index) => ({
      id: `task-${Date.now()}-${index}`,
      machineId: row["Machine ID"] || "",
      machineName: row["Machine Name"] || "",
      taskName: row["Task Name"] || "",
      description: row["Description"] || "",
      frequency: (
        row["Frequency"] || "weekly"
      ).toLowerCase() as Task["frequency"],
      category: (
        row["Category"] || "maintenance"
      ).toLowerCase() as Task["category"],
      estimatedTimeMinutes: parseInt(row["Estimated Time (min)"]) || 30,
      weeklyDay: row["Weekly Day"]?.toLowerCase() as Task["weeklyDay"],
      safetyNotes: row["Safety Notes"] ? [row["Safety Notes"]] : [],
      requiredTools: row["Required Tools"] ? [row["Required Tools"]] : [],
      isActive: true,
      createdDate: new Date(),
      nextDueDate: new Date(), // Will be calculated based on frequency
      completionHistory: [],
      progressSaves: [],
    }));
  }

  static exportTasksToCSV(tasks: Task[]): string {
    const headers = [
      "Task Name",
      "Machine Name",
      "Machine ID",
      "Frequency",
      "Date",
      "Completed By",
      "Time Taken (min)",
      "Notes",
      "Photos Count",
      "Category",
      "Status",
      "Next Due Date",
    ];

    const rows: string[][] = [];

    tasks.forEach((task) => {
      if (task.completionHistory.length === 0) {
        rows.push([
          task.taskName,
          task.machineName,
          task.machineId,
          task.frequency,
          task.nextDueDate.toLocaleDateString(),
          "Pending",
          "",
          "Not completed",
          "0",
          task.category,
          "Pending",
          task.nextDueDate.toLocaleDateString(),
        ]);
      } else {
        task.completionHistory.forEach((completion) => {
          rows.push([
            task.taskName,
            task.machineName,
            task.machineId,
            task.frequency,
            completion.completedDate.toLocaleDateString(),
            completion.userName,
            completion.timeSpentMinutes?.toString() || "N/A",
            completion.notes || "No notes",
            (completion.photos?.length || 0).toString(),
            task.category,
            "Completed",
            task.nextDueDate.toLocaleDateString(),
          ]);
        });
      }
    });

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }

  static exportCompletionHistoryToCSV(tasks: Task[]): string {
    const headers = [
      "Completion ID",
      "Task Name",
      "Machine Name",
      "Completed By",
      "Completion Date",
      "Time Spent (min)",
      "Notes",
      "Photos Count",
      "Photo Data Available",
      "Checklist Items Completed",
      "Total Checklist Items",
    ];

    const rows: string[][] = [];

    tasks.forEach((task) => {
      task.completionHistory.forEach((completion) => {
        const completedItems = completion.checklistItems.filter(
          (item) => item.completed,
        ).length;
        const totalItems = completion.checklistItems.length;

        rows.push([
          completion.id,
          task.taskName,
          task.machineName,
          completion.userName,
          completion.completedDate.toLocaleDateString(),
          completion.timeSpentMinutes?.toString() || "N/A",
          completion.notes || "No notes",
          (completion.photos?.length || 0).toString(),
          completion.photos && completion.photos.length > 0 ? "Yes" : "No",
          completedItems.toString(),
          totalItems.toString(),
        ]);
      });
    });

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }
}

// Database operations
export class Database {
  static async addTask(task: Task): Promise<void> {
    try {
      const { error } = await supabase.from("tasks").insert([
        {
          id: task.id,
          machine_id: task.machineId,
          machine_name: task.machineName,
          task_name: task.taskName,
          description: task.description,
          frequency: task.frequency,
          category: task.category,
          estimated_time_minutes: task.estimatedTimeMinutes,
          weekly_day: task.weeklyDay,
          safety_notes: task.safetyNotes,
          required_tools: task.requiredTools,
          is_active: task.isActive,
          created_date: task.createdDate.toISOString(),
          next_due_date: task.nextDueDate.toISOString(),
          last_completed_date: task.lastCompletedDate?.toISOString(),
        },
      ]);

      if (error) {
        console.error("Error adding task:", error);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  static async addTasks(tasks: Task[]): Promise<void> {
    try {
      const taskData = tasks.map((task) => ({
        id: task.id,
        machine_id: task.machineId,
        machine_name: task.machineName,
        task_name: task.taskName,
        description: task.description,
        frequency: task.frequency,
        category: task.category,
        estimated_time_minutes: task.estimatedTimeMinutes,
        weekly_day: task.weeklyDay,
        safety_notes: task.safetyNotes,
        required_tools: task.requiredTools,
        is_active: task.isActive,
        created_date: task.createdDate.toISOString(),
        next_due_date: task.nextDueDate.toISOString(),
        last_completed_date: task.lastCompletedDate?.toISOString(),
      }));

      const { error } = await supabase.from("tasks").insert(taskData);

      if (error) {
        console.error("Error adding tasks:", error);
      }
    } catch (error) {
      console.error("Error adding tasks:", error);
    }
  }

  static async getTasks(): Promise<Task[]> {
    try {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .order("next_due_date", { ascending: true });

      if (error) {
        console.error("Error fetching tasks:", error);
        return [];
      }

      if (!tasks) return [];

      // Fetch completions and progress for each task
      const tasksWithDetails = await Promise.all(
        tasks.map(async (task) => {
          const completionHistory = await this.getTaskCompletions(task.id);
          const progressSaves = await this.getTaskProgressSaves(task.id);

          return {
            id: task.id,
            machineId: task.machine_id,
            machineName: task.machine_name,
            taskName: task.task_name,
            description: task.description,
            frequency: task.frequency as Task["frequency"],
            category: task.category as Task["category"],
            estimatedTimeMinutes: task.estimated_time_minutes,
            weeklyDay: task.weekly_day as Task["weeklyDay"],
            safetyNotes: task.safety_notes,
            requiredTools: task.required_tools,
            isActive: task.is_active,
            createdDate: new Date(task.created_date),
            nextDueDate: new Date(task.next_due_date),
            lastCompletedDate: task.last_completed_date
              ? new Date(task.last_completed_date)
              : undefined,
            completionHistory,
            progressSaves,
          };
        }),
      );

      return tasksWithDetails;
    } catch (error) {
      console.error("Error getting tasks:", error);
      return [];
    }
  }

  static async getTaskById(id: string): Promise<Task | undefined> {
    try {
      const { data: task, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !task) {
        return undefined;
      }

      const completionHistory = await this.getTaskCompletions(task.id);
      const progressSaves = await this.getTaskProgressSaves(task.id);

      return {
        id: task.id,
        machineId: task.machine_id,
        machineName: task.machine_name,
        taskName: task.task_name,
        description: task.description,
        frequency: task.frequency as Task["frequency"],
        category: task.category as Task["category"],
        estimatedTimeMinutes: task.estimated_time_minutes,
        weeklyDay: task.weekly_day as Task["weeklyDay"],
        safetyNotes: task.safety_notes,
        requiredTools: task.required_tools,
        isActive: task.is_active,
        createdDate: new Date(task.created_date),
        nextDueDate: new Date(task.next_due_date),
        lastCompletedDate: task.last_completed_date
          ? new Date(task.last_completed_date)
          : undefined,
        completionHistory,
        progressSaves,
      };
    } catch (error) {
      console.error("Error getting task by ID:", error);
      return undefined;
    }
  }

  static async getTasksByMachine(machineId: string): Promise<Task[]> {
    const allTasks = await this.getTasks();
    return allTasks.filter((t) => t.machineId === machineId);
  }

  static async getMachines(): Promise<Machine[]> {
    const tasks = await this.getTasks();
    const machineMap = new Map<string, Machine>();

    tasks.forEach((task) => {
      if (!machineMap.has(task.machineId)) {
        machineMap.set(task.machineId, {
          id: task.machineId,
          name: task.machineName,
          type: "Industrial Equipment",
          location: "Production Floor",
          status: "operational" as const,
          tasks: [],
        });
      }
      machineMap.get(task.machineId)!.tasks.push(task);
    });

    return Array.from(machineMap.values());
  }

  static async getMachineById(id: string): Promise<Machine | undefined> {
    const machines = await this.getMachines();
    return machines.find((m) => m.id === id);
  }

  static async clearDatabase(): Promise<void> {
    try {
      // Clear in order due to foreign key constraints
      await supabase
        .from("task_progress")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase
        .from("task_completions")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase
        .from("tasks")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase
        .from("machines")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
    } catch (error) {
      console.error("Error clearing database:", error);
    }
  }

  private static async getTaskCompletions(
    taskId: string,
  ): Promise<TaskCompletion[]> {
    try {
      const { data: completions, error } = await supabase
        .from("task_completions")
        .select("*")
        .eq("task_id", taskId)
        .order("completed_date", { ascending: false });

      if (error || !completions) {
        return [];
      }

      return completions.map((completion) => ({
        id: completion.id,
        taskId: completion.task_id,
        userId: completion.user_id,
        userName: completion.user_name,
        completedDate: new Date(completion.completed_date),
        notes: completion.notes,
        timeSpentMinutes: completion.time_spent_minutes,
        photos: completion.photos,
        checklistItems: completion.checklist_items,
      }));
    } catch (error) {
      console.error("Error fetching task completions:", error);
      return [];
    }
  }

  private static async getTaskProgressSaves(
    taskId: string,
  ): Promise<TaskProgress[]> {
    try {
      const { data: progressSaves, error } = await supabase
        .from("task_progress")
        .select("*")
        .eq("task_id", taskId)
        .order("saved_date", { ascending: false });

      if (error || !progressSaves) {
        return [];
      }

      return progressSaves.map((progress) => ({
        id: progress.id,
        taskId: progress.task_id,
        userId: progress.user_id,
        userName: progress.user_name,
        savedDate: new Date(progress.saved_date),
        checklistItems: progress.checklist_items,
        notes: progress.notes,
        photos: progress.photos,
      }));
    } catch (error) {
      console.error("Error fetching task progress saves:", error);
      return [];
    }
  }

  static async getAnalytics() {
    const tasks = await this.getTasks();
    const machines = await this.getMachines();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = tasks.filter(
      (t) => t.lastCompletedDate && t.lastCompletedDate >= today,
    ).length;

    const overdueTasks = tasks.filter((t) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(t.nextDueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() < today.getTime();
    }).length;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const upcomingTasks = tasks.filter((t) => {
      const dueDate = new Date(t.nextDueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === tomorrow.getTime();
    }).length;

    const tasksWithProgress = tasks.filter((task) => {
      return task.progressSaves.length > 0;
    }).length;

    return {
      totalTasks: tasks.length,
      totalMachines: machines.length,
      completedToday,
      overdueTasks,
      upcomingTasks,
      tasksWithProgress,
      totalCompletions: tasks.reduce(
        (sum, task) => sum + task.completionHistory.length,
        0,
      ),
      averageTaskTime: this.getAverageTaskTime(tasks),
      mostActiveUser: this.getMostActiveUser(tasks),
      machineEfficiency: this.getMachineEfficiency(machines),
    };
  }

  private static getAverageTaskTime(tasks: Task[]): number {
    const allCompletions = tasks.flatMap((task) => task.completionHistory);
    if (allCompletions.length === 0) return 0;

    const totalTime = allCompletions.reduce((sum, completion) => {
      return sum + (completion.timeSpentMinutes || 0);
    }, 0);

    return Math.round(totalTime / allCompletions.length);
  }

  private static getMostActiveUser(tasks: Task[]): {
    name: string;
    completions: number;
  } {
    const userCompletions = new Map<string, number>();

    tasks.forEach((task) => {
      task.completionHistory.forEach((completion) => {
        const current = userCompletions.get(completion.userName) || 0;
        userCompletions.set(completion.userName, current + 1);
      });
    });

    let mostActive = { name: "N/A", completions: 0 };
    userCompletions.forEach((completions, userName) => {
      if (completions > mostActive.completions) {
        mostActive = { name: userName, completions };
      }
    });

    return mostActive;
  }

  private static getMachineEfficiency(machines: Machine[]): {
    [machineId: string]: number;
  } {
    const efficiency: { [machineId: string]: number } = {};

    machines.forEach((machine) => {
      const totalTasks = machine.tasks.length;
      const onTimeTasks = machine.tasks.filter((task) => {
        if (!task.lastCompletedDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.nextDueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() >= today.getTime();
      }).length;

      efficiency[machine.id] =
        totalTasks > 0 ? Math.round((onTimeTasks / totalTasks) * 100) : 0;
    });

    return efficiency;
  }

  static async getTasksByStatus(
    status: "completed" | "pending" | "overdue",
  ): Promise<Task[]> {
    const tasks = await this.getTasks();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      switch (status) {
        case "completed":
          return task.lastCompletedDate && task.lastCompletedDate >= today;
        case "overdue": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dueDate = new Date(task.nextDueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() < today.getTime();
        }
        case "pending":
          return !task.lastCompletedDate || task.lastCompletedDate < today;
        default:
          return true;
      }
    });
  }

  static async getAllTaskPhotos(): Promise<
    Array<{
      taskId: string;
      taskName: string;
      machineName: string;
      completionId: string;
      completedBy: string;
      completedDate: Date;
      photos: string[];
      notes?: string;
      timeSpent?: number;
    }>
  > {
    const tasks = await this.getTasks();
    const photoData: Array<any> = [];

    tasks.forEach((task) => {
      task.completionHistory.forEach((completion) => {
        if (completion.photos && completion.photos.length > 0) {
          photoData.push({
            taskId: task.id,
            taskName: task.taskName,
            machineName: task.machineName,
            completionId: completion.id,
            completedBy: completion.userName,
            completedDate: completion.completedDate,
            photos: completion.photos,
            notes: completion.notes,
            timeSpent: completion.timeSpentMinutes,
          });
        }
      });
    });

    return photoData.sort(
      (a, b) =>
        new Date(b.completedDate).getTime() -
        new Date(a.completedDate).getTime(),
    );
  }

  static async getTaskPhotos(taskId: string): Promise<
    Array<{
      completionId: string;
      completedBy: string;
      completedDate: Date;
      photos: string[];
      notes?: string;
      timeSpent?: number;
    }>
  > {
    const task = await this.getTaskById(taskId);
    if (!task) return [];

    return task.completionHistory
      .filter((completion) => completion.photos && completion.photos.length > 0)
      .map((completion) => ({
        completionId: completion.id,
        completedBy: completion.userName,
        completedDate: completion.completedDate,
        photos: completion.photos!,
        notes: completion.notes,
        timeSpent: completion.timeSpentMinutes,
      }))
      .sort(
        (a, b) =>
          new Date(b.completedDate).getTime() -
          new Date(a.completedDate).getTime(),
      );
  }

  static async getRecentCompletions(limit: number = 20): Promise<
    Array<
      TaskCompletion & {
        taskName: string;
        machineName: string;
      }
    >
  > {
    try {
      const { data: completions, error } = await supabase
        .from("task_completions")
        .select(
          `
          *,
          tasks (
            task_name,
            machine_name
          )
        `,
        )
        .order("completed_date", { ascending: false })
        .limit(limit);

      if (error || !completions) {
        console.error("Error fetching recent completions:", error);
        return [];
      }

      return completions.map((completion) => ({
        id: completion.id,
        taskId: completion.task_id,
        userId: completion.user_id,
        userName: completion.user_name,
        completedDate: new Date(completion.completed_date),
        notes: completion.notes,
        timeSpentMinutes: completion.time_spent_minutes,
        photos: completion.photos,
        checklistItems: completion.checklist_items,
        taskName: completion.tasks?.task_name || "Unknown Task",
        machineName: completion.tasks?.machine_name || "Unknown Machine",
      }));
    } catch (error) {
      console.error("Error getting recent completions:", error);
      return [];
    }
  }

  static async getCompletionById(completionId: string): Promise<
    | (TaskCompletion & {
        taskName: string;
        machineName: string;
      })
    | undefined
  > {
    try {
      const { data: completion, error } = await supabase
        .from("task_completions")
        .select(
          `
          *,
          tasks (
            task_name,
            machine_name
          )
        `,
        )
        .eq("id", completionId)
        .single();

      if (error || !completion) {
        return undefined;
      }

      return {
        id: completion.id,
        taskId: completion.task_id,
        userId: completion.user_id,
        userName: completion.user_name,
        completedDate: new Date(completion.completed_date),
        notes: completion.notes,
        timeSpentMinutes: completion.time_spent_minutes,
        photos: completion.photos,
        checklistItems: completion.checklist_items,
        taskName: completion.tasks?.task_name || "Unknown Task",
        machineName: completion.tasks?.machine_name || "Unknown Machine",
      };
    } catch (error) {
      console.error("Error getting completion by ID:", error);
      return undefined;
    }
  }
}

export default Database;
