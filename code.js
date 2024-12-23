const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DepWizard {
  constructor() {
    this.dependencies = this.getDependencies();
  }

  getDependencies() {
    const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json')));
    return packageJson.dependencies;
  }

  checkForUpdates() {
    console.log('Checking for updates...');
    for (const dep in this.dependencies) {
      const latestVersion = execSync(`npm show ${dep} version`).toString().trim();
      const currentVersion = this.dependencies[dep].replace('^', '');
      if (currentVersion !== latestVersion) {
        console.log(`Update available for ${dep}: ${currentVersion} -> ${latestVersion}`);
      } else {
        console.log(`${dep} is up-to-date.`);
      }
    }
  }

  applyUpdates() {
    console.log('Applying updates...');
    execSync('npm update');
    console.log('Updates applied.');
  }

  trackChanges() {
    console.log('Tracking changes...');
    const changes = [];
    for (const dep in this.dependencies) {
      const currentVersion = this.dependencies[dep].replace('^', '');
      const latestVersion = execSync(`npm show ${dep} version`).toString().trim();
      if (currentVersion !== latestVersion) {
        changes.push({ dep, currentVersion, latestVersion });
      }
    }
    console.log('Changes tracked:', changes);
  }

  checkCompatibility() {
    console.log('Checking compatibility...');
    const incompatibleDeps = [];
    for (const dep in this.dependencies) {
      try {
        execSync(`npm ls ${dep}`);
      } catch (error) {
        incompatibleDeps.push(dep);
      }
    }
    if (incompatibleDeps.length > 0) {
      console.log('Incompatible dependencies found:', incompatibleDeps);
    } else {
      console.log('All dependencies are compatible.');
    }
  }
}

module.exports = {
  init: () => new DepWizard()
};
