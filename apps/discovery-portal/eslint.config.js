import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nextJsConfig,
    {
        rules: {
            "@next/next/no-img-element": "off",
            // "no-console": ["error", { "allow": ["warn", "error", "log"] }]
        },
    },
];
export default config;
