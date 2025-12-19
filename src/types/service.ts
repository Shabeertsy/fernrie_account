export interface Service {
    id: number;
    client: number;
    service_name: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    is_active: boolean;
    amount: string;
    is_closed: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateServiceData {
    client: number;
    service_name: string;
    description?: string;
    start_date: string;
    end_date?: string;
    is_active?: boolean;
    amount: string | number;
    is_closed?: boolean;
}

export interface UpdateServiceData {
    service_name?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    is_active?: boolean;
    amount?: string | number;
    is_closed?: boolean;
}
