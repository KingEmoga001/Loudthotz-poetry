module.exports = {
  hooks: {
    readPackage(pkg) {
      // Force pnpm to completely skip esbuild's broken postinstall script on Hostinger
      if (pkg.name === 'esbuild') {
        if (pkg.scripts && pkg.scripts.postinstall) {
          delete pkg.scripts.postinstall;
        }
      }
      return pkg;
    }
  }
};