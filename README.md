# Newton's Moon Cookies 🍪

Welcome to the official app for the best cookies this side of the Milky Way, baked fresh on the moon by Newton!

This is a full-stack React application powered by a Manifest backend. It showcases a simple e-commerce platform for a whimsical product.

## ✨ Features

- **User Authentication**: Customers and astronauts can sign up and log in.
- **Role-Based Access**: A special 'astronaut' role (that's Newton!) allows for creating and managing the cookie inventory.
- **Product Management**: Astronauts can add new cookies, including a name, description, price, inventory count, and a photo.
- **Feature-Aware UI**:
  - **Image Uploader**: A drag-and-drop interface for uploading cookie photos.
  - **Choice Selector**: A simple button group to manage the cookie's baking status (`dough`, `in the oven`, `ready for sale`).
- **Dynamic Inventory Display**: A public-facing gallery of all cookies ready for sale.
- **Automatic Admin Panel**: A complete admin dashboard is available at `/admin` for managing all data.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Frontend Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Backend

The backend is powered by Manifest and is automatically deployed. No local setup is required. You can access the live admin panel via the link on the landing page.

### Demo Credentials

- **Astronaut Account**:
  - **Email**: `newton@moon.inc`
  - **Password**: `password123`

- **Admin Panel**:
  - **URL**: [Your Backend URL]/admin
  - **Email**: `admin@manifest.build`
  - **Password**: `admin`
