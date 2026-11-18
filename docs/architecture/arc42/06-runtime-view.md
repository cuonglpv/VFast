# 6. Runtime View

## 6.1 Daily pipeline

Data enters ELMS in two rhythms. `SyncSchedulerJob` checks every minute which connectors are due and starts a `ConnectorRunJob` for each, at that connector's interval; ILVG and VinSOC run daily. Once the day's syncs are done, `DailyPipelineJob` turns the data into the figures every screen reads, so dashboards show one consistent version of the numbers (G7).

```mermaid
sequenceDiagram
    autonumber
    participant S as SyncSchedulerJob (Worker)
    participant C as ConnectorRunJob
    participant V as Contract validator
    participant P as P&L API (read-only)
    participant L as Data Lake
    participant D as PostgreSQL
    participant J as DailyPipelineJob
    participant A as Elms.Api
    participant M as Manager

    S->>D: Find connectors whose interval has elapsed
    alt connector paused
        S->>D: sync_runs = paused (nothing read, period stays Unknown)
    else connector due
        S->>C: start run (distributed lock per connector)
        C->>P: fetchLicenses / fetchTerms / fetchHolders / fetchActivity / fetchUsage
        alt success
            P-->>C: records
            C->>L: land raw response (IRawDataStore)
            C->>D: record raw-file metadata
            L-->>V: read raw for processing
            V->>V: validate (schema, total_count, duplicates)
            V->>D: normalize (upsert by source key + data date)
            V->>D: collection_coverage = complete or partial
        else retries exhausted, or validation fails the run
            C->>D: sync_runs = failed, nothing written, figures stay Unknown (never 0)
        end
    end
    J->>D: seat status over 30 days with grace (BR-03), days used (BR-32)
    J->>D: daily snapshots, cost split of open months into Used, Wasted, Not evaluated (BR-06, BR-22)
    J->>D: detection (unused, inactive, overuse, leaver), waste flag above 20 % (BR-20)
    J->>D: REFRESH MATERIALIZED VIEW CONCURRENTLY, bump dataVersion
    M->>A: open License List or Usage
    A->>D: read views (Dapper), scoped to the Manager's units
    A-->>M: figures with dataDate and data source (BR-12)
```

Other jobs: `IlvgSyncJob` (daily; also disables a leaver's account, BR-15) and `VinSocSyncJob` (daily); `ImportConfirmJob` writes a confirmed budget version or purchase file in one transaction, once per preview key (BR-33); `MonthCloseJob` closes, on day 10, the previous month of every company Staff have not closed (UC05). Records that fail a check are rejected one by one, with the reason kept in `raw_records.normalize_error`; a record count that does not match `total_count` fails the whole run. All jobs are idempotent, never overlap, and run as `SystemUser`, so the audit actor is `system`.

## 6.2 User scenarios

Login and role routing, viewing Usage for a scope, importing the budget plan, and creating a connector are drawn as sequence diagrams in [UML — Sequence diagrams](../uml/02-sequence-diagrams.md).
