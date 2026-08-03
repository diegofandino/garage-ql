# Garage GraphQL Maintenance

A small Next.js app for tracking a garage of vehicles and their maintenance history. It ships its own GraphQL API (via `graphql-yoga`) and a UI that queries it to render each vehicle's latest mileage and last service date.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) for the API, mounted as a Next.js route handler
- Tailwind CSS v4
- shadcn/ui components (`components/ui/*`) built on Base UI

## Architecture notes

- Next.js App Router
- GraphQL Yoga API route
- Server Actions for form submissions
- shadcn/ui and Base UI components
- In-memory data for demo purposes
- Planned next step: replace in-memory arrays with a persistent database

## Project structure

```
app/
  api/graphql/route.ts   GraphQL schema, resolvers, and Yoga route handler
  vehicles/page.tsx      Fetches vehicles from the GraphQL API and renders them
  page.tsx               Default Next.js landing page
lib/
  data.ts                In-memory vehicle and maintenance record data
components               Layout, components for using inside pages.
component/ui/           shadcn/ui primitives (badge, button, card, table)
```

## Getting started

Install dependencies (the repo uses pnpm, indicated by `pnpm-lock.yaml`):

```bash
pnpm install
```

Copy the environment example and fill in the values:

```bash
cp .env.example .env
```

| Variable            | Description                                                        |
| ------------------- | -------------------------------------------------------------------|
| `BASE_API_URL`      | Base URL the app fetches against (e.g. `http://localhost:3000`)    |
| `GRAPH_QL_ENDPOINT` | Path to the GraphQL endpoint (e.g. `/api/graphql`)                 |

Run the dev server:

```bash
pnpm dev
```

- Pure App: [http://localhost:3000](http://localhost:3000)

## GraphQL API

The schema is defined in [app/api/graphql/route.ts](app/api/graphql/route.ts):

Data is currently served from the in-memory fixtures in [lib/data.ts](lib/data.ts) rather than a database.

