# User Management CRUD App

A modern **User Management web application** built with **Angular 20** and **TypeScript**.  
This project demonstrates best practices in Angular development including **feature-based architecture, reusable components, reactive programming, search optimization, and pagination handling**.

## 🎯 Features

- **User Management (CRUD)**: Create, read, update, and delete user records
- **Users Listing**: Display users in a structured table
- **Search Functionality**: Real-time search with debounced input for performance optimization
- **Pagination**: Navigate large datasets efficiently
- **Responsive Design**: Clean UI built with TailwindCSS
- **Reusable Components**: Shared components for search input and UI elements
- **Custom Validators**: Reusable form validation logic
- **Image Upload (UI Only)**: Image input with preview when adding a user (not sent to API)
- **Feature-Based Architecture**: Scalable project structure separating core, shared, and feature modules
- **Error Handling**: Structured service layer for API communication

## 🛠 Tech Stack

### Frontend Framework

- **Angular 20** – Modern Angular framework with standalone architecture
- **TypeScript** – Type-safe programming
- **TailwindCSS** – Utility-first CSS framework

### UI Components & Libraries

- **PrimeNG** – UI component library for Angular
- **PrimeIcons** – Icons used by PrimeNG components
- **Font Awesome** – Additional icon library

### State Management & Data

- **RxJS** – Reactive programming with observables

### Styling & Build Tools

- **TailwindCSS**
- **PostCSS**

### Development & Testing

- **Angular CLI 20** – Development and build tool
- **Karma** – Test runner
- **Jasmine** – Unit testing framework


## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** (v10 or higher)
- A modern web browser

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd E-commerce-project
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   > Note: We use `--legacy-peer-deps` flag due to some peer dependency conflicts

## 💻 Development Server

Start the development server:

```bash
npm start
```

or

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## 🏗 Building

### Development Build

```bash
ng build --configuration development
```

### Production Build

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Build with Watch Mode

```bash
npm run watch
```

## ✅ Testing

### Run Unit Tests

```bash
npm test
```

Unit tests are executed with [Karma](https://karma-runner.github.io) test runner. Tests are located in `*.spec.ts` files throughout the project.


📁 Project Structure
src
│
├── app
│   │
│   ├── core
│   │   ├── constants       # Application constants
│   │   ├── interceptors    # HTTP interceptors (API handling, errors, etc.)
│   │   ├── layouts
│   │   │   └── default-layout  # Main application layout
│   │   ├── models          # Global interfaces and types
│   │   ├── services        # Core services used across the app
│   │   └── validators      # Custom form validators
│   │
│   ├── features
│   │   │
│   │   ├── users           # Users feature module
│   │   │   ├── components  # Reusable UI components for users
│   │   │   └── pages
│   │   │        ├── users  # Users list page
│   │   │        └── add    # Add/Edit user page
│   │   │
│   │   └── not-found       # 404 page
│   │
│   ├── shared
│   │   ├── components      # Shared reusable components
│   │   └── directives      # Shared custom directives
│   │
│   ├── app.config.ts       # Angular app configuration
│   ├── app.routes.ts       # Application routing
│   └── app.ts              # Root component
│
└── assets

This structure follows a feature-based architecture that improves maintainability and scalability.


## 🚀 Deployment

### Vercel Deployment

The project is configured for deployment on Vercel with the following settings:

- **Build Command**: `npm run build -- --configuration=production`
- **Output Directory**: `dist/my-angular-app/browser`
- **Install Command**: `npm install --legacy-peer-deps`

### Deploy to Vercel

```bash
vercel
```

### Environment Variables

Create a `.env.local` file for local development with necessary environment variables:

```
NG_APP_API_URL=https://dummyapi.io/data/v1/


## ⚠️ Notes

The image input in the form is not connected to the API.

Images are not stored or retrieved from the backend.

The image feature is implemented only for UI preview purposes.
