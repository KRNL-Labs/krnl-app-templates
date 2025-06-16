# KRNL App Templates

A collection of production-ready starter templates for building decentralized applications on **KRNL**.

| Framework | Language(s) | Path |
|-----------|-------------|------|
| Next.js (App Router) | JavaScript, TypeScript | `nextjs/javascript`, `nextjs/typescript` |
| React (Vite) | JavaScript, TypeScript | `react/javascript`, `react/typescript` |


Each template is already wired to the KRNL SDK and contains sample on-chain and off-chain components, sensible project structure, and a pre-filled `.env` with default credentials (Kernel ID 337, Entry, AccessToken, Contract, RPC).

---

## 📦 Using a Template

1. **Pick a template path** from the table above.
2. **Copy it** with [`degit`](https://github.com/Rich-Harris/degit) or GitHub’s *Use this template*.
   ```bash
   npx degit <repo>#<template-path> my-krnl-app
   cd my-krnl-app
   ```
3. **Install dependencies**
   ```bash
   npm install   # or pnpm / yarn
   ```
4. **Update `.env`** if you want to point to a different kernel or RPC.
5. **Run the dev server / bundler** (see the template README for the exact command).

> Example for React + TypeScript
> ```bash
> npx degit <repo>#react/typescript my-krnl-app
> cd my-krnl-app && npm install && npm run dev
> ```

Each template folder contains a dedicated `README.md` with specific commands, folder layout, and troubleshooting notes.

---

## 🗂 Repository Structure

```
krnl-app-templates/
├─ nextjs/
│  ├─ javascript/
│  └─ typescript/
├─ react/
│  ├─ javascript/
│  └─ typescript/

```

---

## 🤝 Contributing

Found a bug, have an idea, or want to add another framework? PRs welcome!

1. Fork the repo and create a branch.
2. Follow the coding style of existing templates.
3. Update / add tests where applicable.
4. Submit a pull request.

---

## 📄 License

MIT
