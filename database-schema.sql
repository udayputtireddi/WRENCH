-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create machines table
CREATE TABLE IF NOT EXISTS machines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT CHECK (status IN ('operational', 'maintenance', 'offline')) DEFAULT 'operational',
  last_maintenance TIMESTAMP WITH TIME ZONE,
  next_maintenance TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  machine_id TEXT NOT NULL,
  machine_name TEXT NOT NULL,
  task_name TEXT NOT NULL,
  description TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')) NOT NULL,
  category TEXT CHECK (category IN ('maintenance', 'inspection', 'cleaning')) NOT NULL,
  estimated_time_minutes INTEGER DEFAULT 30,
  weekly_day TEXT,
  safety_notes TEXT[] DEFAULT '{}',
  required_tools TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  last_completed_date TIMESTAMP WITH TIME ZONE
);

-- Create task_completions table
CREATE TABLE IF NOT EXISTS task_completions (
  id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  completed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  time_spent_minutes INTEGER,
  photos TEXT[] DEFAULT '{}',
  checklist_items JSONB NOT NULL DEFAULT '[]'
);

-- Create task_progress table for saved progress
CREATE TABLE IF NOT EXISTS task_progress (
  id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  saved_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checklist_items JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  photos TEXT[] DEFAULT '{}',
  UNIQUE(task_id, user_id) -- Only one saved progress per user per task
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data, admins can read all
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id OR 
    EXISTS (SELECT 1 FROM users WHERE auth.uid() = id AND role = 'admin'));

-- Users can update their own data, admins can update all
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id OR 
    EXISTS (SELECT 1 FROM users WHERE auth.uid() = id AND role = 'admin'));

-- All authenticated users can read machines and tasks
CREATE POLICY "Authenticated users can view machines" ON machines
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view tasks" ON tasks
  FOR SELECT USING (auth.role() = 'authenticated');

-- All authenticated users can read completions and progress
CREATE POLICY "Authenticated users can view completions" ON task_completions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view progress" ON task_progress
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create their own completions and progress
CREATE POLICY "Users can create completions" ON task_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create progress" ON task_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress" ON task_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can manage all data
CREATE POLICY "Admins can manage machines" ON machines
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE auth.uid() = id AND role = 'admin'));

CREATE POLICY "Admins can manage tasks" ON tasks
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE auth.uid() = id AND role = 'admin'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_machine_id ON tasks(machine_id);
CREATE INDEX IF NOT EXISTS idx_tasks_next_due_date ON tasks(next_due_date);
CREATE INDEX IF NOT EXISTS idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_user_id ON task_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_completed_date ON task_completions(completed_date);
CREATE INDEX IF NOT EXISTS idx_task_progress_task_id ON task_progress(task_id);
CREATE INDEX IF NOT EXISTS idx_task_progress_user_id ON task_progress(user_id);

-- Insert sample admin user (password should be hashed in production)
INSERT INTO users (id, name, email, role, department) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin@wrench.com', 'admin', 'Management')
ON CONFLICT (email) DO NOTHING;
