# 🎓 Dutch Exam Training Platform

A modern web application for Dutch high school students to practice VWO Wiskunde B exam questions with AI-powered evaluation and personalized feedback.

[![CI](https://github.com/AafVos/exam-training-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/AafVos/exam-training-platform/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Azure](https://img.shields.io/badge/Azure-0078D4?style=flat&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)

## 🎯 Project Vision

This platform addresses the gap in affordable exam preparation for Dutch students by providing:

- **AI-Powered Evaluation**: Automated checking of mathematical solutions using Azure AI Foundry
- **Personalized Learning**: Tag-based skill tracking across 260+ mathematical concepts
- **Authentic Practice**: Real exam questions from previous VWO Wiskunde B exams
- **Multi-Modal Input**: Support for photo uploads, text input, and LaTeX expressions
- **Progress Tracking**: Detailed analytics on student performance per skill area

## 🚀 Tech Stack

### Frontend
- **Next.js 14+** with App Router and TypeScript
- **Tailwind CSS** for styling
- **Radix UI** for accessible component primitives
- **Zustand** for state management
- **KaTeX** for mathematical notation rendering

### Backend
- **Next.js API Routes** (serverless)
- **Azure Cosmos DB** with direct SQL API integration for data storage
- **Azure AI Foundry** for question categorization and answer evaluation
- **Azure Blob Storage** for file uploads
- **Azure Cosmos DB SDK** for type-safe database operations

### Development & Deployment
- **TypeScript** with strict configuration
- **Jest** + Testing Library for unit testing
- **ESLint** for code quality
- **GitHub Actions** for CI/CD
- **Vercel** for deployment
- **Docker** for local development

## 📋 Features (V0 MVP)

### For Students
- [x] Account creation and authentication
- [x] Practice session with random questions
- [x] Multi-modal answer submission (photo/text/LaTeX)
- [x] AI-powered answer evaluation
- [x] Per-tag performance scoring
- [x] Answer history tracking

### For Administrators  
- [x] PDF upload for exam questions and answers
- [x] Automatic question extraction and categorization
- [x] Tag management system
- [x] Student progress monitoring

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                    # Base UI components (Radix UI)
│   ├── forms/                 # Form components
│   ├── math/                  # Math-specific components (LaTeX)
│   ├── layout/                # Layout components
│   ├── question/              # Question display and interaction
│   ├── progress/              # Progress tracking
│   └── admin/                 # Admin portal components
├── app/
│   ├── api/                   # Next.js API routes
│   ├── auth/                  # Authentication pages
│   ├── dashboard/             # Student dashboard
│   ├── practice/              # Practice session pages
│   └── admin/                 # Admin portal
├── hooks/                     # Custom React hooks
├── stores/                    # Zustand state stores
├── services/                  # API service layer
├── utils/                     # Utility functions
└── types/                     # TypeScript definitions
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Azure account (for cloud services)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/AafVos/exam-training-platform.git
   cd exam-training-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Azure credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Development

```bash
# Start with Docker Compose
npm run docker:up

# Stop containers
npm run docker:down
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📊 Database Schema

The application uses Azure Cosmos DB with direct SDK integration and the following main models:

- **User**: Student and admin accounts with email verification
- **Question**: Exam questions with metadata and AI-assigned tags
- **Answer**: Official answers with point allocation criteria
- **StudentAnswer**: Student submissions and AI evaluations
- **UserProgress**: Per-tag performance tracking with binary scoring

## 🔧 Configuration

### Environment Variables

```bash
# Database
AZURE_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
AZURE_COSMOS_KEY=your-cosmos-key
AZURE_COSMOS_DATABASE=projectAaf

# AI Services  
AZURE_AI_ENDPOINT=your-ai-endpoint
AZURE_AI_KEY=your-ai-key
AZURE_AI_DEPLOYMENT=your-deployment-name

# Storage
AZURE_STORAGE_CONNECTION_STRING=your-storage-connection

# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=your-app-url
```

## 🤝 Contributing

This project is part of a portfolio and learning exercise. While not actively seeking contributors, feel free to:

- Report bugs via GitHub Issues
- Suggest improvements
- Fork for your own educational use

## 📚 Learning Resources

This project demonstrates:

- **Full-stack TypeScript development**
- **Modern React patterns with Next.js 14+**
- **Azure cloud integration**
- **AI/ML integration for education**
- **Database design for educational platforms**
- **CI/CD with GitHub Actions**

## 📄 License

This project is for educational purposes. See [LICENSE](LICENSE) for details.

## 🙋‍♂️ Author

**AafVos** - [GitHub](https://github.com/AafVos)

Built as part of a comprehensive full-stack development portfolio, showcasing modern web development practices and cloud integration.

---

*This project aims to make quality exam preparation accessible to all Dutch students, regardless of economic background.*