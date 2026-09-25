import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [".next/**", "node_modules/**", "coverage/**", "salla-themes/**", "SALLA_THEME_STORE_PROJECT_PROMPT.md"],
  },
];

export default config;
