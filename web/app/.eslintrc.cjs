module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:svelte/recommended",
        "prettier",
    ],
    overrides: [{
        files: ["*.svelte"],
        parser: "svelte-eslint-parser",
        parserOptions: {
            parser: "@typescript-eslint/parser",
        },
    }],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".svelte"],
    },
    plugins: [
        "@typescript-eslint",
    ],
    rules: {
        ["no-console"]: ["error", { allow: ["warn", "error"] }]
    }
}
