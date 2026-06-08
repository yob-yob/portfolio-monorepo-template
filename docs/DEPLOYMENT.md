# City OS — Deployment Documentation

## Overview

City OS is a SvelteKit + API monorepo deployed on a self-hosted VPS using
**Dokploy** (v0.29.7) as the PaaS layer. Dokploy orchestrates services via
**Docker Swarm**, uses **Traefik** as the reverse proxy, and integrates with a
**GitHub App** for webhook-triggered auto-deploys.

---

## Infrastructure

### Main VPS (Production Host)

| Property       | Value                                    |
|----------------|------------------------------------------|
| OS             | Ubuntu 22.04 (kernel 6.8.0)             |
| RAM            | 7.7 GB                                   |
| Disk           | 58 GB (53% used)                         |
| Docker         | 27.0.3 (Swarm mode enabled)              |
| Dokploy URL    | https://dokploy.yob-yob.com              |

### Build Server (Dedicated Build Node)

| Property       | Value                                    |
|----------------|------------------------------------------|
| Hostname       | DokployBuilder                           |
| IP             | 192.168.254.100 (private network)        |
| OS             | Proxmox VE 6.14                          |
| RAM            | 8 GB                                     |
| Disk           | 100 GB (2% used)                         |
| Docker         | 28.5.0                                   |
| Role           | Builds the Frontend image only           |

### Container Registry

| Property       | Value                                    |
|----------------|------------------------------------------|
| URL            | registry.vps03.yob-yob.com               |
| Type           | Self-hosted / cloud                      |
| Username       | yobyob                                   |

---

## Networking

All services communicate over Docker Swarm's overlay network `dokploy-network`.
Traefik sits at the edge and routes inbound HTTPS traffic to the correct service
based on the `Host` header.