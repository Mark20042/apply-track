# ApplyTrack

ApplyTrack is an ultra-premium, modern, and open-source Job Application Tracker built to help professionals heavily organize and accelerate their job search process. Say goodbye to messy spreadsheets and hello to a centralized, intuitive dashboard that keeps your career progression clearly in sight.

Built with ❤️ for job seekers by Azoredev.

## Features

- **Premium Interface**: A sleek, fully mobile-responsive UI with stunning light and dark modes natively built-in using TailwindCSS and Shadcn over an Aceternity design.
- **Advanced Dashboard**: Track key metrics in real-time. View success rates, comprehensive status breakdowns, and historical 7-day activity graphs seamlessly integrated.
- **Card-Pop Modals**: Add or edit applications efficiently via premium "Card Pop" UI modals, organizing details (Core Details, Compensation Range, Location, Tasks) cleanly.
- **Organized Application Tasks**: Plan your next moves for an application—whether it's preparing for an interview or sending a thank-you note—right inside the application tracker.
- **Success Timeline**: Let ApplyTrack celebrate your victory! Once you mark an application as 'Accepted,' your Profile page updates with a beautiful timeline displaying your start date and new role.
- **Comprehensive API**: A secure Node.js / Express backend backed by MongoDB.

## Technologies

- **Frontend**: React (Vite), TailwindCSS, Shadcn, Recharts, Lucide-React
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth, Bcrypt

## Installation & Local Setup

### 1. Clone the repository
`git clone https://github.com/Azoredev/apply-track`

### 2. Backend Setup
- Navigate to `/server`
- Install dependencies: `npm install`
- Setup environment variables inside a `.env` file (e.g. `MONGO_URI`, `JWT_SECRET`)
- Start the server: `npm start` or `npm run dev` for nodemon

### 3. Frontend Setup
- Navigate to `/web`
- Install dependencies: `npm install`
- Setup environment variables inside a `.env` file (`VITE_API_URL=http://localhost:5000/api`)
- Start the development server: `npm run dev`

### 4. Open Application
Navigate to `http://localhost:5173` in your browser.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
