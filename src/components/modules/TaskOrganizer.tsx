import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  FileText, 
  Calendar, 
  MoreVertical, 
  Trash2, 
  Save,
  PenTool,
  ListTodo,
  FileEdit,
  Share2
} from 'lucide-react';
import { Task } from '../../types';

export default function TaskOrganizer() {
  const [activeView, setActiveView] = React.useState<'tasks' | 'docs'>('tasks');
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: '1', title: 'Complete Aura Dashboard UI', completed: false, priority: 'high' },
    { id: '2', title: 'Integrate Gemini API', completed: true, priority: 'high' },
    { id: '3', title: 'Write documentation for Project Hub', completed: false, priority: 'medium' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [docContent, setDocContent] = React.useState('# Project Aura\n\nThis is a high-performance productivity dashboard.\n\n## Goals\n- Modular architecture\n- AI-first workflow\n- Seamless project management');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: 'medium',
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="flex h-full bg-dashboard-bg overflow-hidden text-zinc-800">
      {/* Sidebar */}
      <div className="w-64 border-r border-secondary/30 bg-white/40 flex flex-col">
        <div className="p-6">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Workspace</h2>
          <nav className="space-y-1">
            <SidebarItem 
              active={activeView === 'tasks'} 
              onClick={() => setActiveView('tasks')} 
              icon={<ListTodo size={18} />} 
              label="Tasks" 
              count={tasks.filter(t => !t.completed).length}
            />
            <SidebarItem 
              active={activeView === 'docs'} 
              onClick={() => setActiveView('docs')} 
              icon={<FileEdit size={18} />} 
              label="Documentation" 
            />
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-secondary/30">
          <button className="w-full py-2 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-secondary/50 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
            <Share2 size={14} /> Export Workspace
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeView === 'tasks' ? (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-display font-bold text-zinc-800">Task Manager</h1>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white border border-secondary/30 text-zinc-400 hover:text-primary transition-all shadow-sm">
                    <Calendar size={20} />
                  </button>
                  <button className="p-2 rounded-lg bg-white border border-secondary/30 text-zinc-400 hover:text-primary transition-all shadow-sm">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Add Task */}
              <div className="relative mb-8">
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Add a new task..."
                  className="w-full bg-white border border-secondary/50 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:border-primary transition-colors shadow-sm"
                />
                <button 
                  onClick={addTask}
                  className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-accent text-white hover:bg-accent/80 transition-all shadow-md"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.id}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-secondary/20 hover:border-primary/30 transition-all shadow-sm"
                  >
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`transition-colors ${task.completed ? 'text-primary' : 'text-zinc-200 hover:text-zinc-400'}`}
                    >
                      {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    <span className={`flex-1 text-sm font-medium ${task.completed ? 'text-zinc-300 line-through' : 'text-zinc-700'}`}>
                      {task.title}
                    </span>
                    <div className={`
                      px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter
                      ${task.priority === 'high' ? 'bg-red-500/10 text-red-500' : 
                        task.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' : 
                        'bg-blue-500/10 text-blue-500'}
                    `}>
                      {task.priority}
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-zinc-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-16 border-b border-secondary/30 px-8 flex items-center justify-between bg-white/40">
              <div className="flex items-center gap-4">
                <FileText size={20} className="text-primary" />
                <span className="text-sm font-bold text-zinc-700">Project_Aura_Docs.md</span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/80 transition-all flex items-center gap-2 shadow-md">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
              <textarea 
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                className="flex-1 bg-transparent p-8 focus:outline-none font-mono text-sm leading-relaxed resize-none overflow-y-auto border-r border-secondary/30 text-zinc-700"
                placeholder="Start writing..."
              />
              <div className="flex-1 p-8 overflow-y-auto prose prose-sm max-w-none bg-zinc-50/50 prose-zinc">
                <h1 className="text-xs font-bold text-zinc-300 uppercase tracking-[0.2em] mb-8">Preview</h1>
                {/* Simple Markdown Preview */}
                <div className="whitespace-pre-wrap text-zinc-600">
                  {docContent}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarItem({ active, onClick, icon, label, count }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, count?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm
        ${active 
          ? 'bg-primary/10 text-primary font-bold shadow-sm' 
          : 'text-zinc-400 hover:text-zinc-600 hover:bg-white/50'}
      `}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-primary/20' : 'bg-zinc-100'}`}>
          {count}
        </span>
      )}
    </button>
  );
}
