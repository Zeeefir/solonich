# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Solonich

Public website: https://solonich.vercel.app/

The production build on Vercel serves the catalog from `src/data/products.json` and includes RU/KZ/EN translations. React routes are configured in `vercel.json`.

Local development reads the SQLite database. Run `npm run server` and `npm run dev -- --host 127.0.0.1 --port 5174 --strictPort` in separate terminals. See [LOCAL-DATABASE.md](LOCAL-DATABASE.md) for account setup, product management, backups, and tests.

Database contents, local administrator credentials, and sessions stay in the ignored `/data/` folder. An online database and public account service are not configured. `VITE_API_ENABLED=true` enables API-backed production builds only when a compatible backend has been deployed separately.

