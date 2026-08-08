const fs = require('fs');
const path = require('path');

const lockfilePath = path.join(__dirname, '..', 'apps', 'agent', 'package-lock.json');
const lockfileContent = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));

const immutablePkg = lockfileContent.packages['node_modules/immutable'];
if (!immutablePkg) {
  console.error('FAIL: immutable not found in package-lock.json');
  process.exit(1);
}

const version = immutablePkg.version;
const [major, minor, patch] = version.split('.').map(Number);

// Check if version is >= 4.3.8
const isValid = (major > 4) ||
  (major === 4 && minor > 3) ||
  (major === 4 && minor === 3 && patch >= 8);

if (isValid) {
  console.log(`PASS: immutable@${version} is not vulnerable (>= 4.3.8)`);
  process.exit(0);
} else {
  console.error(`FAIL: immutable@${version} is vulnerable to Prototype Pollution. Update to >= 4.3.8`);
  process.exit(1);
}
