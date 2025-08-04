// Excel data structure based on Trumpf 5000 Punch maintenance sheet
export interface ExcelRow {
  'Machine ID': string;
  'Machine Name': string;
  'Task Name': string;
  'Description': string;
  'Frequency': string;
  'Category': string;
  'Estimated Time (min)': number;
  'Weekly Day'?: string;
  'Safety Notes'?: string;
  'Required Tools'?: string;
}

// Complete data from the Trumpf 5000 Punch maintenance sheet
export const trumpfExcelData: ExcelRow[] = [
  // Daily Tasks
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Visual Inspect Tables, Make sure rails are clear',
    'Description': 'Visual inspection of turret, tables, and rails to ensure clear operation',
    'Frequency': 'Daily',
    'Category': 'Inspection',
    'Estimated Time (min)': 10,
    'Safety Notes': 'Ensure machine is powered down before inspection',
    'Required Tools': 'Visual inspection only'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Chip Vacuum System: Clean Chip Flag, replace seal if needed',
    'Description': 'Clean chip flag and inspect/replace seal as necessary',
    'Frequency': 'Daily',
    'Category': 'Cleaning',
    'Estimated Time (min)': 15,
    'Safety Notes': 'Lock out air supply before maintenance',
    'Required Tools': 'Cleaning cloth, replacement seals'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Visual inspection of chip conveyor belt and guarding condition',
    'Description': 'Check conveyor belt operation and guard integrity',
    'Frequency': 'Daily',
    'Category': 'Inspection',
    'Estimated Time (min)': 10,
    'Safety Notes': 'Do not operate with guards removed',
    'Required Tools': 'Visual inspection only'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Inspect Tooling During Setup for proper clearance, setup and alignment',
    'Description': 'Verify tooling clearance, setup accuracy, and alignment',
    'Frequency': 'Daily',
    'Category': 'Inspection',
    'Estimated Time (min)': 20,
    'Safety Notes': 'Use proper lifting techniques for heavy tooling',
    'Required Tools': 'Measuring tools, alignment gauges'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Clean Punching Tool holder and check stripper segment',
    'Description': 'Clean tool holder and inspect stripper segment condition',
    'Frequency': 'Daily',
    'Category': 'Cleaning',
    'Estimated Time (min)': 15,
    'Safety Notes': 'Handle sharp tooling with care',
    'Required Tools': 'Cleaning solvent, rags, inspection light'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Wipe Glass Sheet Master Section Cups and replace as needed',
    'Description': 'Clean glass sheet master section cups and replace if damaged',
    'Frequency': 'Daily',
    'Category': 'Cleaning',
    'Estimated Time (min)': 10,
    'Safety Notes': 'Handle glass components carefully',
    'Required Tools': 'Lint-free cloth, replacement cups'
  },

  // Weekly Tasks
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Clean strainer and filter on Chip Vacuum System - Suction Tube',
    'Description': 'Clean vacuum system strainer and filter for optimal performance',
    'Frequency': 'Weekly',
    'Category': 'Cleaning',
    'Estimated Time (min)': 30,
    'Weekly Day': 'Monday',
    'Safety Notes': 'Isolate vacuum system before maintenance',
    'Required Tools': 'Cleaning solvent, compressed air, replacement filters'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Inspect Punching Fluid Reservoir fill as needed',
    'Description': 'Check punching fluid level and top up as required',
    'Frequency': 'Weekly',
    'Category': 'Maintenance',
    'Estimated Time (min)': 20,
    'Weekly Day': 'Tuesday',
    'Safety Notes': 'Use appropriate PPE when handling fluids',
    'Required Tools': 'Punching fluid, funnel, level gauge'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Inspect Tapping Fluid Reservoir fill as needed',
    'Description': 'Check tapping fluid level and refill if necessary',
    'Frequency': 'Weekly',
    'Category': 'Maintenance',
    'Estimated Time (min)': 20,
    'Weekly Day': 'Wednesday',
    'Safety Notes': 'Dispose of old fluid according to safety guidelines',
    'Required Tools': 'Tapping fluid, funnel, dipstick'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Clean the index pin',
    'Description': 'Clean and lubricate index pin mechanism',
    'Frequency': 'Weekly',
    'Category': 'Cleaning',
    'Estimated Time (min)': 15,
    'Weekly Day': 'Thursday',
    'Safety Notes': 'Ensure pin is properly seated after cleaning',
    'Required Tools': 'Cleaning solvent, lubricant, rags'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Clean sensor and deflector for stripper detection',
    'Description': 'Clean optical sensors and deflector for accurate detection',
    'Frequency': 'Weekly',
    'Category': 'Cleaning',
    'Estimated Time (min)': 15,
    'Weekly Day': 'Friday',
    'Safety Notes': 'Use proper sensor cleaning solution only',
    'Required Tools': 'Sensor cleaning solution, lint-free cloth'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Clean Tool Cartridge Rail',
    'Description': 'Clean and lubricate tool cartridge rail system',
    'Frequency': 'Weekly',
    'Category': 'Cleaning',
    'Estimated Time (min)': 20,
    'Weekly Day': 'Friday',
    'Safety Notes': 'Remove all tooling before rail maintenance',
    'Required Tools': 'Degreaser, lubricant, cleaning rags'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Wipe Excess Oil From Slides',
    'Description': 'Remove excess oil from machine slides and ways',
    'Frequency': 'Weekly',
    'Category': 'Cleaning',
    'Estimated Time (min)': 15,
    'Weekly Day': 'Friday',
    'Safety Notes': 'Dispose of oil-soaked rags properly',
    'Required Tools': 'Absorbent rags, degreaser'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Wipe Machine Down',
    'Description': 'Complete external cleaning of machine surfaces',
    'Frequency': 'Weekly',
    'Category': 'Cleaning',
    'Estimated Time (min)': 25,
    'Weekly Day': 'Friday',
    'Safety Notes': 'Use non-abrasive cleaning materials only',
    'Required Tools': 'Machine cleaner, microfiber cloths'
  },
  {
    'Machine ID': 'TRUMPF-5000-001',
    'Machine Name': 'Trumpf 5000 Punch',
    'Task Name': 'Sharpen Any Dull Tooling',
    'Description': 'Inspect and sharpen dull punching and forming tools',
    'Frequency': 'Weekly',
    'Category': 'Maintenance',
    'Estimated Time (min)': 45,
    'Weekly Day': 'Friday',
    'Safety Notes': 'Use proper tool grinding procedures and PPE',
    'Required Tools': 'Tool grinder, measuring equipment, safety glasses'
  }
];

