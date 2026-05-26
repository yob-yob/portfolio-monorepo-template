# CityOS

## Description

This project is inspired by COA audit findings where an LGU's PPE balance was considered unreliable because:
- Complete physical count was not conducted
- Old asset balances were carried forward without itemized physical verification
- Completed projects funded by national government agencies were not recognized as PPE
- Some assets were misclassified
- Depreciation was not always started when assets became available for use
- Inventory and accounting records were not reconciled
- Prior recommendations were not fully implemented

The system must be designed around:
- Reliable asset records
- Evidence-based physical count
- Accountability and audit trails
- Reconciliation between physical records and accounting records
- Document management
- Role-based workflows
- Department-based access control

## How To Use

### Prerequisite

- Database: `Postgres`
- BunJs: `latest`
- Monorepo Knowledge
- 

### Development Usage

- create a `.env` inside `./packages/database/` then add a `DATABASE_URL`
- `bun run dev`


## Milestones

Everything is documented in the `./plans` directory.
