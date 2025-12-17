# Documentation

In client we have two screen:

/products: Sales Display (POS Screen)
+ Displays product list (Name, Price)
+ Adds products to shopping cart
+ Displays total amount
+ Payment button

/orders: Secondary Screen (Realtime Screen)
+ Displays the list of orders in realtime
+ Automatically updates (no reload required)
+ Each order displays: Order code, Total amount, Payment time

# Quick Start

### System Required
- Node.js 18.x+

### Clone repository
git clone <repo-url>

cd frontend

### Install dependencies
pnpm install

### Environment Variables
To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_API_BASE` = `https://localhost:7056`

### Run development server
pnpm run dev
