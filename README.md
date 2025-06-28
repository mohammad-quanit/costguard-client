# CostGuard - AWS Cost Protection Dashboard

> **AWS Lambda Hackathon Project** - A comprehensive AWS cost monitoring and alerting solution built for the AWS Lambda Hackathon, demonstrating serverless architecture and real-time cost management.

## 🏆 Hackathon Overview

This project was developed for the **AWS Lambda Hackathon**, showcasing:
- **Serverless Architecture**: Backend powered by AWS Lambda functions
- **Real-time Cost Monitoring**: Live AWS cost data integration
- **Modern Frontend**: React-based dashboard with real-time updates
- **Cost Optimization**: Proactive budget management and alerting

## 🚀 Project Overview

CostGuard is a modern, responsive web application that helps AWS users monitor their cloud spending, set budget alerts, and avoid surprise bills. The application provides real-time cost insights, budget tracking, and customizable notification preferences.

### Key Features

- **📊 Real-time Cost Dashboard**: Live AWS cost data with interactive charts
- **💰 Budget Management**: Set and track monthly spending limits
- **🔔 Smart Alerts**: Customizable notifications for budget thresholds
- **📈 Historical Analysis**: Monthly cost trends and utilization metrics
- **🌙 Dark/Light Mode**: Full theme customization
- **📱 Responsive Design**: Works seamlessly on all devices
- **⚡ Fast Performance**: Optimized with caching and lazy loading

## ☁️ AWS Services Used

### **Core AWS Services**
- **AWS Lambda** - Serverless backend compute functions for API processing
- **AWS API Gateway** - RESTful API endpoints for frontend-backend communication
- **AWS Cost Explorer API** - Real-time cost data retrieval and analysis
- **AWS Budgets API** - Budget management, tracking, and alerting
- **AWS IAM** - User permissions and access control for secure API access
- **AWS DynamoDB** - User account and preference storage (likely)

### **Required AWS Permissions**
Your AWS account needs the following IAM permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetUsageReport",
        "budgets:ViewBudget",
        "budgets:ModifyBudget",
        "iam:GetUser"
      ],
      "Resource": "*"
    }
  ]
}
```

### **Supported AWS Regions**
- `us-east-1` (N. Virginia)
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)
- `ap-southeast-1` (Singapore)
- All standard AWS regions

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development throughout
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Recharts** - Interactive data visualization
- **React Query (TanStack Query)** - Server state management with caching
- **React Router DOM** - Client-side routing and navigation
- **Lucide React** - Modern icon library

### Backend Integration
- **AWS Lambda** - Serverless compute functions
- **AWS API Gateway** - RESTful API endpoints
- **AWS Cost Explorer API** - Real-time cost data
- **AWS Budgets API** - Budget management

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **TypeScript Compiler** - Type checking and compilation

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **pnpm** - Fast, disk space efficient package manager
- **Git** - Version control
- **AWS Account** - With appropriate permissions for Cost Explorer and Budgets APIs

### Install pnpm
```bash
# Install pnpm globally
npm install -g pnpm

# Or using curl (recommended)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Verify installation
pnpm --version
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd costguard-client
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Alternative package managers
npm install
# or
yarn install
```

### 3. Environment Setup

Create environment configuration for your AWS backend:

```bash
# Create environment file (optional)
cp .env.example .env.local
```

Configure your AWS settings:
- **Development**: Uses Vite proxy to handle CORS
- **Production**: Direct API calls to your AWS Lambda endpoints

### 4. AWS Account Configuration

The application requires AWS account setup with proper credentials:

1. **AWS Access Keys**: You'll need Access Key ID and Secret Access Key
2. **IAM Permissions**: Ensure your AWS user has the required permissions listed above
3. **Account Alias**: A friendly name for your AWS account
4. **Region**: Your preferred AWS region

### 5. Start Development Server

```bash
# Using pnpm
pnpm dev

# Alternative commands
npm run dev
# or
yarn dev
```

The application will be available at: `http://localhost:8080`

### 6. Backend API Setup

Configure your AWS Lambda function endpoints. The application expects these API endpoints:

**Required Endpoints:**
```
POST /aws/validate-account  - Validate AWS credentials
GET  /aws/accounts         - Retrieve connected AWS accounts
GET  /aws/cost-usage       - Get cost and usage data
GET  /aws/budgets          - Retrieve budget information
POST /aws/budgets          - Create/update budgets
```

## 🏗 Project Structure

