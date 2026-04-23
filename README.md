# FABRIC Portal

FABRIC Portal is a web-based interface for the [FABRIC testbed](https://fabric-testbed.net). It reflects the user's rights and project associations, allowing them to view resources, manage projects and experiments. Portal relies on [CILogon](https://www.cilogon.org/home)/[COmanage](https://www.cilogon.org/comanage) for federated authentication and on FABRIC system services for authorization.

## Overview

Portal provides a graphical user interface to testbed functions:

- **Homepage** — introduction carousel, recent news, resource topology map, facility updates, and FABRIC partners.
- **Resource Discovery** — testbed resource availability in table and map views.
- **Experiments** — project, slice, token, and SSH key management (UI varies by user privileges).
  - **Project Management** — create/edit projects, manage permissions and memberships via the Core API.
  - **Credential Management** — link to the Credential Manager app for creating/refreshing/revoking tokens.
  - **SSH Key Management** — view, generate, upload, or delete sliver/bastion keys.
  - **Slice Builder** — graphical topology editor for defining experiment slices.
  - **Slice Viewer** — visualize slice topology and information.
- **Community** — news, events, newsletter, funding opportunities, and publications.
- **User Profile** — account info, roles, SSH keys, and editable bio/pronouns/title/website.

### System Components

- **Portal** — this Next.js application; proxies all API calls through server-side route handlers.
- **FABRIC Core API** — people, project, and SSH key management.
- **Orchestrator API** — slice/sliver management and resource availability.
- **CILogon/COmanage** — federated OIDC authentication and identity attributes.
- **Credential Manager** — issues tokens for testbed access.
- **Knowledge Base** — documentation, user guides, and community forum.
- **JupyterHub** — on-demand notebooks for experimenters.

## Prerequisites

- [Node.js](https://nodejs.org/en/) v22 LTS (npm is included)
- [Docker](https://www.docker.com/) and Docker Compose (for deployment)
- SSL certificates (`ssl/fullchain.pem` and `ssl/privkey.pem`)
- A [CILogon OIDC client](https://cilogon.org/oauth2/register) registration

## Local Development

```bash
npm install
npm run dev          # starts on http://localhost:3001
```

The app reads backend API URLs from a `config.json` file at the project root, with environment variables taking precedence when set. Copy the template and fill in your API endpoints:

```bash
cp config.json.template config.json
# edit config.json with your API endpoints
```

| Attribute | Description |
|---|---|
| `fabricCoreApiUrl` | Core API — people, projects, SSH keys |
| `orchestratorApiUrl` | Orchestrator — slices, resources |
| `credentialManagerApiUrl` | Credential Manager API — token creation/refresh/revoke |
| `credentialManagerAppUrl` | Credential Manager app — browser-facing URL |
| `artifactManagerApiUrl` | Artifact Manager API — artifact CRUD |
| `artifactManagerAppUrl` | Artifact Manager app — browser-facing URL |
| `publicationsTrackerApiUrl` | Publications tracker API |
| `qaToolApiUrl` | QA Bot tool API |
| `qaToolApiKey` | QA Bot tool API key |
| `resourceLinkApiUrl` | Resource Links API (not currently used; reserved for future work) |

Environment variables (`FABRIC_CORE_API_URL`, `ORCHESTRATOR_API_URL`, etc.) override the corresponding `config.json` values when set.

Optionally, copy the environment template for build-time settings:

```bash
cp .env.template .env
```

The default sets `GENERATE_SOURCEMAP=false` to disable source maps in production builds.

## Deployment

The application is deployed as three Docker containers behind Nginx with Vouch Proxy for OIDC authentication.

### 1. Configure Docker Compose

Copy the template and adjust ports or service settings as needed:

```bash
cp docker-compose.yml.template docker-compose.yml
```

The default exposes Nginx on ports `8080` (HTTP redirect) and `8443` (HTTPS). Add backend API URLs to the `portal-app` service `environment` key, or mount a `config.json` file instead.

### 2. Configure Vouch Proxy

Copy the template and fill in your CILogon client credentials:

```bash
cp vouch/config.yml.template vouch/config.yml
```

Edit `vouch/config.yml` — set at minimum:
- `vouch.jwt.secret` — a random string (>= 44 characters)
- `vouch.cookie.domain` — your deployment domain
- `vouch.cookie.name` — the JWT cookie name (e.g. `fabric-service-alpha`)
- `oauth.client_id` and `oauth.client_secret` — from your CILogon registration
- `oauth.callback_url` — `https://<your-domain>/auth`
- `vouch.post_logout_redirect_uris` — `https://<your-domain>`

### 3. Configure Nginx

Copy the template and update for your deployment:

```bash
cp nginx/default.conf.template nginx/default.conf
```

Key values to verify:
- HTTPS redirect port in the HTTP server block (default: `8443`)
- SSL certificate paths (default: `/etc/ssl/fullchain.pem`, `/etc/ssl/privkey.pem`)
- Cookie domain in the `/logout` block (must match `vouch.cookie.domain`)

### 4. Add SSL Certificates

Place your certificates in the `ssl/` directory:

```
ssl/fullchain.pem
ssl/privkey.pem
```

### 5. Build and Run

```bash
docker compose up -d --build
```

The portal will be available at `https://<your-domain>:8443`.

### Service Architecture

```
┌──────────┐       ┌──────────────┐        ┌─────────────┐
│  Client  │──443──│    Nginx     │──9090──│ Vouch Proxy │──→ CILogon
│ (browser)│       │ (SSL + auth) │        │   (OIDC)    │
└──────────┘       └──────┬───────┘        └─────────────┘
                          │ 3000
                   ┌──────┴───────┐
                   │  Portal App  │──→ Core API
                   │  (Next.js)   │──→ Orchestrator API
                   └──────────────┘──→ Credential Manager
```

## Scripts

| Command | Description |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Development server with hot reload (port 3001) |
| `npm run build` | Production build (Next.js standalone output) |
| `npm start` | Production server (port 3000) |
| `npm run lint` | ESLint |
