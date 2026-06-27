module.exports = {
  hooks: {
    readPackage(pkg) {
      if (['esbuild', '@firebase/util', 'protobufjs'].includes(pkg.name)) {
        pkg.scripts = pkg.scripts || {};
      }
      return pkg;
    }
  }
};
