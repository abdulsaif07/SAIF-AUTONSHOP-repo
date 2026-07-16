# Autonshop: Price Tracking & Discount Engine 🚀

Welcome to **Autonshop**, an intelligent, minimalist web application designed to help smart shoppers track prices, find the absolute lowest deals, and set automated price drop alerts across major e-commerce platforms like Amazon, Flipkart, Croma, and Reliance Digital.

---

## 1. Project Overview

### Purpose
Autonshop is a dedicated price tracking and discount discovery engine. It strips away the clutter of traditional e-commerce storefronts to focus purely on helping users find the best deals.

### Problem it Solves
Shoppers often have to manually check multiple websites to ensure they are getting the best price. Furthermore, they miss out on flash sales because they aren't monitoring the page. Autonshop solves this by instantly aggregating prices across stores, visualizing 30-day price trends, and offering an automated "Price Drop Alert" notification system.

### Key Features
- **Live Price Comparison:** Instantly compares a product's price across multiple retailers.
- **Smart Link Cleaner:** Paste any messy Amazon or Flipkart link (even shortlinks like `amzn.in/d/`), and the backend intelligently extracts the product ASIN/slug to find it.
- **AI Image Search:** Upload a photo, and the frontend uses TensorFlow to classify the object and search for it.
- **Price Drop Alerts:** Enter your email to be notified the moment a product drops below its current price.
- **Warm Minimalist UI:** A beautifully crafted, distraction-free interface featuring a custom "Charcoal Inversion" Dark Mode.
- **Premium Subscriptions:** Gated features allowing users to upgrade to premium for unlimited alerts.

### Target Users
Bargain hunters, tech enthusiasts, and everyday consumers looking to ensure they never overpay for a product online.

---

## 2. Technology Stack

### Frontend Technologies
- **React.js:** Core UI library.
- **React Router:** Client-side routing.
- **Recharts:** Used for rendering the 30-Day Price History area charts.
- **Lucide-react:** Modern, scalable SVG icons.
- **TensorFlow.js (@tensorflow-models/mobilenet):** On-device machine learning for image classification.
- **Vanilla CSS:** Custom-built "Warm Minimalist" design system utilizing CSS variables.

### Backend Technologies
- **Node.js & Express.js:** REST API architecture.
- **Axios:** For making outbound HTTP requests (and resolving shortlink redirects).
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB.

### Database
- **MongoDB:** NoSQL database used to persist user credentials and premium statuses.

### APIs and External Services
- **SerpApi (Google Shopping Engine):** Acts as the primary aggregator to fetch live product prices, thumbnails, and store links directly from Google's Shopping graph.

### Development Tools
- **Create React App:** Build pipeline and development server.
- **Dotenv:** Environment variable management.

---

## 3. Project Architecture

Autonshop utilizes a standard decoupled Client-Server architecture:

1. **Client Request:** The user interacts with the React frontend (e.g., searches for a product or pastes a link). 
2. **Backend Processing:** The Express backend receives the request. If the query is a URL, the `extractProductFromUrl` function uses Axios to resolve redirects and parse the pathname for ASINs/slugs.
3. **Caching Layer:** The backend checks an in-memory `Map` to see if the query was recently searched (5-minute TTL) to save API credits.
4. **External API Call:** If there's a cache miss, the backend requests live data from SerpApi.
5. **Data Normalization:** The backend formats the raw Google Shopping JSON into a standardized array of product objects, generating 30-day historical data and deal ratings.
6. **Response & Render:** The frontend receives the array, updates the state, and dynamically renders the `ProductCard` and `ProductDetail` components.

---

## 4. Folder Structure

