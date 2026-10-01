module.exports = {
  plugins: {
    // Pinned explicitly: a competing tailwind.config.ts exists at the repo root
    // with a different neutral palette name (white vs ivory). Without this path,
    // resolution depends on cwd and ivory-* utilities silently vanish.
    tailwindcss: { config: './tailwind.config.js' },
    autoprefixer: {},
  },
}
