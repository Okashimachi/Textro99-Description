/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // 配色は Tailwind 標準パレット（zinc / red / amber / emerald / sky）だけで組む。
    // テキストロ本体（Textro99-WebFront）の方針を踏襲。
    extend: {},
  },
  plugins: [],
};
