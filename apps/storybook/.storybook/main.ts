import { resolve } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../../../packages/react/src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      plugins: [vanillaExtractPlugin()],
      resolve: {
        alias: [
          {
            find: "@flux-ui/tokens/theme.css",
            replacement: resolve(
              import.meta.dirname,
              "../../../packages/tokens/src/theme.css",
            ),
          },
          {
            find: "@flux-ui/tokens",
            replacement: resolve(
              import.meta.dirname,
              "../../../packages/tokens/src/index.ts",
            ),
          },
        ],
      },
    });
  },
};

export default config;
