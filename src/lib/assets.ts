const assetFiles = import.meta.glob<string>("@/assets/*.{jpg,jpeg,png,svg}", {
  eager: true,
  import: "default",
});

export const UI_ASSETS = Object.entries(assetFiles).reduce<Record<string, string>>(
  (acc, [path, url]) => {
    const fileName = path.split("/").pop()?.replace(/\.[^/.]+$/, "");
    if (fileName) {
      acc[fileName] = url;
    }
    return acc;
  },
  {}
);