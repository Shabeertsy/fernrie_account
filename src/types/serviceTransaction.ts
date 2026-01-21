export interface ServiceTransaction {
    id: number;
    service: number;
    service_name: string;
    client_name: string;
    transaction_type: 'income' | 'expense';
    amount: string;
    status: 'advance' | 'settled' | 'other';
    notes: string | null;
    transaction_date: string;
    created_at: string;
    updated_at: string;
    added_by?: {
        id: number;
        username: string;
        email: string;
        first_name?: string;
        last_name?: string;
        person_name?: string;
    };
    image?: string;
    transaction_time?: string;
}

export interface CreateServiceTransactionData {
    service: number;
    transaction_type: 'income' | 'expense';
    amount: string | number;
    status?: 'advance' | 'settled' | 'other';
    notes?: string;
    image?: File;
    transaction_date?: string;
    transaction_time?: string;
}

export interface UpdateServiceTransactionData {
    transaction_type?: 'income' | 'expense';
    amount?: string | number;
    status?: 'advance' | 'settled' | 'other';
    notes?: string;
}
