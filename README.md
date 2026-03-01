# FinSight - Financial Insight Toolkit

FinSight is a React and TypeScript application aimed at providing smart, user-friendly financial calculators and insights.

## Features

### Home Loan EMI Calculator
A sophisticated, responsive, and mobile-friendly Home Loan EMI Calculator that provides detailed amortization schedules.

**Key Capabilities:**
- **Dynamic EMI Calculation:** Instantly calculates your Base Monthly EMI, Total Interest, and Total Amount Payable based on Principal, Interest Rate, and Tenure.
- **Indian Currency Formatting:** Automatically formats large numbers utilizing the Indian numbering system (e.g., 35,00,000) as you type.
- **Advanced Prepayment Options:**
  - **Monthly Prepayment:** Factor in extra money paid alongside your EMI every month.
  - **Yearly Prepayment:** Factor in an annual lump-sum payment (applied dynamically every 12th month).
- **Year-wise Amortization Schedule:** 
  - A collapsible, highly detailed accordion breaking down principal and interest metrics strictly by year.
  - Inside each year, view a detailed month-by-month table of payments explicitly mapping out interest, principal, and remaining balance.
  - Transparent tracking of when yearly prepayments are applied within the schedule.
- **Fully Responsive UI:** Built with Bootstrap 5. It presents cleanly on large monitors and automatically adapts into a horizontal-scrolling, touch-friendly interface on mobile devices.

## Tech Stack
- **React 18**
- **TypeScript**
- **Vite**
- **Bootstrap 5** (via CDN for UI components, tables, and responsiveness)

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## Configuration
The project uses Vite for lightning-fast builds and HMR. It is configured to build with `base: 'FinSight'` for simplified deployments to targeted directories or hosts like GitHub Pages.
