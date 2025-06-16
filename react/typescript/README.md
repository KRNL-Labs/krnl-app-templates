# KRNL React (Vite) Starter

A minimal React + Vite template with first-class **KRNL** integration.

| Framework | Language | Folder |
|-----------|----------|--------|
| React (Vite) | JavaScript | `react/javascript` |
| React (Vite) | TypeScript | `react/typescript` |

## 🚀 Getting Started

```bash
npx degit react/typescript my-krnl-app

cd my-krnl-app

npm install
npm run dev
```
Vite launches the dev server (default `http://localhost:5173`).

## 🔖 Directory Layout

```
public/
src/
 ├─ components/
 │   └─ kernels/
 │       ├─ onchain/337/
 │       └─ offchain/
 ├─ mainContract/
 ├─ App.tsx
 └─ main.tsx
.env
```

## 🛠 Scripts

| command | purpose |
|---------|---------|
| `npm run dev` | start dev server |
| `npm run build` | prod bundle in `dist/` |
| `npm run preview` | preview prod build |

## 🗝 KRNL Details

`.env` is pre-populated with default Kernel / Entry / AccessToken / Contract / RPC. Update as required.

## 🆘 Common Issues

Same as in the root README (permissions, module resolution, etc.).

---

MIT License

This is a [React](https://reactjs.org) project bootstrapped with [Vite](https://vitejs.dev).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

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
