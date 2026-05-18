# Software specification documents

This folder contains specifications for **Eastern AI Consultant**. Use the right document for your audience:

| Document | File | Purpose |
|----------|------|---------|
| **Software Requirements Specification (SRS)** | [SRS.md](./SRS.md) | *What* the system must do: functional requirements (REQ-IDs), non-functional requirements, interfaces, acceptance criteria. |
| **Software Solution Design (SSD)** | [SSD.md](./SSD.md) | *How* it is built: architecture, routes, APIs, data model, agents, LangGraph, RAG, deployment mapping, traceability to code. |
| **Vercel deployment** | [vercel.md](./vercel.md) | Two-project Vercel setup (frontend + API), env vars, CORS, OAuth URLs. |
| **Render + Vercel** | [render-vercel.md](./render-vercel.md) | Docker / Render patterns when the API is not on Vercel. |

**Suggested reading order**

1. **SRS** — agree on scope and “shall” behavior with stakeholders.  
2. **SSD** — engineers implement and extend against the as-built map.  
3. **Deployment docs** — operators configure production.

The root **[README.md](../README.md)** remains the quick start and stack overview.
