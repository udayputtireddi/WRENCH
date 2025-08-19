// Professional export system with frequency-based data display
import Database, { type Task } from "./database";
import { TaskCompletionTracker } from "./taskCompletionTracking";

export type ExportDateType =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom"
  | "all";

export interface ExportConfig {
  type: ExportDateType;
  startDate?: Date;
  endDate?: Date;
  format: "csv" | "json";
  includePhotos?: boolean;
}

export class ExportSystem {
  static getDateRange(
    type: ExportDateType,
    customStart?: Date,
    customEnd?: Date,
  ): { start: Date; end: Date } {
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

  /**
   * Get all dates in a given range
   */
  static getAllDatesInRange(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  /**
   * Check if a task should appear on a specific date based on its frequency
   */
  static shouldTaskAppearOnDate(
    task: Task,
    date: Date,
    reportType: ExportDateType,
  ): boolean {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayOfMonth = date.getDate();

    switch (task.frequency) {
      case "daily":
        return true; // Daily tasks appear every day

      case "weekly":
        // For weekly reports, weekly tasks should only appear once per week
        if (reportType === "weekly") {
          // Show on Monday for weekly reports
          return dayOfWeek === 1;
        }
        // For other reports, show on the task's assigned day or Monday if no day assigned
        const assignedDay = task.weeklyDay || "monday";
        const assignedDayNum =
          {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
          }[assignedDay] || 1;
        return dayOfWeek === assignedDayNum;

      case "monthly":
        // For monthly tasks, show on the first day of the month for monthly+ reports
        if (reportType === "monthly" || reportType === "yearly") {
          return dayOfMonth === 1;
        }
        // For daily/weekly reports, check if it's the actual due date
        return task.nextDueDate.toDateString() === date.toDateString();

      default:
        return true;
    }
  }

  static exportTaskCompletions(config: ExportConfig): string {
    const { start, end } = this.getDateRange(
      config.type,
      config.startDate,
      config.endDate,
    );
    const allTasks = Database.getTasks();

    if (config.format === "json") {
      return this.exportToJSON(allTasks, start, end, config.type);
    } else {
      return this.exportToCSV(
        allTasks,
        start,
        end,
        config.type,
        config.includePhotos,
      );
    }
  }

  private static exportToCSV(
    tasks: Task[],
    start: Date,
    end: Date,
    reportType: ExportDateType,
    includePhotos = false,
  ): string {
    // Headers as requested: Task Name, Machine Name, Frequency, Date, then completion details
    const headers = [
      "Task Name",
      "Machine Name",
      "Frequency",
      "Date",
      "Completed By",
      "Time Taken (min)",
      "Notes",
      "Photos",
    ];

    const rows: string[][] = [];
    const allDates = this.getAllDatesInRange(start, end);

    // For each date in the range
    allDates.forEach((date) => {
      // For each task, check if it should appear on this date
      tasks.forEach((task) => {
        if (this.shouldTaskAppearOnDate(task, date, reportType)) {
          // Check if there's a completion for this task on this date
          const completion = task.completionHistory.find((comp) => {
            const compDate = new Date(comp.completedDate);
            return compDate.toDateString() === date.toDateString();
          });

          if (completion) {
            // Task was completed on this date
            let photosDisplay = "No photos";
            if (completion.photos && completion.photos.length > 0) {
              if (includePhotos) {
                photosDisplay = completion.photos.join("; ");
              } else {
                photosDisplay = `${completion.photos.length} photo(s)`;
              }
            }

            rows.push([
              task.taskName,
              task.machineName,
              task.frequency,
              date.toLocaleDateString(),
              completion.userName,
              completion.timeSpentMinutes?.toString() || "Not recorded",
              completion.notes || "No notes",
              photosDisplay,
            ]);
          } else {
            // Task was not completed on this date (show as pending/not done)
            rows.push([
              task.taskName,
              task.machineName,
              task.frequency,
              date.toLocaleDateString(),
              "-- NOT COMPLETED --",
              "0",
              "Task not completed on this date",
              "No photos",
            ]);
          }
        }
      });
    });

    // Sort rows by date and then by task name for better organization
    rows.sort((a, b) => {
      const dateA = new Date(a[3]);
      const dateB = new Date(b[3]);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      return a[0].localeCompare(b[0]); // Sort by task name if dates are equal
    });

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }

  private static exportToJSON(
    tasks: Task[],
    start: Date,
    end: Date,
    reportType: ExportDateType,
  ): string {
    const allDates = this.getAllDatesInRange(start, end);

    const exportData = {
      exportDate: new Date().toISOString(),
      reportType: reportType,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
        totalDays: allDates.length,
      },
      summary: {
        totalTaskInstances: 0,
        completedInstances: 0,
        pendingInstances: 0,
        uniqueTasks: tasks.length,
        averageTimeSpent: 0,
        totalPhotos: 0,
        completionRate: 0,
      },
      dailyData: allDates.map((date) => {
        const dayData = {
          date: date.toISOString().split("T")[0],
          tasks: [] as any[],
        };

        tasks.forEach((task) => {
          if (this.shouldTaskAppearOnDate(task, date, reportType)) {
            const completion = task.completionHistory.find((comp) => {
              const compDate = new Date(comp.completedDate);
              return compDate.toDateString() === date.toDateString();
            });

            const taskInstance = {
              taskName: task.taskName,
              machineName: task.machineName,
              frequency: task.frequency,
              category: task.category,
              status: completion ? "completed" : "not_completed",
              completionDetails: completion
                ? {
                    completedBy: completion.userName,
                    timeSpentMinutes: completion.timeSpentMinutes || 0,
                    notes: completion.notes || "",
                    photosCount: completion.photos?.length || 0,
                    photos: completion.photos || [],
                    checklistProgress: {
                      completed: completion.checklistItems.filter(
                        (item) => item.completed,
                      ).length,
                      total: completion.checklistItems.length,
                    },
                  }
                : null,
            };

            dayData.tasks.push(taskInstance);
          }
        });

        return dayData;
      }),
    };

    // Calculate summary statistics
    let totalInstances = 0;
    let completedInstances = 0;
    let totalTimeSpent = 0;
    let totalPhotos = 0;

    exportData.dailyData.forEach((day) => {
      day.tasks.forEach((task) => {
        totalInstances++;
        if (task.status === "completed") {
          completedInstances++;
          totalTimeSpent += task.completionDetails?.timeSpentMinutes || 0;
          totalPhotos += task.completionDetails?.photosCount || 0;
        }
      });
    });

    exportData.summary.totalTaskInstances = totalInstances;
    exportData.summary.completedInstances = completedInstances;
    exportData.summary.pendingInstances = totalInstances - completedInstances;
    exportData.summary.averageTimeSpent =
      completedInstances > 0
        ? Math.round(totalTimeSpent / completedInstances)
        : 0;
    exportData.summary.totalPhotos = totalPhotos;
    exportData.summary.completionRate =
      totalInstances > 0
        ? Math.round((completedInstances / totalInstances) * 100)
        : 0;

    return JSON.stringify(exportData, null, 2);
  }

  static downloadFile(
    content: string,
    filename: string,
    mimeType: string,
  ): void {
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

  static getReportFilename(
    type: ExportDateType,
    format: "csv" | "json",
  ): string {
    const date = new Date().toISOString().split("T")[0];
    return `wrench_${type}_report_${date}.${format}`;
  }

  // Quick export methods for common use cases
  static exportDaily(
    format: "csv" | "json" = "csv",
    includePhotos = false,
  ): void {
    const config: ExportConfig = { type: "daily", format, includePhotos };
    const content = this.exportTaskCompletions(config);
    const filename = this.getReportFilename("daily", format);
    const mimeType = format === "json" ? "application/json" : "text/csv";
    this.downloadFile(content, filename, mimeType);
  }

  static exportWeekly(
    format: "csv" | "json" = "csv",
    includePhotos = false,
  ): void {
    const config: ExportConfig = { type: "weekly", format, includePhotos };
    const content = this.exportTaskCompletions(config);
    const filename = this.getReportFilename("weekly", format);
    const mimeType = format === "json" ? "application/json" : "text/csv";
    this.downloadFile(content, filename, mimeType);
  }

  static exportMonthly(
    format: "csv" | "json" = "csv",
    includePhotos = false,
  ): void {
    const config: ExportConfig = { type: "monthly", format, includePhotos };
    const content = this.exportTaskCompletions(config);
    const filename = this.getReportFilename("monthly", format);
    const mimeType = format === "json" ? "application/json" : "text/csv";
    this.downloadFile(content, filename, mimeType);
  }

  static exportYearly(
    format: "csv" | "json" = "csv",
    includePhotos = false,
  ): void {
    const config: ExportConfig = { type: "yearly", format, includePhotos };
    const content = this.exportTaskCompletions(config);
    const filename = this.getReportFilename("yearly", format);
    const mimeType = format === "json" ? "application/json" : "text/csv";
    this.downloadFile(content, filename, mimeType);
  }

  static exportCustomRange(
    startDate: Date,
    endDate: Date,
    format: "csv" | "json" = "csv",
    includePhotos = false,
  ): void {
    const config: ExportConfig = {
      type: "custom",
      startDate,
      endDate,
      format,
      includePhotos,
    };
    const content = this.exportTaskCompletions(config);
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];
    const filename = `wrench_custom_${start}_to_${end}.${format}`;
    const mimeType = format === "json" ? "application/json" : "text/csv";
    this.downloadFile(content, filename, mimeType);
  }
}

export default ExportSystem;
