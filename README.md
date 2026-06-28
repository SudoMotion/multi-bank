# Laravel + Inertia + React Boilerplate

A production-ready starter for building full-stack applications with **Laravel**, **Inertia.js**, and **React**. Includes a public marketing site, a permission-based admin panel, reusable UI components, and common modules pre-wired so you can focus on your product.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 13, PHP 8.3+ |
| Frontend | React 18, Inertia.js v2 |
| Styling | Tailwind CSS 3 |
| Build | Vite 8 |
| Auth | Laravel Breeze (React stack) |
| Permissions | Spatie Laravel Permission |
| Routes (JS) | Ziggy |

## Features

### Public website
- Responsive layout with navbar and footer
- **Home** — hero, services, about preview, CTA
- **About Us** — content managed from admin
- **Contact Us** — form with settings-driven contact info and Google Maps embed

### Admin panel (`/admin`)
- Fixed topbar, sidebar, and footer layout
- **Dashboard**
- **About Us** — single-page content (title, description, image, status)
- **Settings** — app name, logo, favicon, email, phone, address, map embed, social links
- **Access Control** (dropdown)
  - Users — CRUD with role assignment
  - Roles — create and manage roles
  - Permissions — assign permissions per role (page-level)

### RBAC
- Superadmin role with full access (Gate bypass)
- Granular permissions per module (`view`, `create`, `edit`, `delete`, `update`)
- Sidebar and routes filtered by permission
- Seeded permissions and default superadmin user

### UI component library
Reusable form and layout components under `resources/js/Components/UI/`:

`Input`, `Select`, `Textarea`, `FileInput`, `Button`, `Card`, `Alert`, `Checkbox`, `Radio`, action buttons (`AddAction`, `RemoveAction`, `EditAction`, `DeleteAction`, etc.)

### Shared site data
Logo, favicon (falls back to logo), contact info, and social links are shared via Inertia and used on both frontend and admin.

## Requirements

- PHP 8.3+
- Composer
- Node.js 18+ and npm
- MySQL (or compatible database)

## Installation

```bash
# Clone the repository
git clone <your-repo-url> my-project
cd my-project

# Install PHP dependencies
composer install

# Environment
cp .env.example .env
php artisan key:generate

# Configure .env (database, app URL, mail, etc.)
# DB_DATABASE=...
# APP_URL=http://localhost

# Database
php artisan migrate
php artisan db:seed

# Storage link (required for logo/favicon/uploads)
php artisan storage:link

# Install frontend dependencies
npm install

# Run development servers
composer dev
# Or separately:
# php artisan serve
# npm run dev
```

Visit:
- **Frontend:** `http://localhost:8000`
- **Admin:** `http://localhost:8000/admin/login`

### Default admin credentials

| Field | Value |
|-------|-------|
| Email | `admin@gmail.com` |
| Password | `123456789` |

Change these immediately after first login in production.

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/          # Admin module controllers
│   │   ├── Frontend/       # Public site controllers
│   │   └── Auth/           # Breeze auth controllers
│   ├── Middleware/
│   └── Requests/
├── Models/
└── Support/
    ├── Permissions.php     # Permission definitions
    ├── SiteData.php        # Shared site settings helper
    └── GoogleMapEmbed.php

resources/js/
├── Components/
│   ├── UI/                 # Reusable form & UI components
│   ├── Admin/              # Admin-specific components
│   └── Frontend/           # Frontend-specific components
├── Layouts/
│   ├── Admin/              # Admin layout (topbar, sidebar, footer)
│   └── Frontend/           # Public site layout
├── Pages/
│   ├── Admin/              # Admin Inertia pages (module folders)
│   ├── Frontend/           # Public Inertia pages
│   └── Auth/               # Login, register, etc.
├── hooks/
│   └── useCan.js           # Permission check hook
└── app.jsx                 # Inertia entry point

routes/
├── web.php                 # Public routes
└── admin.php               # All /admin routes
```

## Routes

### Public

| Method | URI | Name |
|--------|-----|------|
| GET | `/` | `home` |
| GET | `/about` | `about` |
| GET | `/contact` | `contact` |
| POST | `/contact` | `contact.store` |

### Admin (prefix `/admin`)

| Area | Examples |
|------|----------|
| Auth | `/admin/login`, `/admin/register` |
| Dashboard | `/admin/dashboard` |
| About Us | `/admin/about-us` |
| Settings | `/admin/settings` |
| Users | `/admin/users` |
| Roles | `/admin/roles` |
| Permissions | `/admin/permissions` |

Legacy redirects: `/login` → `/admin/login`, `/dashboard` → `/admin/dashboard`.

## Permissions

Permissions are defined in `app/Support/Permissions.php`. After adding new permissions, re-seed:

```bash
php artisan db:seed --class=RolePermissionSeeder
```

Use in routes:

```php
Route::get('example', ...)->middleware('permission:example.view');
```

Use in React:

```jsx
import { useCan } from '@/hooks/useCan';

const can = useCan();
if (can('users.create')) { ... }
```

## Adding a New Admin Module

1. Create migration, model, and controller under `app/Http/Controllers/Admin/`
2. Add form requests in `app/Http/Requests/Admin/`
3. Register routes in `routes/admin.php` with permission middleware
4. Add permissions to `app/Support/Permissions.php` and re-seed
5. Create pages under `resources/js/Pages/Admin/YourModule/`
6. Add sidebar link in `resources/js/Layouts/Admin/AdminSidebar.jsx`

## UI Conventions

- Form pages use `AdminForm` and `AdminFormGrid` for consistent full-width responsive grids
- Page padding: `px-2 md:px-4` on admin content
- Status fields should be placed **last** in forms
- Use components from `@/Components/UI` instead of raw HTML for forms

## Build for Production

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Testing

```bash
php artisan test
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
