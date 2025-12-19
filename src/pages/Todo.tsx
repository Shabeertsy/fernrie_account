import React, { useState, useEffect } from 'react';
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
    AlertCircle,
    Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { todoAPI } from '../api/todo';
import type { Todo, CreateTodoData } from '../types/todo';

const TodoPage: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [formData, setFormData] = useState<CreateTodoData>({
        title: '',
        description: '',
        status: 'active',
        due_date: '',
        priority: 0,
        category: ''
    });

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'danger' as 'danger' | 'warning' | 'info' | 'success',
        confirmText: 'Confirm',
        onConfirm: async () => { },
        isLoading: false
    });

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const data = await todoAPI.getTodos();
            setTodos(data);
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTodo) {
                await todoAPI.updateTodo(editingTodo.id, formData);
            } else {
                await todoAPI.createTodo(formData);
            }
            await fetchTodos();
            closeModal();
        } catch (error) {
            console.error('Failed to save todo:', error);
        }
    };

    const handleDelete = (id: number) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Task',
            message: 'Are you sure you want to delete this task? This action cannot be undone.',
            type: 'danger',
            confirmText: 'Delete',
            isLoading: false,
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, isLoading: true }));
                try {
                    await todoAPI.deleteTodo(id);
                    await fetchTodos();
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    console.error('Failed to delete todo:', error);
                    setConfirmDialog(prev => ({ ...prev, isLoading: false }));
                }
            }
        });
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo);
        setFormData({
            title: todo.title,
            description: todo.description || '',
            status: todo.status,
            due_date: todo.due_date || '',
            priority: todo.priority,
            category: todo.category || ''
        });
        setIsModalOpen(true);
    };

    const toggleTodo = async (todo: Todo) => {
        try {
            await todoAPI.updateTodo(todo.id, {
                status: todo.status === 'active' ? 'completed' : 'active'
            });
            await fetchTodos();
        } catch (error) {
            console.error('Failed to update todo status:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTodo(null);
        setFormData({
            title: '',
            description: '',
            status: 'active',
            due_date: '',
            priority: 0,
            category: ''
        });
    };

    const getPriorityColor = (priority: number) => {
        if (priority >= 3) return 'text-red-600 bg-red-50 border-red-100';
        if (priority >= 2) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
        return 'text-blue-600 bg-blue-50 border-blue-100';
    };

    const getPriorityLabel = (priority: number) => {
        if (priority >= 3) return 'High';
        if (priority >= 2) return 'Medium';
        return 'Low';
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'all') return true;
        return todo.status === filter;
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
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
                    >
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
                                {todos.filter(t => t.status === 'completed').length}
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
                                {todos.filter(t => t.status === 'active').length}
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
                                {todos.filter(t => t.priority >= 3).length}
                            </p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="text-red-600" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Action Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-20 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center sm:hidden z-50 active:scale-95 hover:bg-emerald-700 transition-colors"
            >
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
            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTodos.map((todo) => {
                        const dueDate = todo.due_date ? new Date(todo.due_date) : null;
                        const isOverdue = dueDate && dueDate < new Date() && todo.status === 'active';

                        return (
                            <div
                                key={todo.id}
                                className={clsx(
                                    'bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 transition-all active:scale-[0.99]',
                                    todo.status === 'completed' && 'bg-slate-50/50'
                                )}
                            >
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <button
                                        onClick={() => toggleTodo(todo)}
                                        className="mt-1 flex-shrink-0"
                                    >
                                        {todo.status === 'completed' ? (
                                            <CheckCircle className="text-green-500" size={22} />
                                        ) : (
                                            <Circle className="text-slate-300 hover:text-emerald-500 transition-colors" size={22} />
                                        )}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <h3 className={clsx(
                                                'text-sm sm:text-lg font-semibold leading-tight pr-2',
                                                todo.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'
                                            )}>
                                                {todo.title}
                                            </h3>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(todo)}
                                                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(todo.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {todo.description && (
                                            <p className={clsx(
                                                'text-xs sm:text-sm mb-3 line-clamp-2',
                                                todo.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-600'
                                            )}>
                                                {todo.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-2">
                                            {todo.priority > 0 && (
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold border ${getPriorityColor(todo.priority)}`}>
                                                    <Flag size={10} className="inline mr-1" />
                                                    {getPriorityLabel(todo.priority)}
                                                </span>
                                            )}
                                            {todo.category && (
                                                <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-100">
                                                    {todo.category}
                                                </span>
                                            )}
                                            {todo.due_date && (
                                                <span className={clsx(
                                                    "flex items-center gap-1 text-[10px] sm:text-xs font-medium ml-auto",
                                                    isOverdue ? 'text-red-600' : 'text-slate-400'
                                                )}>
                                                    <Calendar size={12} />
                                                    {dueDate?.toLocaleDateString()}
                                                    {isOverdue && <AlertCircle size={12} />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && filteredTodos.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <CheckCircle className="mx-auto text-slate-300" size={48} />
                    <p className="text-slate-500 mt-2">No tasks found</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingTodo ? "Edit Task" : "Add New Task"}
                size="sm"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none h-20"
                            placeholder="Add details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                placeholder="e.g., Work"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            >
                                <option value={0}>Low</option>
                                <option value={2}>Medium</option>
                                <option value={3}>High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                        <input
                            type="date"
                            value={formData.due_date}
                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                    </div>

                    {editingTodo && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'completed' })}
                                className="w-full px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            >
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                    >
                        {editingTodo ? 'Update Task' : 'Create Task'}
                    </button>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                type={confirmDialog.type}
                confirmText={confirmDialog.confirmText}
                isLoading={confirmDialog.isLoading}
            />
        </div>
    );
};

export default TodoPage;
