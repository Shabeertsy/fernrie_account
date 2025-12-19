import api from './axios';
import type { Todo, CreateTodoData, UpdateTodoData } from '../types/todo';

export const todoAPI = {
    // Get all todos
    getTodos: async () => {
        const response = await api.get<Todo[]>('accounts/todos/');
        return response.data;
    },

    // Get a single todo
    getTodo: async (id: number) => {
        const response = await api.get<Todo>(`accounts/todos/${id}/`);
        return response.data;
    },

    // Create a new todo
    createTodo: async (data: CreateTodoData) => {
        const response = await api.post<Todo>('accounts/todos/', data);
        return response.data;
    },

    // Update a todo
    updateTodo: async (id: number, data: UpdateTodoData) => {
        const response = await api.patch<Todo>(`accounts/todos/${id}/`, data);
        return response.data;
    },

    // Delete a todo
    deleteTodo: async (id: number) => {
        await api.delete(`accounts/todos/${id}/`);
    },
};
