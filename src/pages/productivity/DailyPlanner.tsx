
import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus, Edit, Trash2, CheckCircle, Circle, Star } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  duration: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: string;
}

const DailyPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    time: '',
    duration: 30,
    priority: 'medium' as const,
    category: 'work'
  });

  const categories = ['work', 'personal', 'health', 'learning', 'social', 'other'];
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(`daily-planner-${selectedDate}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([]);
    }
  }, [selectedDate]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(`daily-planner-${selectedDate}`, JSON.stringify(tasks));
  }, [tasks, selectedDate]);

  const addTask = () => {
    if (!newTask.title.trim() || !newTask.time) {
      toast.error("Please fill in title and time");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      time: newTask.time,
      duration: newTask.duration,
      priority: newTask.priority,
      completed: false,
      category: newTask.category
    };

    setTasks(prev => [...prev, task].sort((a, b) => a.time.localeCompare(b.time)));
    setNewTask({
      title: '',
      description: '',
      time: '',
      duration: 30,
      priority: 'medium',
      category: 'work'
    });
    setIsAddingTask(false);
    toast.success("Task added successfully!");
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ).sort((a, b) => a.time.localeCompare(b.time)));
    setEditingTask(null);
    toast.success("Task updated!");
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted!");
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    const totalTime = tasks.reduce((sum, task) => sum + task.duration, 0);
    
    return { total, completed, highPriority, totalTime };
  };

  const stats = getTaskStats();

  return (
    <ToolLayout
      title="📈 Daily Planner"
      description="Plan and organize your daily schedule with tasks, priorities, and time management."
    >
      <div className="space-y-6">
        {/* Header with Date Selection and Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="px-3 py-1">
              Total: {stats.total}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 bg-green-50">
              Completed: {stats.completed}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 bg-red-50">
              High Priority: {stats.highPriority}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 bg-blue-50">
              {Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m planned
            </Badge>
          </div>
        </div>

        {/* Add Task Button */}
        <div className="text-center">
          <Button 
            onClick={() => setIsAddingTask(true)}
            className="w-full sm:w-auto"
            disabled={isAddingTask}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Task
          </Button>
        </div>

        {/* Add Task Form */}
        {isAddingTask && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Schedule a new task for your day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Task Title</label>
                  <Input
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Time</label>
                  <Input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Task description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                  <Input
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    value={newTask.duration}
                    onChange={(e) => setNewTask(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={newTask.category} onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                  Cancel
                </Button>
                <Button onClick={addTask}>
                  Add Task
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No tasks scheduled</h3>
                <p className="text-gray-500">Add your first task to start planning your day!</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className={`transition-all ${task.completed ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1"
                      >
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </h3>
                          <Badge className={priorityColors[task.priority]}>
                            {task.priority}
                          </Badge>
                          {task.priority === 'high' && <Star className="w-4 h-4 text-yellow-500" />}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{task.time}</span>
                          </div>
                          <span>•</span>
                          <span>{task.duration} min</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                        </div>
                        
                        {task.description && (
                          <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTask(task.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Progress Summary */}
        {tasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Day Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m
                  </div>
                  <div className="text-sm text-gray-600">Planned Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default DailyPlanner;
