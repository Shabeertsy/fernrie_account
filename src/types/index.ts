export interface Partner {
    id: number;
    name: string;
    email:string;
    person_name?: string; // Sometimes returned as person_name
}

export interface Member {
    id: number;
    name: string;
    gender: 'Male' | 'Female';
    dob: string;
    relationship: string;
    education: string;
    occupation: string;
    status: 'Active' | 'Inactive' | 'Moved' | 'Deceased';
}

export interface Family {
    id: number;
    headName: string;
    houseName: string;
    address: string;
    ward: string;
    mahalluNumber?: string;
    primaryPhone: string;
    alternatePhone?: string;
    incomeCategory: 'Low Income' | 'Middle Income' | 'High Income' | 'Exempted';
    housingType: 'Own House' | 'Rented' | 'Other';
    rationCardType: 'APL' | 'BPL' | 'AAY';
    status: 'Active' | 'Inactive';
    members: Member[];
}

export interface Transaction {
    id: string;
    familyId: number;
    familyName: string;
    type: string;
    amount: number;
    date: string;
    status: 'Success' | 'Pending' | 'Failed';
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    rememberMe: boolean;
}

export interface RegistrationField {
    id: string;
    label: string;
    fieldName: string;
    type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'number';
    category: 'family' | 'member';
    isMandatory: boolean;
    isEnabled: boolean;
    options?: string[]; // For select fields
}

export interface RegistrationConfig {
    familyFields: RegistrationField[];
    memberFields: RegistrationField[];
}

export type Permission = 'read' | 'write' | 'delete';

export interface NavigationPermission {
    path: string;
    label: string;
    permissions: Permission[];
}

export interface Role {
    id: string;
    name: string;
    description: string;
    navigationPermissions: NavigationPermission[];
    createdAt: string;
    updatedAt: string;
}


export interface UserWithRole extends User {
    roleId: string;
    roleName: string;
}

export interface CompanyTransaction {
    id: number;
    transaction_type: 'income' | 'expense';
    amount: string; // DecimalField comes as string usually, or number
    person: number | Partner | null; // ForeignKey to User
    person_name?: string; // If serializer provides it
    date_time: string;
    split_amount: boolean;
    image: string | null;
    notes: string | null;
    is_closed: boolean;
}

export interface PersonalTransaction {
    id: number;
    user: string;
    amount: string;
    created_at: string;
    notes: string;
    payment_date: string;
    payment_method: string;
    transaction: CompanyTransaction;
    updated_at: string;
    details?: any;
    is_completed: boolean;
    pending_balance: string | null;
}

export interface PersonalTransactionResponse {
    data: PersonalTransaction[];
    details: CompanyTransaction;
}