```
costguard-client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── CostChart.tsx   # Cost visualization charts
│   │   ├── DashboardCard.tsx # Metric display cards
│   │   ├── AWSAccountSelector.tsx # Account selection dropdown
│   │   ├── HeaderNav.tsx   # Navigation header
│   │   └── ...
│   ├── pages/              # Application pages
│   │   ├── Index.tsx       # Main dashboard
│   │   ├── AlertSettings.tsx # Budget & alert configuration
│   │   ├── Settings.tsx    # App preferences
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useCostData.ts  # Cost data fetching hook
│   │   ├── useAWSAccounts.ts # AWS account management
│   │   └── ...
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx # Authentication state
│   │   ├── AWSAccountContext.tsx # AWS account state
│   │   └── ...
│   ├── services/           # API service layer
│   │   ├── costService.ts  # Cost data transformation
│   │   ├── awsAccountService.ts # AWS account operations
│   │   └── ...
│   ├── lib/                # Utility libraries
│   │   └── api.ts          # HTTP client configuration
│   ├── types/              # TypeScript type definitions
│   │   └── api.ts          # API response types
│   └── ...
├── public/                 # Static assets
├── vite.config.ts         # Vite configuration with proxy
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

### API Proxy Configuration

The Vite development server can be configured with a proxy to handle CORS issues:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'YOUR_API_GATEWAY_URL',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
    secure: true
  }
}
```

### Environment Variables

The application automatically detects the environment:
- **Development**: Uses proxy endpoints (`/api/*`)
- **Production**: Uses direct AWS API Gateway URLs

## 📊 Features Deep Dive

### Dashboard
- **Real-time Metrics**: Current month spending, budget utilization, daily averages
- **Interactive Charts**: Monthly cost trends with budget comparisons
- **Service Breakdown**: Cost distribution across AWS services
- **Alert Status**: Current budget alerts and notifications

### Alert Settings
- **Budget Configuration**: Set monthly spending limits
- **Threshold Alerts**: Configure percentage-based warnings
- **Notification Preferences**: Email, SMS, and in-app notifications

### Settings
- **Theme Management**: Switch between light and dark modes
- **User Preferences**: Customize dashboard layout and data refresh intervals
- **AWS Account Management**: Add, remove, and configure AWS accounts

## 🚀 Deployment

### Production Deployment

For production deployment:

```bash
# Build the application
pnpm build

# The dist/ folder contains the production build
# Deploy to your preferred hosting platform (Vercel, Netlify, AWS S3, etc.)
```

### Build Commands

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 🧪 Testing

### Manual Testing

1. **Start the development server**: `pnpm dev`
2. **Open browser**: Navigate to `http://localhost:8080`
3. **Test API integration**: Check browser network tab for successful API calls
4. **Test features**: Navigate through dashboard, settings, and alert configuration

### API Testing

Test the API integration with your configured endpoints:

```bash
# Test the proxy endpoint
curl -X GET "http://localhost:8080/api/cost-usage"
```

## 🤝 Development Workflow

### Local Development

1. **Make changes** in your preferred IDE
2. **Test locally** with `pnpm dev`
3. **Commit and push** changes

### GitHub Codespaces

1. Navigate to the repository on GitHub
2. Click **Code** → **Codespaces** → **New codespace**
3. Develop directly in the browser-based IDE

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure the development server is running (`pnpm dev`)
- Check that the Vite proxy configuration is correct
- Verify the API endpoint is accessible

**API Connection Issues**
- The application includes fallback mock data
- Check browser console for detailed error messages
- Use the "Retry API" button in the error banner

**Build Issues**
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Clear Vite cache: `pnpm exec vite --force`

**pnpm Issues**
- Update pnpm: `pnpm add -g pnpm@latest`
- Clear pnpm cache: `pnpm store prune`

## 📈 Performance Optimization

The application includes several performance optimizations:

- **React Query Caching**: 5-minute cache for API responses
- **Automatic Refresh**: Data updates every 10 minutes
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Tree-shaking and code splitting
- **Responsive Images**: Optimized asset loading

## 🔒 Security Considerations

- **API Security**: All API calls use HTTPS
- **CORS Handling**: Proper CORS configuration for cross-origin requests
- **Error Handling**: Sensitive information not exposed in error messages
- **Type Safety**: TypeScript ensures type safety throughout the application
- **AWS Credentials**: Never store AWS credentials in frontend code

## 🤝 Contributing

This project was developed for the AWS Lambda Hackathon. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the AWS Lambda Hackathon submission. Please refer to the hackathon guidelines for usage and distribution terms.

## 🏆 Hackathon Submission

**Project Name**: CostGuard - AWS Cost Protection Dashboard  
**Category**: AWS Lambda Hackathon  
**Team**: [Your Team Name]  
**Demo URL**: [Your Deployed Application URL]  
**Repository**: [This Repository URL]

### Hackathon Highlights

- ✅ **Serverless Architecture**: Fully serverless backend with AWS Lambda
- ✅ **Real-time Integration**: Live AWS cost data processing
- ✅ **Modern Frontend**: React-based responsive dashboard
- ✅ **Cost Optimization**: Proactive budget management
- ✅ **Production Ready**: Comprehensive error handling and fallbacks

---

**Built with ❤️ for the AWS Lambda Hackathon**