// Function to convert data to CSV format for Excel import
export const generateExcelCSV = (): string => {
  const headers = Object.keys(trumpfExcelData[0]);
  const csvContent = [
    headers.join(','),
    ...trumpfExcelData.map(row => 
      headers.map(header => `"${row[header as keyof ExcelRow] || ''}"`).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

// Function to download Excel file
export const downloadTrumpfExcelFile = (): void => {
  const csvContent = generateExcelCSV();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'Trumpf_5000_Punch_Maintenance_Tasks.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Convert Excel data to database format
export const convertExcelToDatabase = () => {
  return trumpfExcelData.map((row, index) => ({
    id: `trumpf-task-${index + 1}`,
    machineId: row['Machine ID'],
    machineName: row['Machine Name'],
    taskName: row['Task Name'],
    description: row['Description'],
    frequency: row['Frequency'].toLowerCase() as 'daily' | 'weekly' | 'monthly',
    category: row['Category'].toLowerCase() as 'maintenance' | 'inspection' | 'cleaning',
    estimatedTimeMinutes: row['Estimated Time (min)'],
    weeklyDay: row['Weekly Day']?.toLowerCase() as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday',
    safetyNotes: row['Safety Notes'] ? [row['Safety Notes']] : [],
    requiredTools: row['Required Tools'] ? [row['Required Tools']] : [],
    isActive: true,
    createdDate: new Date(),
    nextDueDate: new Date(), // Today for initial setup
    completionHistory: []
  }));
};
