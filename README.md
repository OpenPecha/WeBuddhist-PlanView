# WeBuddhist Plan Viewer

This is the frontend application for the WeBuddhist Plan Viewer, designed to view the plans created for the WeBuddhist App.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:OpenPecha/WeBuddhist-PlanView.git
   ```

2. Navigate to app-plan-frontend directory:

   ```bash
   cd plan_frontend
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create your environment variables file:

   ```bash
   cp .env.example .env
   ```

## Development

1. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:5173](http://localhost:5173)

2. Run the test cases:
   ```bash
   npm run test
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Key Features

- Modern React-based frontend
- State management with React Query

## Tech Stack

- React 18
- React Router DOM
- Auth0 React
- React Query
- Vite

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).
