export interface ServiceTransaction {
    id: number;
    service: number;
    amount: string;
    status: 'advance' | 'settled' | 'other';
    notes: string | null;
    transaction_date: string;
    created_at: string;
    updated_at: string;
}

export interface CreateServiceTransactionData {
    service: number;
    amount: string | number;
    status?: 'advance' | 'settled' | 'other';
    notes?: string;
}

export interface UpdateServiceTransactionData {
    amount?: string | number;
    status?: 'advance' | 'settled' | 'other';
    notes?: string;
}
