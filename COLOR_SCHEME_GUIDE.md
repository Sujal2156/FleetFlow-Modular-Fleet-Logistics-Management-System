# FleetFlow UI - Color Scheme & Design System

## 🎨 Primary Color Palette

### Main Colors
```css
--primary: #2563eb          /* Bright Blue - Primary actions, links */
--primary-dark: #1d4ed8     /* Dark Blue - Hover states, headers */
--primary-light: #3b82f6    /* Light Blue - Highlights */
```

**Usage:** Navigation bar, primary buttons, active states, main headings

---

## 🎯 Status & Feedback Colors

### Success
```css
--secondary: #10b981         /* Green - Success states */
```
**Usage:** Completed status, success messages, positive metrics

### Danger/Error
```css
--danger: #ef4444            /* Red - Errors, deletions */
```
**Usage:** Delete buttons, error messages, critical alerts, expired licenses

### Warning
```css
--warning: #f59e0b           /* Orange/Amber - Warnings */
```
**Usage:** Warning badges, in-progress status, moderate priority

### Info
```css
--info: #06b6d4              /* Cyan - Informational */
```
**Usage:** Info badges, scheduled status, data visualization

---

## 🖤 Neutral Colors

### Text Colors
```css
--dark: #1f2937              /* Dark Gray - Headings */
--text: #374151              /* Medium Gray - Body text */
--text-light: #6b7280        /* Light Gray - Secondary text, labels */
```

### Background Colors
```css
--white: #ffffff             /* White - Cards, containers */
--light: #f3f4f6             /* Off-White/Light Gray - Backgrounds */
```

### Borders
```css
--border: #e5e7eb            /* Light Gray - Borders, dividers */
```

---

## 🎭 Effects & Shadows

### Box Shadows
```css
--shadow: 0 1px 3px rgba(0, 0, 0, 0.1)          /* Subtle shadow */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)       /* Medium shadow */
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)     /* Large shadow - cards */
```

### Border Radius
```css
--radius: 8px                /* Standard radius - buttons, inputs */
--radius-lg: 12px            /* Large radius - cards */
```

---

## 📊 Component-Specific Colors

### Gradient Background (Body)
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
**Purple gradient from top-left to bottom-right**

### Navigation Bar
```css
background: var(--white)     /* #ffffff */
```

### Stat Cards
```css
/* Default */
background: var(--white)
border-left: 4px solid var(--primary)    /* #2563eb */

/* Success variant */
border-left: 4px solid var(--secondary)  /* #10b981 */

/* Warning variant */
border-left: 4px solid var(--warning)    /* #f59e0b */

/* Danger variant */
border-left: 4px solid var(--danger)     /* #ef4444 */

/* Info variant */
border-left: 4px solid var(--info)       /* #06b6d4 */
```

---

## 🔘 Button Colors

### Primary Button
```css
background: var(--primary)               /* #2563eb */
color: var(--white)                      /* #ffffff */
hover: background: var(--primary-dark)   /* #1d4ed8 */
```

### Success Button
```css
background: var(--secondary)             /* #10b981 */
color: var(--white)
```

### Danger Button
```css
background: var(--danger)                /* #ef4444 */
color: var(--white)
```

### Info Button
```css
background: var(--info)                  /* #06b6d4 */
color: var(--white)
```

### Warning Button
```css
background: var(--warning)               /* #f59e0b */
color: var(--white)
```

---

## 🏷️ Badge Colors

### Success Badge
```css
background: #d1fae5          /* Light green background */
color: #065f46               /* Dark green text */
```

### Danger Badge
```css
background: #fee2e2          /* Light red background */
color: #991b1b               /* Dark red text */
```

### Warning Badge
```css
background: #fef3c7          /* Light yellow background */
color: #92400e               /* Dark brown text */
```

### Info Badge
```css
background: #e0f2fe          /* Light blue background */
color: #075985               /* Dark blue text */
```

### Primary Badge
```css
background: #dbeafe          /* Light blue background */
color: #1e40af               /* Dark blue text */
```

---

## 📋 Table Styling

### Table Header
```css
background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)
/* Gradient: #2563eb to #1d4ed8 */
color: var(--white)          /* #ffffff */
```

