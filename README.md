# BiblioDrop - Local Library Delivery System

A modern web application for managing library book deliveries, built with Next.js 16 and React 19.

## Features

- **Book Management** - Browse, search, and manage library books
- **Delivery Tracking** - Track book deliveries with real-time status updates
- **User Roles** - Admin, Librarian, and Reader dashboards
- **Authentication** - Email/Password, Google OAuth, and GitHub OAuth
- **Payment Processing** - Stripe integration for premium subscriptions
- **Reviews & Ratings** - User reviews for books
- **Reading Lists** - Personal reading list management
- **Image Upload** - IMGbb integration for book cover images

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.2.10 |
| **UI Library** | React 19.2.4 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | HeroUI (formerly NextUI) |
| **Database** | MongoDB with Mongoose 9.7.4 |
| **Authentication** | Better Auth 1.6.23 |
| **Payment** | Stripe 22.3.2 |
| **Animations** | Framer Motion 12.42.2 |
| **Forms** | React Hook Form 7.82.0 |
| **Charts** | Recharts 3.9.2 |
| **Icons** | Lucide React, React Icons |
| **Notifications** | Sonner, React Hot Toast |

## Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Stripe account (for payment features)
- IMGbb account (for image uploads)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name

# Better Auth
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# IMGbb (for image uploads)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Server URL (for API proxy)
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/assignment-10-bibliodrop-web.git
cd assignment-10-bibliodrop-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see above)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run server` | Start Express backend server |
| `npm run server:dev` | Start backend with file watching |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── books/             # Books listing
│   ├── contact/           # Contact page
│   ├── dashboard/         # Dashboard routes
│   │   ├── admin/         # Admin dashboard
│   │   ├── librarian/     # Librarian dashboard
│   │   └── reader/        # Reader dashboard
│   ├── login/             # Login page
│   ├── pricing/           # Pricing plans
│   ├── profile/           # User profile
│   ├── register/          # Registration
│   ├── settings/          # User settings
│   └── api/               # API routes
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   ├── books/             # Book-related components
│   ├── dashboard/         # Dashboard components
│   ├── Layout/            # Layout components
│   ├── profile/           # Profile components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── actions/           # Server actions
│   ├── api/               # API client functions
│   ├── auth.js            # Better Auth configuration
│   ├── mongodb.ts         # MongoDB connection
│   └── stripe.js          # Stripe configuration
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Key Features

### Authentication
- Email/Password authentication via Better Auth
- Social login with Google and GitHub
- Role-based access control (Admin, Librarian, Reader)

### Book Management
- CRUD operations for books
- Image upload via IMGbb
- Book categorization and search
- Pagination support

### Delivery System
- Delivery status tracking
- Delivery context for state management
- Real-time status updates

### Payments
- Stripe integration for subscriptions
- Premium user features
- Subscription management

## API Routes

The application uses Next.js API routes with proxy to an Express backend:

- `/api/books` - Book CRUD operations
- `/api/reviews` - Book reviews
- `/api/deliveries` - Delivery management
- `/api/reading-list` - User reading lists
- `/api/users` - User management
- `/api/upload` - Image uploads
- `/api/subscription` - Stripe subscriptions
- `/api/auth` - Authentication endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of Assignment-10 for Programming Hero's Web Development Course.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [HeroUI](https://heroui.com/) - UI Component Library
- [MongoDB](https://www.mongodb.com/) - Database
- [Stripe](https://stripe.com/) - Payment Processing
- [Better Auth](https://www.better-auth.com/) - Authentication
