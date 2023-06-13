module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    overrides: [{
        files: ["*.svelte"],
        processor: "svelte3/svelte3"
    }],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    plugins: [
        "@typescript-eslint",
        "svelte3"
    ],
    rules: {
        ["no-console"]: ["error", { allow: ["warn", "error"] }]
    },
    settings: {
        "svelte3/typescript": true
    }
}
