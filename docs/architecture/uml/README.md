# UML — ELMS

> **Status:** TARGET design; the backend is not implemented, the frontend follows UI demo v90.

This set expands the [C4](../c4/README.md) views with class structure and call order:

| Document | Content |
|---|---|
| [Class diagrams](01-class-diagrams.md) | Core domain entities (from [`elms.dbml`](../../database/elms.dbml)) and the frontend services (`services/<module>/<module>Service.ts`) that call `Elms.Api` |
| [Sequence diagrams](02-sequence-diagrams.md) | Login and role routing, Usage for a scope, budget plan import, new connector — with error paths |

## Relationship to C4 and arc42

- C4 Level 3 names the components and their responsibilities; C4 Level 4 decomposes each frontend page.
- UML shows the classes and the order of calls between frontend, API, worker, and database.
- The arc42 [Runtime View](../arc42/06-runtime-view.md) holds the system-wide daily pipeline.
- HTTP paths follow [Information architecture §API](../../04-information-architecture-manager.md) and the [API conventions](../../05-code-structure.md#5-api-conventions); the OpenAPI file becomes the source of truth once the API exists.
