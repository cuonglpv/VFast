# 5. Building Block View

This section follows C4: Level 1 is the whole system, Level 2 the containers, Level 3 the inside of each container, and the frontend is zoomed one level further.

## 5.1 Level 1 — ELMS

ELMS is one software system used by Staff, Manager, and Admin. See [C1 System Context](../c4/01-system-context.md).

## 5.2 Level 2 — Containers

Reverse proxy, Web Frontend, `Elms.Api`, `Elms.Worker`, PostgreSQL 16, Data Lake. Diagram, responsibilities, and relationships: [C2 Container](../c4/02-container.md).

## 5.3 Level 3 — Components

| Container | Building blocks | Source |
|---|---|---|
| Elms.Api / Elms.Worker | Hosts (Controllers, Jobs) → Application (handlers, behaviours, contract validator) → Domain (entities, rules) ← Infrastructure (EF Core, ECS / ILVG / VinSOC clients) | [C3 §1](../c4/03-component.md#1-elmsapi-and-elmsworker) |
| Business modules | identity, organization, catalog, ingestion, usage, finance, optimization, analytics, audit | [C3 §2](../c4/03-component.md#2-business-modules) |
| Web Frontend | `app` (router, guard, layout), eight `features`, `services` (all API calls), `shared` | [C3 §3](../c4/03-component.md#3-web-frontend) |
| PostgreSQL | Seven table groups, one schema per module | [Database design](../../database/README.md) |
| Data Lake | Raw files from every source, written and read through `IRawDataStore` | [C2](../c4/02-container.md) |

## 5.4 Level 4 — Web Frontend pages

Every screen of UI demo v90 decomposed into its feature's page and components, its hooks and the service they call, and the shared parts it uses: [C4 Code](../c4/04-code.md). Code structure and responsibilities: [Code structure §3](../../05-code-structure.md#3-frontend).
