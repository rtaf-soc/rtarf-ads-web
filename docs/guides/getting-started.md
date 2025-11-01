# Getting Started with RTARF ADS Web

This guide will help you get started with the RTARF ADS Web (Cybersecurity Dashboard) project.

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (comes with Node.js)
- **PostgreSQL**: Latest stable version
- **Git**: For version control

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rtarf-ads-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/rtarf_ads

# Authentication
JWT_SECRET=your-secret-key-here
AUTH_TOKEN_EXPIRY=3600

# API Configuration
API_BASE_URL=http://localhost:3000/api

# WebSocket Configuration
WEBSOCKET_URL=ws://localhost:3000/ws
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
rtarf-ads-web/
├── api/                    # API service modules
├── assets/                 # Static assets (images, styles)
├── components/             # Vue components
├── layouts/                # Nuxt layouts
├── middleware/             # Route middleware
├── pages/                  # Application pages/routes
├── plugins/                # Vue/Nuxt plugins
├── public/                 # Public static files
├── stores/                 # Pinia state stores
├── utils/                  # Utility functions
└── nuxt.config.ts          # Nuxt configuration

```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate` - Generate static site

## Key Features

1. **Threat Intelligence Dashboard**: Monitor threats in real-time
2. **Detection Rules**: Manage Sigma, Suricata, and YARA rules
3. **Device & CVE Monitoring**: Track vulnerabilities
4. **Admin Panel**: Manage users, API keys, and system settings

## Next Steps

- Read the [Authentication Setup](./authentication-setup.md) guide
- Learn about [Component Development](./component-development.md)
- Explore [State Management](./state-management.md) with Pinia
- Review [Deployment](./deployment.md) options
