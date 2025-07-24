export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  required: boolean;
}

export interface Task {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "custom";
  lastCompleted?: Date;
  nextDue: Date;
  estimatedTime: number; // in minutes
  checklist: ChecklistItem[];
  description?: string;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "active" | "maintenance" | "offline";
  lastMaintenance?: Date;
  tasks: Task[];
}

export const mockMachines: Machine[] = [
  {
    id: "CAR-001",
    name: "Assembly Line Car A",
    type: "Automotive Assembly",
    location: "Factory Floor - Section A",
    status: "active",
    lastMaintenance: new Date("2024-01-10"),
    tasks: [
      {
        id: "task-1",
        name: "Engine Oil Check",
        status: "pending",
        frequency: "weekly",
        nextDue: new Date("2024-01-22"),
        estimatedTime: 30,
        description: "Check engine oil level and quality",
        checklist: [
          {
            id: "c1",
            text: "Turn off engine and wait 5 minutes",
            completed: false,
            required: true,
          },
          {
            id: "c2",
            text: "Remove oil dipstick",
            completed: false,
            required: true,
          },
          {
            id: "c3",
            text: "Clean dipstick with cloth",
            completed: false,
            required: true,
          },
          {
            id: "c4",
            text: "Reinsert dipstick fully",
            completed: false,
            required: true,
          },
          {
            id: "c5",
            text: "Remove and check oil level",
            completed: false,
            required: true,
          },
          {
            id: "c6",
            text: "Check oil color and consistency",
            completed: false,
            required: true,
          },
          {
            id: "c7",
            text: "Record oil level in log",
            completed: false,
            required: false,
          },
          {
            id: "c8",
            text: "Add oil if below minimum level",
            completed: false,
            required: false,
          },
        ],
      },
      {
        id: "task-2",
        name: "Air Filter Inspection",
        status: "overdue",
        frequency: "monthly",
        nextDue: new Date("2024-01-15"),
        estimatedTime: 45,
        description: "Inspect and clean/replace air filter",
        checklist: [
          {
            id: "c9",
            text: "Locate air filter housing",
            completed: false,
            required: true,
          },
          {
            id: "c10",
            text: "Remove air filter cover",
            completed: false,
            required: true,
          },
          {
            id: "c11",
            text: "Extract air filter",
            completed: false,
            required: true,
          },
          {
            id: "c12",
            text: "Inspect filter for damage",
            completed: false,
            required: true,
          },
          {
            id: "c13",
            text: "Clean or replace filter",
            completed: false,
            required: true,
          },
          {
            id: "c14",
            text: "Reinstall filter and cover",
            completed: false,
            required: true,
          },
        ],
      },
      {
        id: "task-3",
        name: "Belt Tension Check",
        status: "completed",
        frequency: "weekly",
        lastCompleted: new Date("2024-01-18"),
        nextDue: new Date("2024-01-25"),
        estimatedTime: 20,
        description: "Check and adjust belt tension",
        checklist: [
          {
            id: "c15",
            text: "Visually inspect belt condition",
            completed: true,
            required: true,
          },
          {
            id: "c16",
            text: "Check belt tension",
            completed: true,
            required: true,
          },
          {
            id: "c17",
            text: "Adjust tension if needed",
            completed: true,
            required: false,
          },
          {
            id: "c18",
            text: "Test belt operation",
            completed: true,
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: "PUMP-05",
    name: "Hydraulic Pump Unit 5",
    type: "Hydraulic System",
    location: "Maintenance Bay - East Wing",
    status: "maintenance",
    lastMaintenance: new Date("2024-01-19"),
    tasks: [
      {
        id: "task-4",
        name: "Pressure Test",
        status: "in-progress",
        frequency: "weekly",
        nextDue: new Date("2024-01-23"),
        estimatedTime: 60,
        description: "Test hydraulic system pressure",
        checklist: [
          {
            id: "c19",
            text: "Connect pressure gauge",
            completed: true,
            required: true,
          },
          {
            id: "c20",
            text: "Start pump system",
            completed: true,
            required: true,
          },
          {
            id: "c21",
            text: "Record pressure readings",
            completed: false,
            required: true,
          },
          {
            id: "c22",
            text: "Check for leaks",
            completed: false,
            required: true,
          },
          {
            id: "c23",
            text: "Verify pressure relief valve",
            completed: false,
            required: true,
          },
          {
            id: "c24",
            text: "Document results",
            completed: false,
            required: true,
          },
        ],
      },
      {
        id: "task-5",
        name: "Fluid Level Check",
        status: "pending",
        frequency: "daily",
        nextDue: new Date("2024-01-21"),
        estimatedTime: 15,
        description: "Check hydraulic fluid level and quality",
        checklist: [
          {
            id: "c25",
            text: "Check fluid reservoir level",
            completed: false,
            required: true,
          },
          {
            id: "c26",
            text: "Inspect fluid color",
            completed: false,
            required: true,
          },
          {
            id: "c27",
            text: "Check for contamination",
            completed: false,
            required: true,
          },
          {
            id: "c28",
            text: "Top up fluid if needed",
            completed: false,
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: "DRILL-12",
    name: "CNC Drill Press 12",
    type: "Precision Drilling",
    location: "Workshop - North Section",
    status: "active",
    lastMaintenance: new Date("2024-01-12"),
    tasks: [
      {
        id: "task-6",
        name: "Spindle Lubrication",
        status: "pending",
        frequency: "weekly",
        nextDue: new Date("2024-01-24"),
        estimatedTime: 40,
        description: "Lubricate spindle and moving parts",
        checklist: [
          {
            id: "c29",
            text: "Power down machine",
            completed: false,
            required: true,
          },
          {
            id: "c30",
            text: "Clean spindle area",
            completed: false,
            required: true,
          },
          {
            id: "c31",
            text: "Apply lubricant to grease points",
            completed: false,
            required: true,
          },
          {
            id: "c32",
            text: "Rotate spindle manually",
            completed: false,
            required: true,
          },
          {
            id: "c33",
            text: "Check for smooth operation",
            completed: false,
            required: true,
          },
          {
            id: "c34",
            text: "Clean excess lubricant",
            completed: false,
            required: true,
          },
        ],
      },
    ],
  },
];

export const getMachine = (id: string): Machine | undefined => {
  return mockMachines.find((machine) => machine.id === id);
};

export const getTask = (
  machineId: string,
  taskId: string,
): Task | undefined => {
  const machine = getMachine(machineId);
  return machine?.tasks.find((task) => task.id === taskId);
};

export const updateChecklistItem = (
  machineId: string,
  taskId: string,
  itemId: string,
  completed: boolean,
): void => {
  const machine = getMachine(machineId);
  const task = machine?.tasks.find((t) => t.id === taskId);
  const item = task?.checklist.find((i) => i.id === itemId);

  if (item) {
    item.completed = completed;

    // Update task status based on checklist completion
    if (task) {
      const requiredItems = task.checklist.filter((i) => i.required);
      const completedRequired = requiredItems.filter((i) => i.completed);

      if (completedRequired.length === requiredItems.length) {
        task.status = "completed";
        task.lastCompleted = new Date();
      } else if (completedRequired.length > 0) {
        task.status = "in-progress";
      } else {
        task.status = "pending";
      }
    }
  }
};

export const getTaskStatusColor = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return "text-green-700 bg-green-100";
    case "in-progress":
      return "text-blue-700 bg-blue-100";
    case "overdue":
      return "text-red-700 bg-red-100";
    default:
      return "text-gray-700 bg-gray-100";
  }
};

export const getMachineStatusColor = (status: Machine["status"]) => {
  switch (status) {
    case "active":
      return "text-green-700 bg-green-100";
    case "maintenance":
      return "text-orange-700 bg-orange-100";
    case "offline":
      return "text-red-700 bg-red-100";
    default:
      return "text-gray-700 bg-gray-100";
  }
};
