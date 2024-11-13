# Create Node TS App

<!--toc:start-->

- [Create Node TS App](#create-node-ts-app)
  - [Features](#features)
  - [Usage](#usage)
  - [Project Structure](#project-structure)
  - [Scripts](#scripts)
  - [Dependencies](#dependencies)

A simple scaffolding CLI to quickly create a Node.js project with TypeScript support,
including useful tools and configurations to get started fast.

## Features

- Pre-configured TypeScript setup
- Hot-reloading with ts-node-dev
- Easy development workflow using nodemon
- Build scripts included

## Usage

Create a new Node.js TypeScript project with the following command:

`pnpm create @areitosa/node-ts-app@latest <project-name>`

Replace `<project-name>` with the name of your desired project.

## Project Structure

After running the command, you'll get a project with the following structure:

```plaintext
<project-name>/
├── dist/ # Compiled output (after build)
├── src/
│ └── index.ts # Main entry point
├── nodemon.json # Nodemon configuration
├── package.json
└── tsconfig.json # TypeScript configuration
```

## Scripts

The generated project includes the following pnpm scripts for convenience:

```
pnpm start: Start the project with nodemon for automatic reloading.

pnpm build: Compile TypeScript files to JavaScript in the dist folder.
```

## Dependencies

- typescript
- ts-node-dev
- nodemon
- @types/node
