#!/usr/bin/env node

const path = require("node:path");
const fs = require("node:fs");
const { execSync } = require("node:child_process");
const { console } = require("node:inspector");

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
  }

  fs.mkdirSync(projectDir, { recursive: true });
  console.log(`Creating project in ${projectDir}...`);

  const templateDir = path.join(__dirname, "templates");
  copyTemplateFiles(templateDir, projectDir);

  console.log("Initializing package.json...");
  execSync("pnpm init -y", { cwd: projectDir, stdio: "inherit" });

  console.log("Installing dependecies...");
  execSync("pnpm add -D typescript ts-node-dev @types/node nodemon", {
    cwd: projectDir,
    stdio: "inherit",
  });

  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  packageJson.scripts = {
    start: "nodemon",
    build: "tsc",
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log("Project setup complete");
}

createProject();
