const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : /\.(js|cjs)$/.test(file) ? [file] : [];
  });
}
const targets = ['cypress.config.js', ...files('cypress'), ...files('scripts')];
for (const file of targets) {
  const source = fs.readFileSync(file, 'utf8');
  // The support entry point uses an ES import; everything else uses CommonJS.
  if (file === path.join('cypress', 'support', 'e2e.js')) {
    new vm.SourceTextModule(source, { identifier: file });
  } else {
    new vm.Script(source, { filename: file });
  }
}
console.log(`Syntax validated: ${targets.length} JavaScript files.`);
