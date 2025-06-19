import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolLayout from "@/components/ToolLayout";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const TodoTracker = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const { toast } = useToast();

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('smartutil-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      })));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('smartutil-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) {
      toast({
        title: "Error",
        description: "Please enter a todo item",
        variant: "destructive"
      });
      return;
    }

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date()
    };

    setTodos(prev => [todo, ...prev]);
    setNewTodo("");
    toast({
      title: "Success",
      description: "Todo added successfully!"
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast({
      title: "Success",
      description: "Todo deleted successfully!"
    });
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <ToolLayout
      title="📈 Todo Tracker"
      description="Stay organized and track your daily tasks efficiently."
    >
      <div className="space-y-6">
        {/* Add new todo */}
        <div className="flex space-x-2">
          <Input
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="flex-1"
          />
          <Button onClick={addTodo}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Stats */}
        {totalCount > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between text-sm">
                <span>Progress: {completedCount} of {totalCount} completed</span>
                <span>{totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Todo list */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No todos yet. Add one above to get started!</p>
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card key={todo.id} className={todo.completed ? "opacity-75" : ""}>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                    />
                    <div className="flex-1">
                      <p className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {todo.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Added {todo.createdAt.toLocaleDateString()} at {todo.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Clear completed button */}
        {completedCount > 0 && (
          <Button
            variant="outline"
            onClick={() => setTodos(prev => prev.filter(todo => !todo.completed))}
            className="w-full"
          >
            Clear {completedCount} Completed Todo{completedCount !== 1 ? 's' : ''}
          </Button>
        )}
      </div>
    </ToolLayout>
  );
};

export default TodoTracker;
