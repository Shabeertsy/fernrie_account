export interface Todo {
    id: number;
    title: string;
    description: string | null;
    status: 'active' | 'completed';
    due_date: string | null;
    priority: number;
    category: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateTodoData {
    title: string;
    description?: string;
    status?: 'active' | 'completed';
    due_date?: string;
    priority?: number;
    category?: string;
}

export interface UpdateTodoData {
    title?: string;
    description?: string;
    status?: 'active' | 'completed';
    due_date?: string;
    priority?: number;
    category?: string;
}
