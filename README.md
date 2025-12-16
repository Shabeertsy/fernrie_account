# Fernrei Accounts - Billing & Management System

A modern billing and accounting management system built with React, TypeScript, and Tailwind CSS.

## Features

### 📊 Dashboard
- Real-time business metrics
- Revenue tracking
- Recent transactions
- Quick actions

### 💰 Billing Section
- Invoice management (Create, View, Edit)
- Status tracking (Paid, Pending, Overdue)
- Search and filter capabilities
- Financial statistics

### 🤝 Partners Management
- Partner directory
- Contact information management
- Status tracking (Active/Inactive)
- Add, Edit, Delete operations

### 👥 Clients Management
- Client portfolio
- Financial tracking per client:
  - Total Income
  - Total Expenses
  - Net Profit/Loss
  - Profit Margins
- Detailed client views with transaction history

### ✅ Todo List
- Task management
- Priority levels (High, Medium, Low)
- Categories (Billing, Partners, Clients)
- Due dates and completion tracking
- Filter by status

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Demo Credentials

### Admin Access
- **Email:** admin@fernrei.com
- **Password:** admin123

### User Access
- **Email:** user@fernrei.com
- **Password:** user123

## Remember Me Feature

The application supports "Remember Me" functionality:
- **Enabled:** Credentials stored in `localStorage` (persists across browser sessions)
- **Disabled:** Credentials stored in `sessionStorage` (clears when browser closes)

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── common/        # Reusable UI components
│   ├── dashboard/     # Dashboard-specific components
│   └── layout/        # Layout components (Sidebar, Header)
├── contexts/          # React contexts (Auth)
├── pages/             # Page components
│   ├── Billing.tsx
│   ├── Clients.tsx
│   ├── ClientDetails.tsx
│   ├── Dashboard.tsx
│   ├── Partners.tsx
│   ├── Todo.tsx
│   ├── Login.tsx
│   └── Settings.tsx
├── types/             # TypeScript type definitions
├── utils/             # Utility functions (auth, etc.)
└── App.tsx           # Main app component with routing
```

## Technology Stack

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **Charts:** Recharts
- **Animations:** Framer Motion

## Development

The application uses mock data for demonstration purposes. To connect to a real backend:

1. Update the API endpoints in `src/utils/auth.ts`
2. Replace mock data in page components with API calls
3. Configure your backend URL in environment variables

## Authentication Flow

1. User enters credentials on login page
2. System validates against mock credentials (replace with API call)
3. On success:
   - Access and refresh tokens are generated
   - User data is stored based on "Remember Me" selection
   - User is redirected to dashboard
4. Protected routes check authentication status
5. Auto-refresh token mechanism handles token expiration

## LocalStorage Keys

- `accessToken` - JWT access token
- `refreshToken` - JWT refresh token
- `user` - User profile data
- `rememberMe` - Remember me preference

## Future Enhancements

- [ ] PDF invoice generation
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Advanced analytics and reports
- [ ] Multi-currency support
- [ ] Role-based access control
- [ ] Export data to Excel/CSV
- [ ] Real-time notifications
- [ ] Mobile app

## License

© 2024 Fernrei Accounts. All rights reserved.

## Support

For support or questions, please contact: admin@fernrei.com
