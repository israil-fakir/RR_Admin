# RR Admin — RR Softech (Admin Panel)

[Live Demo](https://rr-techsoft.netlify.app) • [GitHub repository](https://github.com/Afsaruddin12133/RR_Admin)

---

> **Role:** Project Lead

---

## Demo credentials (use these on the live site)

- **Admin**  
  Email: `admin@gmail.com`  
  Password: `admin12345678`

- **Employee**  
  Email: `employee1@gmail.com`  
  Password: `emp12345678`

- **Customer**  
  Email: `customer1@gmail.com`  
  Password: `cust12345678`

---

## Elevator pitch

RR Admin is a responsive admin dashboard and user-facing interface built to manage RR Softech's services, users, orders, and payments. As project lead I coordinated a 4-person team, designed the frontend architecture, implemented role-based flows (admin, employee, customer), and shipped the app to Netlify.

---

## Key features

- Role-based authentication and protected routes (Admin / Employee / Customer).
- Responsive admin dashboard with CRUD operations for users, orders, and services.
- User-facing pages for browsing services and placing orders.
- Client-side form validation and toast notifications for user feedback.
- Deployment to Netlify for fast global delivery.

---

## Tech stack 

- **Frontend:** React (functional components + hooks)  
- **Language:** JavaScript (ES6+)  
- **Styling:** CSS / Tailwind CSS 
- **Build & Deploy:** Vite deployed on Netlify  


---

## Folder structure (typical / recommended)

```
src/
├── App.jsx
├── index.css
├── main.jsx
├── api/ (API calls & data fetching)
│   ├── auth.js
│   ├── admin/ (admin endpoints)
│   ├── employee/ (employee endpoints)
│   └── UserDashboard/ (user endpoints)
├── assets/ (static files)
├── components/ (reusable UI components)
│   ├── common/ (shared components - forms, modals, auth guards)
│   ├── layout/ (page layouts for admin & user dashboard)
│   └── shared/ (admin & user-specific shared components)
├── hooks/ (custom React hooks)
│   ├── admin/
│   └── UserDashboard/ (auth hook, custom logic)
├── pages/ (full page components)
│   ├── admin/ (admin panel pages - dashboard, analytics, services, etc.)
│   ├── employee/ (employee panel pages)
│   └── UserDashboard/ (customer pages - orders, services, payments, etc.)
├── routes/ (routing configuration)
├── utils/ (helper functions & constants)
│   ├── admin/ (admin utilities - menu items, tab configs)
│   └── UserDashboard/ (user utilities - auth helpers, services)
```

---

## Installation

```bash
# clone
git clone https://github.com/Afsaruddin12133/RR_Admin.git
cd RR_Admin

# install deps
npm install

# start dev server
npm run dev    # or `npm start` depending on project
```

**Build / production**

```bash
npm run build
npm run preview   # if using Vite
```

---
