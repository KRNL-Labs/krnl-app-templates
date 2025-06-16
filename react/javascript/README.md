# KRNL React (Vite) Starter

JavaScript variant of the KRNL React + Vite template. For full docs see `react/typescript/README.md` (steps are identical).

## Quick Start

```bash
npx degit react/javascript my-krnl-app

cd my-krnl-app

npm install
npm run dev
```

---

MIT License

This is a [React](https://reactjs.org) project bootstrapped with [Vite](https://vitejs.dev).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the application by modifying files in the `src` directory. The page auto-updates as you edit the files.

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_ENTRY_ID=your_entry_id
VITE_ACCESS_TOKEN=your_access_token
VITE_KERNEL_ID=your_kernel_id
VITE_RPC_KRNL=your_rpc_url
```

## Learn More

To learn more about the technologies used in this template:

- [React Documentation](https://react.dev) - learn about React features and API.
- [Vite Documentation](https://vitejs.dev/guide/) - learn about Vite features and configuration.
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework.
- [KRNL SDK](https://docs.krnl.xyz) - learn about KRNL SDK features and API.

## Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory, ready to be deployed.

To preview the production build locally:

```bash
npm run preview
```

## Deployment

You can deploy this React application to any static hosting service like:

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
