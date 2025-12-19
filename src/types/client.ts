export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    company_name: string | null;
    status: string | null;
    total_income?: number;
    total_expense?: number;
    profit?: number;
    created_at: string;
    updated_at: string;
}

export interface CreateClientData {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    company_name?: string;
    status?: string;
}

export interface UpdateClientData {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    company_name?: string;
    status?: string;
}
