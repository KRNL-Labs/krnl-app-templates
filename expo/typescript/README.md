# KRNL Expo (React Native) Starter

Build cross-platform mobile dApps with **Expo** + the **KRNL SDK**.

| Framework | Language | Folder |
|-----------|----------|--------|
| Expo (React Native) | TypeScript | `expo/typescript` |

## ⚡️ Quick Start

```bash
# Clone / use template / degit
npx degit <repo>#expo/typescript my-krnl-app
cd my-krnl-app

npm install           # install packages
npx expo start        # or npm run start
```

Select **iOS simulator**, **Android emulator**, or **Expo Go** from the CLI to open the app.

## 📁 Project Structure

```
app/                # File-based router screens
assets/             # Images, fonts…
components/
 └─ kernels/
     ├─ onchain/337/
     └─ offchain/
hooks/
mainContract/       # ABI & config
.env                # KRNL secrets
```

## 🔌 KRNL Integration

The template ships with:

* KRNL SDK pre-installed.
* Default Kernel / Entry / AccessToken / Contract / RPC populated in `.env`.
* Sample on-chain & off-chain components under `components/kernels/`.

Modify `.env` to point to your own kernel or RPC endpoint.

## 📜 Useful Scripts

| command | purpose |
|---------|---------|
| `npm start` / `npx expo start` | dev server & Metro bundler |
| `npm run ios` | run on iOS simulator |
| `npm run android` | run on Android emulator |
| `npm run web` | run as PWA |

## 🛠 Requirements

Node ≥ 14 • Expo CLI (`npm i -g expo-cli`)  
Optional: Xcode / Android Studio for local simulators

## 🩹 Troubleshooting

Most problems are Expo-standard. If you hit permission or module errors, see the “Troubleshooting” section in the root `README`.

---

MIT License
