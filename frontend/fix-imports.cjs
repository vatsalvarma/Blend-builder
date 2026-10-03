const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]*types)['"]/g, 'import type { $1 } from \'$2\'');
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log('Fixed', filePath);
    }
  }
});
