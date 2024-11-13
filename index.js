#!/usr/bin/env node

const path = require("node:path");
const fs = require("node:fs");
const { execSync } = require("node:child_process");

function copyTemplateFiles(srcDir, destDir) {
  fs.readdirSync(srcDir).forEach((file) => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      fs.mkdirSync(destFile, { recursive: true });
      copyTemplateFiles(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

function createProject() {
  const projectName = process.argv[2] || "my-node-ts-app";
  const projectDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    console.error(`Error: Directory ${projectDir} already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectDir, { recursive: true });
  console.log(`Creating project in ${projectDir}...`);

  const templateDir = path.join(__dirname, "templates");
  copyTemplateFiles(templateDir, projectDir);

  // Create README.md if it does not exist
  const readmePath = path.join(projectDir, "README.md");
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(
      readmePath,
      `# ${projectName}\n\nThis is a TypeScript Node.js project created with a custom template.\n\n## Installation\n\n\`\`\`\npnpm install\n\`\`\`\n\n## Scripts\n\n- \`pnpm run build\`: Builds the project using esbuild.\n- \`pnpm run dev\`: Starts the development server.\n- \`pnpm run start\`: Runs the compiled output.\n`,
    );
    console.log("README.md created.");
  }

  // Create LICENSE if it does not exist
  const licensePath = path.join(projectDir, "LICENSE");
  if (!fs.existsSync(licensePath)) {
    fs.writeFileSync(
      licensePath,
      `MIT License\n\nCopyright (c) ${new Date().getFullYear()} ${
        process.env.USER || "Author"
      }\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n`,
    );
    console.log("LICENSE created.");
  }

  console.log("Initializing package.json...");
  execSync("pnpm init", { cwd: projectDir, stdio: "ignore" });

  console.log("Installing dependecies...");
  execSync("pnpm add -D typescript @types/node esbuild npm-run-all", {
    cwd: projectDir,
    stdio: "ignore",
  });

  const packageJsonPath = path.join(projectDir, "package.json");
  const gitIgnorePath = path.join(projectDir, ".gitignore");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  packageJson.scripts = {
    start: "node dist/index.js",
    build:
      "esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js --format=esm",
    lint: "tsc",
    "dev:tsc": "tsc --watch --preserveWatchOutput",
    "dev:esbuild": "pnpm run build --watch",
    "dev:node": "node --watch dist/index.js",
    dev: "[ -f dist/index.js ] || pnpm run build; run-p dev:*",
  };

  packageJson.type = "module";

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  const data = `
    node_modules
    dist
    .env
    .DS_Store
`;

  fs.writeFileSync(gitIgnorePath, data);

  console.log("\n🎉 Project setup complete! Happy coding 🎉");
}

createProject();
