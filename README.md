# Backoffice Frontend

A modern React dashboard for Forth & Vale Leather business management.

## 🚀 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── contexts/      # React contexts (Auth, etc.)
├── api/          # API client functions
├── types/        # TypeScript type definitions
├── lib/          # Utility functions
└── data/         # Mock data and constants
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

This project is configured for Vercel deployment:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL` (points to backend API)

## 🔗 API Integration

The frontend connects to the backend API using the `VITE_API_URL` environment variable:

- **Development**: Uses default backend URL
- **Production**: Set `VITE_API_URL=https://your-backend-url.vercel.app/api`

## 👥 Demo Users

- `admin@forthvale.com` / `admin123` (Super User)
- `manager@forthvale.com` / `manager123` (User)
- `viewer@forthvale.com` / `viewer123` (Mini User)
