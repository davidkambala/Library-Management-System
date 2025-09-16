# Library Management System

A simple Node.js + Express app with EJS views and a MySQL database for managing a small library (books, members, borrowing/returns). Repo languages: JavaScript, EJS, and CSS. 
GitHub

# ✨ Features

Basic library CRUD flows (add/list/update/remove entities like books/members).

Server-rendered UI using EJS templates under views/ (with partials/).

MySQL schema & queries stored in queries.sql for easy bootstrap.

Static assets (CSS/JS) in public/ (and/or css/ folders).
Repo contains index.js, package.json, queries.sql, views/, partials/, and static assets directories. 
GitHub

# 🧱 Tech Stack

Backend: Node.js + Express

Views: EJS (server-rendered)

Database: MySQL (schema/queries in queries.sql)

Styling/Assets: CSS served from public/ (and css/)

Languages breakdown on GitHub shows JavaScript, EJS, and CSS. 
GitHub

# 🗂️ Project Structure
Library-Management-System/
├─ index.js            # Express server entry
├─ package.json        # NPM scripts & dependencies
├─ queries.sql         # MySQL schema & helper queries
├─ views/              # EJS views (pages/layouts)
├─ partials/           # Shared EJS partials (header, footer, nav)
├─ public/             # Static assets (e.g., public/css, images)
├─ css/                # (If present) additional stylesheet folder
└─ .gitignore


Structure summarized from the repo file list on GitHub. 
GitHub

# ⚙️ Prerequisites

Node.js 18+ and npm

MySQL 8+ running locally (or a remote instance)

A database and user with privileges to create tables

# 🚀 Quick Start

# Clone & install

git clone https://github.com/davidkambala/Library-Management-System
cd Library-Management-System
npm install


# Create MySQL database

CREATE DATABASE library_mgmt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lib_user'@'localhost' IDENTIFIED BY 'strongpassword';
GRANT ALL PRIVILEGES ON library_mgmt.* TO 'lib_user'@'localhost';
FLUSH PRIVILEGES;


# Import schema/queries

# From the project root (adjust credentials as needed)
mysql -u lib_user -p library_mgmt < queries.sql


# Configure environment

Create a .env file in the project root:

DB_HOST=localhost
DB_USER=lib_user
DB_PASSWORD=strongpassword
DB_NAME=library_mgmt
DB_PORT=3306
PORT=3000


# Run the app

# If nodemon is installed:
npx nodemon index.js

# Or standard start:
node index.js
# App runs on http://localhost:${PORT:-3000}

# 🧭 How It Works (high level)
flowchart LR
    U[User] --> V[EJS Views (forms/tables)]
    V --> R[Express Routes]
    R --> DB[(MySQL)]
    DB --> R
    R --> V


Express routes handle requests and interact with MySQL (using SQL from queries.sql).

Responses are rendered via EJS templates in views/ (with shared partials for layout/navigation). 
GitHub

# 📜 Suggested NPM Scripts

If not already present, you can add:

{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "lint": "eslint ."
  }
}


Run dev server with hot reload:

npm run dev

# 🔒 Security & Prod Notes

Keep .env out of version control.

Use a least-privilege DB user.

In production, ensure PORT is read from process.env.PORT.

Use a connection pool and handle errors/timeouts.

Consider migrations (e.g., Prisma/Knex) if you plan to evolve schema.

# 🧪 Testing (optional)

Add a lightweight test framework (e.g., Jest) for route handlers.

Use a separate test database and seed fixtures.

# 🛣️ Roadmap

 Authentication for librarians vs. members

 Borrow/Return transactions (due dates, fines)

 Search & pagination for large catalogs

 CSV import/export for books/members

 Role-based access & activity audit

 Containerization (Dockerfile, docker-compose.yml)

# 🤝 Contributing

Fork the repo and create a feature branch.

Keep changes minimal and focused.

If you alter DB schema, update queries.sql.

Open a PR with a brief description and screenshots.

# 📄 License

MIT (or your preferred license). Add a LICENSE file if you want to formalize it.

Notes

The repo description and language composition come from the GitHub repository page and its file listing (e.g., index.js, package.json, queries.sql, views/, partials/, public/). 
GitHub

Want me to tailor DB tables & routes sections to the exact code (CRUD endpoints, SQL tables/columns)? If you grant me access to read file contents directly, I can document them precisely and add example requests/responses.
