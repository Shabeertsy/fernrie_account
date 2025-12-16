import React, { useState } from 'react';
import { 
    Plus, 
    CheckCircle, 
    Circle, 
    Trash2, 
    Edit2, 
    Calendar, 
    Flag,
    ListTodo,
    CheckSquare,
    Clock,
    AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';

interface Todo {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    completed: boolean;
    category: string;
}

const Todo: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([
        {
            id: '1',
            title: 'Review client invoices',
            description: 'Review and approve pending invoices for ABC Corp',
            priority: 'high',
            dueDate: '2025-12-18',
            completed: false,
            category: 'Billing'
        },
        {
            id: '2',
            title: 'Meet new partner',
            description: 'Initial meeting with Tech Solutions partnership',
            priority: 'medium',
            dueDate: '2025-12-20',
            completed: false,
            category: 'Partners'
        },
        {
            id: '3',
            title: 'Update financial reports',
            description: 'Prepare quarterly financial report for all clients',
            priority: 'high',
            dueDate: '2025-12-22',
            completed: false,
            category: 'Clients'
        },
        {
            id: '4',
            title: 'Follow up on overdue payment',
            description: 'Contact XYZ Limited about overdue invoice',
            priority: 'medium',
            dueDate: '2025-12-19',
            completed: true,
            category: 'Billing'
        }
    ]);

    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    const toggleTodo = (id: string) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-600 bg-red-50 border-red-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-50 border-yellow-100';
            case 'low':
                return 'text-blue-600 bg-blue-50 border-blue-100';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    return (
        <div className="space-y-4 sm:space-y-6 pb-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Todo List</h1>
                    <p className="text-xs sm:text-base text-slate-500 mt-0.5">Manage your tasks and priorities</p>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm active:scale-95">
                        <Plus size={20} />
                        <span>Add Task</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Total Tasks</p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{todos.length}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ListTodo className="text-blue-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Completed</p>
                            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                                {todos.filter(t => t.completed).length}
                            </p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <CheckSquare className="text-emerald-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">Pending</p>
                            <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
                                {todos.filter(t => !t.completed).length}
                            </p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-amber-600" size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs sm:text-sm">High Priority</p>
                            <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
                                {todos.filter(t => t.priority === 'high').length}
                            </p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="text-red-600" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Action Button */}
            <button className="fixed bottom-20 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center sm:hidden z-50 active:scale-95 hover:bg-emerald-700 transition-colors">
                <Plus size={24} />
            </button>

            {/* Filters */}
            <div className="bg-white p-2 sm:p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex gap-2 text-sm overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                    <button
                        onClick={() => setFilter('all')}
                        className={clsx(
                            'px-4 py-2 rounded-lg transition-colors whitespace-nowrap',
                            filter === 'all'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        )}
                    >
                        All Tasks
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={clsx(
                            'px-4 py-2 rounded-lg transition-colors whitespace-nowrap',
                            filter === 'active'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        )}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={clsx(
                            'px-4 py-2 rounded-lg transition-colors whitespace-nowrap',
                            filter === 'completed'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        )}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Todo List */}
            <div className="space-y-3">
                {filteredTodos.map((todo) => (
                    <div
                        key={todo.id}
                        className={clsx(
                            'bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 transition-all active:scale-[0.99]',
                            todo.completed && 'bg-slate-50/50'
                        )}
                    >
                        <div className="flex items-start gap-3 sm:gap-4">
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className="mt-1 flex-shrink-0"
                            >
                                {todo.completed ? (
                                    <CheckCircle className="text-green-500" size={22} />
                                ) : (
                                    <Circle className="text-slate-300 hover:text-emerald-500 transition-colors" size={22} />
                                )}
                            </button>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <h3 className={clsx(
                                        'text-sm sm:text-lg font-semibold leading-tight pr-2',
                                        todo.completed ? 'line-through text-slate-400' : 'text-slate-900'
                                    )}>
                                        {todo.title}
                                    </h3>
                                    <div className="flex items-center gap-1">
                                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                <p className={clsx(
                                    'text-xs sm:text-sm mb-3 line-clamp-2',
                                    todo.completed ? 'line-through text-slate-400' : 'text-slate-600'
                                )}>
                                    {todo.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold border ${getPriorityColor(todo.priority)}`}>
                                        <Flag size={10} className="inline mr-1" />
                                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-100">
                                        {todo.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 font-medium ml-auto">
                                        <Calendar size={12} />
                                        {todo.dueDate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTodos.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <CheckCircle className="mx-auto text-slate-300" size={48} />
                    <p className="text-slate-500 mt-2">No tasks found</p>
                </div>
            )}
        </div>
    );
};

export default Todo;
