# KRNL Next.js (App Router) Starter

A production-ready Next.js template pre-wired for the **KRNL SDK**.

| Framework | Language | Folder |
|-----------|----------|--------|
| Next.js (App Router) | JavaScript | `nextjs/javascript` |
| Next.js (App Router) | TypeScript | `nextjs/typescript` |

## ✨ Quick Start

1. Generate the project (fork / template / degit):
   ```bash
   npx degit <repo>#nextjs/typescript my-krnl-app
   cd my-krnl-app
   ```
2. Install deps
   ```bash
   npm install        # or pnpm install / yarn
   ```
3. Configure KRNL values in `.env` (defaults are already included).
4. Launch dev server
   ```bash
   npm run dev
   ```
   Then open `http://localhost:3000`.

## 🗂 Project Structure

```
src/
 ├─ app/              # App-router routes
 ├─ components/
 │   └─ kernels/
 │       ├─ onchain/337/
 │       └─ offchain/
 └─ mainContract/     # ABI & config
.env                  # KRNL secrets
```

## 🔌 KRNL Integration

• KRNL SDK is pre-installed and imported in `components/kernels/*`.
• `.env` ships with Kernel ID 337, Entry ID, AccessToken, Contract & RPC URL.
• Update those as needed.

## 📦 Scripts

| command | purpose |
|---------|---------|
| `npm run dev` | start local dev server |
| `npm run build` | production bundle |
| `npm start` | run compiled build |

## ⚙️ Requirements

Node ≥ 14 • npm / yarn / pnpm

## 🆘 Troubleshooting

Permission issues?  
`chmod +x node_modules/.bin/*`

Missing module?  
`npm install --legacy-peer-deps`

---

MIT License

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