```text
autonshop/
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets (index.html, manifest.json)
│   ├── src/                    
│   │   ├── components/         # Reusable React components
│   │   │   ├── Auth/           # Login & Signup forms
│   │   │   ├── Navbar.js       # Top navigation & theme toggler
│   │   │   ├── SearchBar.js    # Input for text, links, and image upload
│   │   │   ├── ProductCard.js  # Grid item displaying product summary
│   │   │   ├── ProductDetail.js# Detailed view, chart, and alert box
│   │   │   ├── SubscriptionDashboard.js # User profile and active alerts
│   │   │   └── ...             # Other modular components
│   │   ├── context/            
│   │   │   └── AuthContext.js  # Global state provider for User Authentication
│   │   ├── App.js              # Main routing and application layout
│   │   ├── App.css             # Global CSS defining the Warm Minimalist theme
│   │   └── index.js            # React entry point
│   ├── package.json            # Frontend dependencies
│   └── .env                    # Frontend environment variables
│
├── server/                     # Node.js/Express Backend Application
│   ├── models/                 
│   │   └── User.js             # Mongoose schema for user accounts
│   ├── routes/                 
│   │   └── auth.js             # JWT-based Authentication routes
│   ├── index.js                # Main Express server, search logic, and link cleaner
│   ├── package.json            # Backend dependencies
│   └── .env                    # Secret environment variables (DB, API Keys)
│
└── README.md                   # This documentation file
```

---

## 5. Installation Guide

### Prerequisites
- Node.js (v16 or higher)
- A MongoDB cluster (or local instance)
- A free SerpApi key (from serpapi.com)

### 1. Clone the repository
```bash
git clone https://github.com/abdulsaif07/SAIF-AUTONSHOP-repo.git
cd SAIF-AUTONSHOP-repo
```

### 2. Setup the Backend
```bash
cd server
npm install
```
Configure your environment variables (see Section 6), then start the backend:
```bash
node index.js
# Output: 🚀 Server started on port 5000
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd client
npm install
```
Start the React development server:
```bash
npm start
# Opens http://localhost:3001 in your browser
```

### 4. Build for Production
To generate a production-ready optimized bundle for the frontend:
```bash
cd client
npm run build
```

---

## 6. Environment Variables

> [!WARNING]  
> Never commit actual secret keys to version control. The values below are examples. Create a `.env` file in the root of the respective directories.

### Backend (`server/.env`)
| Variable | Description | Example Value (Do not use in prod) |
|----------|-------------|------------------------------------|
| `PORT` | The port the Express server runs on. | `5000` |
| `DB_URI` | MongoDB connection string. | `mongodb+srv://user:pass@cluster.mongodb.net/test` |
| `SERPAPI_KEY` | API key from SerpApi. | `5e6031d7c0...` |
| `JWT_SECRET` | Secret used to sign JSON Web Tokens. | `my_super_secret_key` |

---

## 7. Complete Usage Guide

### Core Workflows

1. **Searching for Deals:**
   - **Text:** Type "iPhone 15 Pro" into the search bar.
   - **Link:** Paste a direct URL (e.g., `https://amzn.in/d/0iulWpfx`). The backend will automatically extract the product name and find the lowest price.
   - **Image:** Click the camera icon in the search bar to upload a photo of an item. The on-device AI will identify it and search automatically.

2. **Setting a Price Drop Alert:**
   - Click on any product in the search results to open the `ProductDetail` view.
   - Scroll to the "Live Price Comparison" section.
   - In the "Get Price Drop Alerts" box, enter your email and click **Notify Me**.
   - The button will turn green and say "Chill karo! ✌️" indicating you are subscribed.

3. **Managing Subscriptions & Alerts:**
   - Click the "Premium" button in the Navbar.
   - Inside the `SubscriptionDashboard`, view your active subscription tier.
   - Under "Your Active Price Alerts", review the products you are tracking and click **Cancel Notification** to remove them.

---

## 8. API Documentation

### `GET /api/search`
Aggregates live product data from Google Shopping.
- **Query Parameters:**
  - `q` (string, required): The search term or a product URL.
- **Response Format:**
  ```json
  [
    {
      "title": "Apple iPhone 15 Pro",
      "price": "₹1,34,900",
      "raw_price": 134900,
      "image": "https://example.com/image.jpg",
      "link": "https://amazon.in/...",
      "source": "Amazon.in",
      "deal_rating": "Great Deal",
      "history": [{"day": "Day 30", "price": 138000}, ...]
    }
  ]
  ```

### `POST /api/auth/register`
Creates a new user account.
- **Request Body:** `{ "name": "John", "email": "john@example.com", "password": "password123" }`

