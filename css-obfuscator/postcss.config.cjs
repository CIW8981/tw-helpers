module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-obfuscator")({
      enable: false,
      srcPath: "src", // Source of your files.
      classMethod: "none",
      classPrefix: "spaui-",
      idMethod: "none",
      idPrefix: "spauiid-",
      desPath: "dist2", // Destination for obfuscated html/js/.. files.
      extensions: [".tsx"],
      formatJson: true, // Format obfuscation data JSON file.
    }),
  ],
};
