# 🚔 SAPS Criminal Record Management System

A fullstack web application built for the **South African Police Service (SAPS)** to manage criminal suspects and their records. Built with the **PERN Stack** — PostgreSQL, Express, React and Node.js.

**Live Demo:** [saps-criminal-system.vercel.app](https://saps-criminal-system.vercel.app)  
 **Demo Login:** Username: `officer1` | Password: `password123`

## 📸 Screenshots

### Login

![Login](screenshots/login.png)

### Search Criminal Record

![Search](screenshots/search.png)

### Add New Suspect

![Add Suspect](screenshots/add-suspect.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Case Manager View

![Manager](screenshots/manager.png)

---

## Features

- **Secure Authentication** — JWT login with bcrypt password hashing
- **Suspect Management** — Add, search, edit and delete suspects
- **Criminal Records** — Add multiple records per suspect with offence, sentence, location and date
- **SA ID Validation** — Validates South African ID number format and date of birth
- **Auto Case Allocation** — Automatically assigns cases to the manager with the fewest cases (least-load algorithm)
- **Dashboard** — View all suspects ranked by offences with search, sorting and pagination
- **Case Manager View** — See all cases assigned to each manager
- **Case Status** — Track each record as Open, Pending or Closed
- **Print** — Print a suspect's full criminal record
- **Mobile Responsive** — Works on phones, tablets and desktops
- **Session Expiry** — Automatically redirects to login when session expires

---

## Tech Stack

### Frontend

| Technology
|
| React (Vite) | UI framework |
| React Router | Page navigation |
| Axios | API requests |
| CSS-in-JS | Styling |

### Backend

| Technology
|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| PostgreSQL | Database |
| bcryptjs | Password hashing |
| JSON Web Tokens | Authentication |
| node-postgres (pg) | Database connection |

### Deployment

| Service
|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Render PostgreSQL | Database hosting |

---

## 🗄️ Database Schema

---

## Key Technical Highlights

### JWT Authentication

Every protected route requires a valid JWT token. The token is generated on login, stored in localStorage and attached to every API request via an Axios interceptor. When the token expires the user is automatically redirected to the login page.

### Least-Load Case Allocation Algorithm

When a new criminal record is added the system automatically finds the case manager with the fewest cases and assigns the record to them. This ensures an even workload distribution across all managers.

```javascript
async function allocateCaseManager() {
  const result = await pool.query(
    `SELECT cm.manager_id, COUNT(cr.record_id) AS case_count
     FROM case_managers cm
     LEFT JOIN criminal_records cr ON cm.manager_id = cr.manager_id
     GROUP BY cm.manager_id
     ORDER BY case_count ASC
     LIMIT 1`,
  );
  return result.rows[0]?.manager_id;
}
```

### South African ID Validation

The system validates that the ID number is exactly 13 digits and that the first 6 digits represent a valid date of birth (YYMMDD format).

---

## Author

**Thabiso Dibaba**  
🌐 [github.com/TDibabacodes](https://github.com/TDibabacodes)
