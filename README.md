# Vite React TS Tailwind Starter

A minimal, zero-config starter template for building React applications with TypeScript and Tailwind CSS using Vite. Includes linting, formatting, and Git hooks for a smooth developer experience.

---

## 🧰 Tech Stack

- **Vite** – lightning-fast development server & build tool
- **React 19 + TypeScript** – modern UI library with type safety
- **Tailwind CSS 4** – utility-first CSS framework with no manual config
- **@tailwindcss/vite** – official Tailwind plugin for Vite
- **ESLint** + **eslint-plugin-better-tailwindcss** – code linting & Tailwind class validation
- **Prettier** + **prettier-plugin-tailwindcss** – code formatting & automatic class sorting
- **Husky** + **lint-staged** – Git hooks to prevent bad commits

---

## 🚀 Quick Start

1. **Clone the repo**
   ```bash
   git clone git@github.com:fraorzi/vite-react-ts-tailwind-starter.git
   cd vite-react-ts-tailwind-starter
   ```
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Start development server**
   ```bash
   pnpm dev
   # open http://localhost:5173
   ```
4. **Build for production**
   ```bash
   pnpm build
   pnpm preview
   ```
5. **Run linting**
   ```bash
   pnpm lint
   ```

---

## 📦 NPM Scripts

| Command        | Description                                  |
| -------------- | -------------------------------------------- |
| `pnpm dev`     | Start Vite dev server with HMR               |
| `pnpm build`   | Compile TypeScript and bundle for production |
| `pnpm preview` | Preview production build locally             |
| `pnpm lint`    | Run ESLint on all source files               |
| `pnpm prepare` | Set up Husky Git hooks after `pnpm install`  |

---

## 📁 Project Structure

```
vite-react-ts-tailwind-starter/
├── .husky/              # Git hooks (pre-commit, commit-msg)
├── src/
│   ├── index.css        # Tailwind import
│   ├── main.tsx         # Entry point (imports index.css)
│   └── App.tsx          # Example React component
├── .prettierrc          # Prettier config + Tailwind plugin
├── eslint.config.js     # ESLint flat config with Better-Tailwindcss + a11y plugin
├── vite.config.ts       # Vite config with React + Tailwind plugins
├── package.json         # Scripts, dependencies, commitlint, lint-staged
└── README.md            # Project documentation
```

---

## 🔧 Optional Enhancements

These features are not required but can be added:

- **Vitest**: unit and integration testing with `@testing-library/react`
- **Static-Site Generation**: prerender HTML for improved SEO/performance

---

---

## ❤️ License

MIT © Franek Orzechowski
