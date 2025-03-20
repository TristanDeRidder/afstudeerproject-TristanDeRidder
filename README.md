# Fixit Aalst

## Overview
Fixit Aalst is a digital platform designed to streamline the repair process by replacing outdated paper-based tracking with an efficient, fully integrated system. The project consists of two main components:

- **Website**: A modern and user-friendly site where customers can find information and track their repair statuses.
- **Backoffice**: An administrative dashboard that allows staff to manage repairs, customers, and financial data.

## Technologies Used
- **Frontend**: [Remix](https://remix.run/) for a dynamic and interactive UI.
- **Backend**: [Strapi](https://strapi.io/) as a headless CMS for managing content and business logic.
- **Database**: PostgreSQL (hosted via Render).
- **Hosting**:
  - **Website**: Hosted on **Vercel** for automatic deployments.
  - **Backoffice**: Strapi hosted separately on **Render**.
- **Authentication**: JWT tokens for secure user and admin access.
- **Email Notifications**: **SendGrid** integration for automated emails.
- **API Handling**: Axios for consistent API requests.

## Features
### Website
- Modern, responsive design.
- Customers can easily access general and specific information.
- Dynamic content retrieval from Strapi, ensuring up-to-date information.
- Hosted on **Vercel**, enabling continuous deployment.
- Secure authentication for customer login and repair tracking.
- Contact form with email notifications powered by **SendGrid**.
- API responses structured for efficiency and consistency.

### Backoffice
- Centralized dashboard for managing repairs and customer interactions.
- Automated email notifications for repair status updates.
- Integrated financial overview with income calculations.
- Device and part inventory management.
- Role-based access control for different staff members.
- Hosted on **Render**, ensuring scalable performance.
- JWT authentication for secure admin access.
- Secure API communication using Axios.

## Installation & Setup
### Prerequisites
- Node.js (>= 16.x)
- PostgreSQL database

### Clone the Repository
```sh
git clone https://github.com/your-repo/fixit-aalst.git
cd fixit-aalst
```

### Backend (Strapi)
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables (create a `.env` file):
   ```env
   DATABASE_URL=your_database_url
   STRAPI_ADMIN_JWT_SECRET=your_secret
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```
4. Run the Strapi backend:
   ```sh
   npm run develop
   ```

### Frontend (Remix)
1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables (create a `.env` file):
   ```env
   NEXT_PUBLIC_API_URL=your_backend_url
   NEXT_PUBLIC_SENDGRID_EMAIL=your_email_address
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment
### Website (Vercel)
1. Push changes to GitHub.
2. Connect the repository to **Vercel**.
3. Configure environment variables in Vercel.
4. Deploy automatically on push.

### Backoffice (Render)
1. Deploy Strapi to **Render**.
2. Connect the PostgreSQL database.
3. Configure environment variables in **Render**.
4. Ensure authentication security with JWT tokens.

## Contribution
If you want to contribute:
1. Fork the repository.
2. Create a feature branch:
   ```sh
   git checkout -b feature-name
   ```
3. Commit changes:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```sh
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License.
