export interface DashboardTransaction {
    id: number;
    type: string;
    amount: number;
    date: string;
    notes: string;
    image: string | null;
}

export interface DashboardStats {
    total_revenue: number;
    clients: {
        count: number;
        new: number;
    };
    partners: {
        count: number;
        new: number;
    };
    pending_tasks: {
        count: number;
        description: string;
    };
    income_vs_expense: {
        net_profit: number;
        income: number;
        expense: number;
    };
    recent_transactions: DashboardTransaction[];
}
