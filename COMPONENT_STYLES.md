# FleetFlow UI - Complete Component Styles

## 📦 Copy-Paste Ready CSS Classes

### 1. Page Layout
```css
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--dark);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-subtitle {
  color: var(--text-light);
  font-size: 1rem;
}
```

### 2. Stats Grid
```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid var(--primary);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.success { border-left-color: var(--secondary); }
.stat-card.danger { border-left-color: var(--danger); }
.stat-card.warning { border-left-color: var(--warning); }
.stat-card.info { border-left-color: var(--info); }

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--light);
}

.stat-label {
  color: var(--text-light);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--dark);
}

.stat-change {
  color: var(--text-light);
  font-size: 0.75rem;
  margin-top: 0.5rem;
}
```

### 3. Cards
```css
.card {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  margin-bottom: 2rem;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-size: 1.25rem;
  color: var(--dark);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-body {
  padding: 1.5rem;
}
```

### 4. Buttons
```css
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: var(--shadow);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary {
  background: var(--primary);
  color: var(--white);
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-success {
  background: var(--secondary);
  color: var(--white);
}

.btn-danger {
  background: var(--danger);
  color: var(--white);
}

.btn-warning {
  background: var(--warning);
  color: var(--white);
}

.btn-info {
  background: var(--info);
  color: var(--white);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}
```

### 5. Badges
```css
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-info {
  background: #e0f2fe;
  color: #075985;
}

.badge-primary {
  background: #dbeafe;
  color: #1e40af;
}
```

### 6. Tables
```css
table {
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
}

thead {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--white);
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}

tbody tr:hover {
  background: var(--light);
}

tbody tr:last-child td {
  border-bottom: none;
}
```

### 7. Form Elements
```css
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  color: var(--text);
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.875rem;
  transition: border-color 0.2s;
  background: var(--white);
  color: var(--text);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}
```

### 8. Modal
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: var(--white);
  border-radius: var(--radius-lg);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.25rem;
  color: var(--dark);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
```

### 9. Navigation
```css
.navbar {
  background: var(--white);
  padding: 1rem 2rem;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand h1 {
  font-size: 1.75rem;
  margin: 0;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-menu {
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
}

.nav-menu li a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  color: var(--text);
  text-decoration: none;
  border-radius: var(--radius);
  transition: all 0.2s;
  font-weight: 500;
}

.nav-menu li a:hover {
  background: var(--light);
  color: var(--primary);
}

.nav-menu li.active a {
  background: var(--primary);
  color: var(--white);
}
```

### 10. Utility Classes
```css
/* Flexbox */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.gap-1 {
  gap: 0.5rem;
}

.gap-2 {
  gap: 1rem;
}

/* Spacing */
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }

/* Text */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state-text {
  color: var(--text-light);
  font-size: 1rem;
}
```

### 11. Responsive Design
```css
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .nav-menu {
    flex-direction: column;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .modal {
    max-width: 100%;
  }
}
```

## 🎨 Body & App Styles
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}
```
