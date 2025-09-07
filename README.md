# VoicePay: Voice-Activated Payment System

![VoicePay Logo](./Frontend/public/voicepay-logo.png)

## Overview
VoicePay is a modern web application that simplifies the payment process by integrating voice commands. Users can navigate the interface, initiate transactions, and confirm payments using their voice, offering a hands-free and accessible financial experience. The project is built with a Python Flask backend and a React frontend.

## Features
- **Secure User Authentication:** Safe and secure user login and registration system.
- **Voice-Powered Navigation:** Control the application dashboard and navigate to different pages using voice commands.
- **Voice-Initiated Transactions:** Start a payment process by simply speaking the command.
- **Voice Confirmation:** Enhance security and convenience by confirming final payments through a voice prompt.
- **Interactive User Interface:** A clean and modern UI built with React that provides real-time feedback for voice commands.
- **Transaction History:** View a list of past transactions.

## Tech Stack

### Backend
- **Python:** Core programming language.
- **Flask:** A lightweight web framework for building the API.
- **SQLAlchemy:** For database object-relational mapping (ORM).
- **SQLite:** The database used for storing user and transaction data.

### Frontend
- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast frontend build tool.
- **Web Speech API:** Used for browser-based speech recognition and synthesis.
- **CSS Modules:** For locally scoped CSS.

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites
- Python 3.10+
- Node.js and npm (or yarn)
- Git

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/RishabhRawat12/VoicePay.git](https://github.com/RishabhRawat12/VoicePay.git)
    cd VoicePay
    ```

2.  **Setup the Python Backend:**
    - Create and activate a virtual environment:
      ```sh
      # For Windows
      python -m venv venv
      .\venv\Scripts\activate

      # For macOS/Linux
      python3 -m venv venv
      source venv/bin/activate
      ```
    - Install the required Python packages:
      ```sh
      pip install Flask Flask-SQLAlchemy Flask-Cors
      ```
    - Initialize the database:
      ```sh
      python create_tables.py
      ```

3.  **Setup the React Frontend:**
    - Navigate to the frontend directory:
      ```sh
      cd Frontend
      ```
    - Install the required npm packages:
      ```sh
      npm install
      ```

### Running the Application

1.  **Start the Flask Backend Server:**
    - Make sure you are in the root `VoicePay` directory.
    - Run the Flask app:
      ```sh
      flask run
      ```
    - The backend will be running on `http://127.0.0.1:5000`.

2.  **Start the React Frontend Development Server:**
    - Open a **new terminal** and navigate to the `Frontend` directory.
    - Run the Vite development server:
      ```sh
      npm run dev
      ```
    - The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy). Open this URL in your browser.

*Note: You may need to grant your browser permission to access your microphone for the voice features to work.*
