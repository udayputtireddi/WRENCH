// Professional export system with flexible date filtering
import Database, { type Task } from "./database";
import { TaskCompletionTracker } from "./taskCompletionTracking";

export type ExportDateType = "daily" | "weekly" | "monthly" | "yearly" | "custom" | "all";

export interface ExportConfig {
  type: ExportDateType;
  startDate?: Date;
  endDate?: Date;
  format: "csv" | "json";
  includePhotos?: boolean;
}

export class ExportSystem {
  static getDateRange(type: ExportDateType, customStart?: Date, customEnd?: Date): { start: Date; end: Date } {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now);

    switch (type) {
      case "daily":
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case "weekly":
        const currentDay = now.getDay();
        const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
        start = new Date(now);
        start.setDate(now.getDate() - daysToMonday);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;

      case "monthly":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case "yearly":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        end.setHours(23, 59, 59, 999);
        break;

      case "custom":
        if (customStart && customEnd) {
          start = new Date(customStart);
          end = new Date(customEnd);
          end.setHours(23, 59, 59, 999);
        } else {
          throw new Error("Custom date range requires start and end dates");
        }
        break;

      case "all":
      default:
        start = new Date(1970, 0, 1);
        end = new Date(2099, 11, 31);
        break;
    }

    return { start, end };
  }

  static filterTasksByDateRange(tasks: Task[], start: Date, end: Date): Task[] {
    return tasks.filter((task) => {
      // Check if task has any completion in the date range
      const hasCompletionInRange = task.completionHistory.some((completion) => {
        const completionDate = new Date(completion.completedDate);
        return completionDate >= start && completionDate <= end;
      });

      // Also include tasks due in the range (for pending tasks)
      const isDueInRange = task.nextDueDate >= start && task.nextDueDate <= end;
      
      return hasCompletionInRange || isDueInRange;
    });
  }

  static exportTaskCompletions(config: ExportConfig): string {
    const { start, end } = this.getDateRange(config.type, config.startDate, config.endDate);
    const allTasks = Database.getTasks();
    const filteredTasks = this.filterTasksByDateRange(allTasks, start, end);

    if (config.format === "json") {
      return this.exportToJSON(filteredTasks, start, end);
    } else {
      return this.exportToCSV(filteredTasks, start, end, config.includePhotos);
    }
  }

  private static exportToCSV(tasks: Task[], start: Date, end: Date, includePhotos = false): string {
    // New format matching user's Excel requirements:
    // Task Name, Machine Name, Frequency, Date, then completion details below
    const headers = [
      "Task Name",
      "Machine Name",
      "Frequency",
      "Date",
      "Completed By",
      "Time Taken (min)",
      "Notes",
      "Photos",
      "Category",
      "Status",
      "Next Due Date",
      "Checklist Progress"
    ];

    const rows: string[][] = [];

    tasks.forEach((task) => {
      // Filter completions in date range
      const completionsInRange = task.completionHistory.filter((completion) => {
        const completionDate = new Date(completion.completedDate);
        return completionDate >= start && completionDate <= end;
      });

      if (completionsInRange.length === 0) {
        // Check if task is due in range and show as pending
        if (task.nextDueDate >= start && task.nextDueDate <= end) {
          rows.push([
            task.taskName,
            task.machineName,
            task.frequency,
            task.nextDueDate.toLocaleDateString(),
            "-- PENDING --",
            "--",
            "Task not yet completed",
            "0",
            task.category,
            "Pending",
            task.nextDueDate.toLocaleDateString(),
            "0/0"
          ]);
        }
      } else {
        // Show each completion in date range with enhanced format
        completionsInRange.forEach((completion) => {
          const completedItems = completion.checklistItems.filter(item => item.completed).length;
          const totalItems = completion.checklistItems.length;

          // Format photos for better readability
          let photosDisplay = "No photos";
          if (completion.photos && completion.photos.length > 0) {
            if (includePhotos) {
              photosDisplay = `${completion.photos.length} photos: ${completion.photos.join("; ")}`;
            } else {
              photosDisplay = `${completion.photos.length} photo(s) attached`;
            }
          }

          rows.push([
            task.taskName,
            task.machineName,
            task.frequency,
            completion.completedDate.toLocaleDateString(),
            completion.userName,
            completion.timeSpentMinutes?.toString() || "Not recorded",
            completion.notes || "No notes provided",
            photosDisplay,
            task.category,
            "Completed",
            task.nextDueDate.toLocaleDateString(),
            `${completedItems}/${totalItems}`
          ]);
        });
      }
    });

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }

  private static exportToJSON(tasks: Task[], start: Date, end: Date): string {
    const exportData = {
      exportDate: new Date().toISOString(),
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      summary: {
        totalTasks: tasks.length,
        totalCompletions: tasks.reduce((sum, task) =>
          sum + task.completionHistory.filter(c =>
            new Date(c.completedDate) >= start && new Date(c.completedDate) <= end
          ).length, 0
        ),
        averageTimeSpent: 0,
        totalPhotos: 0,
        completionRate: 0
      },
      tasks: tasks.map((task) => {
        const completionsInRange = task.completionHistory.filter((completion) => {
          const completionDate = new Date(completion.completedDate);
          return completionDate >= start && completionDate <= end;
        });

        return {
          taskDetails: {
            taskId: task.id,
            taskName: task.taskName,
            machineName: task.machineName,
            machineId: task.machineId,
            frequency: task.frequency,
            category: task.category,
            nextDueDate: task.nextDueDate
          },
          completionHistory: completionsInRange.map((completion) => {
            const completedItems = completion.checklistItems.filter(item => item.completed).length;
            const totalItems = completion.checklistItems.length;

            return {
              completionId: completion.id,
              date: completion.completedDate,
              completedBy: completion.userName,
              timeSpentMinutes: completion.timeSpentMinutes,
              notes: completion.notes,
              photos: {
                count: completion.photos?.length || 0,
                files: completion.photos || []
              },
              checklistProgress: {
                completed: completedItems,
                total: totalItems,
                percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
              }
            };
          })
        };
      })
    };

    // Calculate additional metrics
    const allCompletions = tasks.flatMap(task =>
      task.completionHistory.filter(c =>
        new Date(c.completedDate) >= start && new Date(c.completedDate) <= end
      )
    );

    const totalTimeSpent = allCompletions.reduce((sum, c) => sum + (c.timeSpentMinutes || 0), 0);
    exportData.summary.averageTimeSpent = allCompletions.length > 0
      ? Math.round(totalTimeSpent / allCompletions.length)
      : 0;

    exportData.summary.totalPhotos = allCompletions.reduce((sum, c) => sum + (c.photos?.length || 0), 0);

    const pendingTasks = tasks.filter(task =>
      task.nextDueDate >= start && task.nextDueDate <= end &&
      !task.completionHistory.some(c => new Date(c.completedDate) >= start && new Date(c.completedDate) <= end)
    ).length;

    const totalRelevantTasks = exportData.summary.totalCompletions + pendingTasks;
    exportData.summary.completionRate = totalRelevantTasks > 0
      ? Math.round((exportData.summary.totalCompletions / totalRelevantTasks) * 100)
      : 100;

    return JSON.stringify(exportData, null, 2);
  }

  static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static getReportFilename(type: ExportDateType, format: "csv" | "json"): string {
    const date = new Date().toISOString().split('T')[0];
    return `wrench_${type}_report_${date}.${format}`;
  }

  // Quick export methods for common use cases
  static exportDaily(format: "csv" | "json" = "csv"): void {
    const config: ExportConfig = { type: "daily", format };
    const content = this.exportTaskCompletions(config);
    const filename = this.getReportFilename("daily", format);
    const mimeType = format === "json" ? "application/json" : "text/csv";
    this.downloadFile(content, filename, mimeType);
  }

  static exportWeekly(format: "csv" | "json" = "csv"): void {
    const config: ExportConfig = { type: "weekly", format };
    const content = this.exportTaskCompletions(config);
    const filename = this.getReportFilename("weekly", format);
    const mimeType = format === "json" ? "application/json" : "text/csv";
    this.downloadFile(content, filename, mimeType);
  }

  static exportMonthly(format: "csv" | "json" = "csv"): void {
    const config: ExportConfig = { type: "monthly", format };
    const content = this.exportTaskCompletions(config);
    const filename = this.getReportFilename("monthly", format);
    const mimeType = format === "json" ? "application/json" : "text/csv";
    this.downloadFile(content, filename, mimeType);
  }

  static exportYearly(format: "csv" | "json" = "csv"): void {
    const config: ExportConfig = { type: "yearly", format };
    const content = this.exportTaskCompletions(config);
    const filename = this.getReportFilename("yearly", format);
    const mimeType = format === "json" ? "application/json" : "text/csv";
    this.downloadFile(content, filename, mimeType);
  }

  static exportCustomRange(
    startDate: Date, 
    endDate: Date, 
    format: "csv" | "json" = "csv"
  ): void {
    const config: ExportConfig = { 
      type: "custom", 
      startDate, 
      endDate, 
      format 
    };
    const content = this.exportTaskCompletions(config);
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    const filename = `wrench_custom_${start}_to_${end}.${format}`;
    const mimeType = format === "json" ? "application/json" : "text/csv";
    this.downloadFile(content, filename, mimeType);
  }
}

export default ExportSystem;
