# Aryon Test

## Tech Stack

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- Vitest + Testing Library
- Zod
- React Hook Form
- Prettier & ESlint

## Prerequisites

- Node.js
- npm

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Iamsheye/savannah-test.git
cd savannah-test
```

2. Install all dependencies (both frontend and server):

```bash
 npm run install:all
```

3. Create a `.env` file in the `frontend` directory with the following variables:

```bash
VITE_API_URL=http://localhost:3001
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Testing

The project uses Vitest and Testing Library for testing. Run the test suite with:

```bash
npm run test
```

For coverage report:

```bash
npm run test:cov
```

Coverage reports will be generated in the `coverage` directory.

## Available Scripts

- `npm run dev` - Start both frontend and backend servers
- `npm run dev:auth` - Start both servers with authentication enabled
- `npm run build` - Build both frontend and backend
- `npm run test` - Run frontend tests
- `npm run test:cov` - Generate test coverage report
