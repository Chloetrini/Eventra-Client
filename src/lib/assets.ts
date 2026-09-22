const assetFiles = import.meta.glob<string>("@/assets/**/*.{jpg,jpeg,png,svg}", {
  eager: true,
  import: "default",
});

// Kebab-case file names are exposed as camelCase keys: `man-with-hand-up.svg` -> UI_ASSETS.manWithHandUp
const toCamel = (name: string) => name.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

export const UI_ASSETS = Object.entries(assetFiles).reduce<Record<string, string>>(
  (acc, [path, url]) => {
    const fileName = path.split("/").pop()?.replace(/\.[^/.]+$/, "");
    if (fileName) {
      acc[toCamel(fileName)] = url;
    }
    return acc;
  },
  {}
);
