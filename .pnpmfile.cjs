module.exports = {
  hooks: {
    readPackage(pkg) {
      if ([
        '@firebase/util',
        'esbuild',
        'protobufjs',
        '@swc/core',
        'better-sqlite3',
        'lightningcss',
        'sharp'
      ].includes(pkg.name)) {
        pkg.scripts = pkg.scripts || {};
      }
      return pkg;
    }
  }
};
