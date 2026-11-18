# 11. Risks and Technical Debt

## 11.1 Risks

| Risk | Mitigation |
|---|---|
| A P&L cannot deliver its API on time | Mock data labelled as mock (BR-12); the connector stays `Pending` |
| Usage reports anonymize users | Seats become `Not monitored`, their cost Not evaluated, never waste |
| A sync fails and usage looks like zero | Figures stay `Unknown`; the connector shows `Failed` or `Delayed` (BR-29) |
| Figures disagree between screens | One set of rules (BR-03, BR-06, BR-09, BR-22), one definition per metric |
| Per-user usage is sensitive personal data | Every API requires login; data scope enforced on the backend (BR-14) |
| VinSOC or SAP fields differ from the assumptions | Checked against the real sources before the import is built |
| Data lake technology not chosen | Hidden behind `IRawDataStore`; a local folder in dev until it is chosen |

Source: [Research §9](../../01-research-top-down.md).

## 11.2 Technical debt

| Debt | Impact | Plan |
|---|---|---|
| `src/frontend` follows the previous model and layered folders (category budgets, no Usage / Connector / Cloud screens) | Code and docs disagree | Move to the feature tree in [Code structure §3](../../05-code-structure.md#3-frontend) |
| `src/frontend/README.md` describes alias folders that do not exist; `vite.config.ts` has an unused `@layout` alias | Confusing imports | Align when the frontend is refactored |
| UI demo v90 labels Staff *Editor* | Role name differs from the use cases | Use *Staff* in code and screens |
| The schema has no table for raw-file metadata; `raw_records.payload` still stores the raw payload | Raw data in two places once the lake exists | Update `elms.dbml` when the lake technology is chosen |
| Backend not implemented | No real data; everything is mock | Build `Elms.Api` / `Elms.Worker` per [Code structure §4](../../05-code-structure.md#4-backend) |
