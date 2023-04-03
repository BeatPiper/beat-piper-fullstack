# Beat Piper

This is the fullstack [Next.js](https://nextjs.org/) project for [BeatPiper](https://beatpiper.com).

## What's in the stack

This project makes use of the following technologies

- Continuous Integration with [GitHub Actions](https://github.com/features/actions)
- Spotify Authentication with [NextAuth](https://next-auth.js.org/)
- Database ORM with [Prisma](https://prisma.io)
- Components and styling with [Mantine](https://mantine.dev/)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)
- End-to-end typesafe API with [tRPC](https://trpc.io/)
- Schema validation with [Zod](https://zod.dev/)

The stack is heavily inspired by [t3](https://create.t3.gg/).

## Development

- Install dependencies

  ```sh
  yarn
  ```

- Start PostgreSQL database in [Docker](https://www.docker.com/get-started)

  ```sh
  docker-compose up -d
  ```

- Start dev server

  ```sh
  yarn dev
  ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run the script `typecheck`.

### Linting

This project uses ESLint for linting. It's configured in `.eslintrc.json`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `format` script you can run to format all files in the project.