### Table Rows
```css
background: var(--white)                 /* #ffffff */
border-bottom: 1px solid var(--border)   /* #e5e7eb */
hover: background: var(--light)          /* #f3f4f6 */
```

---

## 🎴 Card Styling

```css
background: var(--white)                 /* #ffffff */
border-radius: var(--radius-lg)          /* 12px */
box-shadow: var(--shadow-lg)             /* 0 10px 15px rgba(0, 0, 0, 0.1) */
border: 1px solid var(--border)          /* #e5e7eb */
```

---

## 📝 Form Elements

### Input Fields
```css
background: var(--white)                 /* #ffffff */
border: 1px solid var(--border)          /* #e5e7eb */
color: var(--text)                       /* #374151 */
focus: border-color: var(--primary)      /* #2563eb */
```

### Labels
```css
color: var(--text)                       /* #374151 */
font-weight: 500
```

---

## 🎯 Quick Reference - Hex Codes Only

| Color Name      | Hex Code  | RGB              |
|-----------------|-----------|------------------|
| Primary Blue    | #2563eb   | rgb(37, 99, 235) |
| Primary Dark    | #1d4ed8   | rgb(29, 78, 216) |
| Primary Light   | #3b82f6   | rgb(59, 130, 246)|
| Success Green   | #10b981   | rgb(16, 185, 129)|
| Danger Red      | #ef4444   | rgb(239, 68, 68) |
| Warning Orange  | #f59e0b   | rgb(245, 158, 11)|
| Info Cyan       | #06b6d4   | rgb(6, 182, 212) |
| Dark Gray       | #1f2937   | rgb(31, 41, 55)  |
| Text Gray       | #374151   | rgb(55, 65, 81)  |
| Light Gray      | #6b7280   | rgb(107, 114, 128)|
| White           | #ffffff   | rgb(255, 255, 255)|
| Background      | #f3f4f6   | rgb(243, 244, 246)|
| Border          | #e5e7eb   | rgb(229, 231, 235)|

---

## 🌈 Gradient Backgrounds

### Body Gradient (Purple Theme)
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Alternative Gradient Options

**Blue Gradient:**
```css
background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
```

**Green Gradient:**
```css
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

---

## 💡 Usage Guidelines

### Color Contrast (WCAG AA Compliance)
- **Text on White:** Use `--text (#374151)` or darker
- **White text:** Only on `--primary`, `--danger`, `--warning`, `--info`, `--secondary`
- **Links:** Use `--primary (#2563eb)` with underline on hover

### Consistency Rules
1. **Primary actions** → Blue (`--primary`)
2. **Destructive actions** → Red (`--danger`)
3. **Success states** → Green (`--secondary`)
4. **Warnings/In-progress** → Orange/Amber (`--warning`)
5. **Informational** → Cyan (`--info`)

### Spacing & Layout
- **Border Radius:** 8px (small), 12px (large)
- **Shadows:** Use sparingly - only on cards and modals
- **Borders:** 1px solid `--border` for dividers

---

## 📦 Copy-Paste CSS Variables

```css
:root {
  /* Primary Colors */
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --primary-light: #3b82f6;
  
  /* Status Colors */
  --secondary: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #06b6d4;
  
  /* Neutral Colors */
  --dark: #1f2937;
  --text: #374151;
  --text-light: #6b7280;
  --white: #ffffff;
  --light: #f3f4f6;
  --border: #e5e7eb;
  
  /* Effects */
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --radius: 8px;
  --radius-lg: 12px;
}
```

---

## 🎨 Live Examples

### Stat Card - Success
```css
.stat-card.success {
  background: var(--white);
  border-left: 4px solid var(--secondary); /* #10b981 Green */
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
```

### Button - Primary
```css
.btn-primary {
  background: var(--primary); /* #2563eb */
  color: var(--white);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  background: var(--primary-dark); /* #1d4ed8 */
}
```

### Badge - Danger
```css
.badge-danger {
  background: #fee2e2;
  color: #991b1b;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
```

---

**Last Updated:** February 21, 2026  
**Project:** FleetFlow - Fleet Management System  
**Version:** 1.0.0