### `POST /api/auth/login`
Authenticates a user.
- **Request Body:** `{ "email": "john@example.com", "password": "password123" }`
- **Response:** `{ "token": "jwt_string", "user": { ... } }`

---

## 9. Database Documentation

The application relies on MongoDB. The primary collection is **Users**.

### Users Collection (`User.js`)
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | User's full name. |
| `email` | String | Unique email address (used for login and alerts). |
| `password` | String | Bcrypt-hashed password. |
| `isPremium` | Boolean | Flags if the user has access to premium features (Default: `false`). |
| `createdAt` | Date | Timestamp of account creation. |

*(Note: Price Drop Alerts are currently persisted in the browser's `localStorage` to ensure a fast, frictionless experience for guests, but can easily be migrated to a `Alerts` DB collection in the future).*

---

## 10. Source Code Explanation

- **`client/src/App.js`**: The central brain of the frontend. Handles React Router logic, initializes the TensorFlow MobileNet model, and manages top-level state (like the master product list).
- **`client/src/components/ProductDetail.js`**: Renders the deep-dive view of a product. It dynamically generates the Recharts area chart and manages the inline Price Drop Alert email form.
- **`server/index.js`**: Contains the core business logic. Specifically, the `extractProductFromUrl` asynchronous function is a complex piece of engineering that uses Axios to follow shortlink redirects and RegEx/Path parsing to extract search queries from URLs.
- **`client/src/App.css`**: Defines the "Warm Minimalist" design system. It uses CSS variables (`--primary`, `--bg-color`) to easily toggle between Light Mode and the custom Charcoal Inverted Dark Mode.

---

## 11. Build and Deployment

### Frontend Deployment (Vercel / Netlify)
1. In `client/src`, update any API base URLs to point to your production backend (e.g., `https://api.autonshop.com`).
2. Run `npm run build`.
3. Drag and drop the `build/` folder into Netlify, or connect your GitHub repository to Vercel and set the build directory to `client`.

### Backend Deployment (Render / Heroku)
1. Push the repository to GitHub.
2. Connect the repository to Render (as a Web Service).
3. Set the Root Directory to `server`.
4. Add all environment variables (MongoDB URI, SerpApi Key) in the Render dashboard.
5. Deploy.

---

## 12. Troubleshooting

**Error:** `Network Error` or `Failed to fetch` on the frontend.
**Cause:** The frontend is trying to talk to the backend on `localhost:5000`, but the backend isn't running.
**Solution:** Ensure you opened a second terminal and ran `node index.js` inside the `server/` directory.

**Error:** Search returns `500 No results found`.
**Cause:** You may have exhausted your free SerpApi credits, or the API key is invalid.
**Solution:** Check your `.env` file and verify your dashboard on serpapi.com.

**Error:** Image search is stuck on "Analyzing...".
**Cause:** TensorFlow.js failed to download the MobileNet model due to strict corporate firewalls or ad-blockers.
**Solution:** Disable ad-blockers or try on a different network.

---

## 13. Security Notes

- **API Keys:** The `SERPAPI_KEY` must remain strictly on the backend. Do not leak this to the React frontend, as it can be easily scraped by malicious actors.
- **Authentication:** Passwords are mathematically hashed using `bcrypt` before being stored in MongoDB. Session management is handled securely via JSON Web Tokens (JWT).
- **Environment Variables:** Always use `.env` files and ensure `.env` is included in your `.gitignore` to prevent secret leaks on GitHub. (Note: A sample `.env` was committed once for demonstration purposes—ensure keys are rotated for production).

---

## 14. Future Improvements

- **Backend Cron Jobs:** Migrate the `localStorage` alerts to the MongoDB database and implement a Node-Cron job to run daily checks against tracked prices, hooking into an SMTP server to send actual emails.
- **OAuth Integration:** Add Google and Apple Sign-In to reduce friction for user registration.
- **More Store Integrations:** Bypass SerpApi for specific dominant retailers and build direct scrapers using Puppeteer for higher fidelity data.

---

## 15. License and Credits

Built with ❤️ for smart shoppers everywhere. 
This project is open-source and available under the MIT License. 

*Disclaimer: This tool is for educational purposes. Web scraping and automated data aggregation should comply with the Terms of Service of the respective retailers.*
