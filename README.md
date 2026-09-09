# Say No to Plastic

An interactive science and education platform about plastic exposure, microplastics, the human body, and practical ways to reduce everyday exposure.

**Live site:** https://saynotoplastic.com

Say No to Plastic translates the ideas behind *Homo Plasticus* into a web experience built around accessible science, visual storytelling, interactive anatomy, practical guides, media, and community resources.

## About

The project is designed to make a complicated subject easier to explore without turning it into a wall of research papers or a list of generic lifestyle tips. Visitors can move from the underlying science to the body systems affected by exposure, then into concrete actions they can take in daily life.

The site includes work developed with content and direction from Dr. Elie R. Haddad and connects the broader *Homo Plasticus* project with a public-facing digital experience.

## What is in the site

- **Interactive anatomy:** a guided body journey and 3D anatomy viewers for exploring how plastic exposure can relate to different systems.
- **Science and evidence:** body-system pages, exposure routes, detection methods, source-aware educational content, and supporting references.
- **Solutions and guides:** practical exposure-reduction guidance organized around realistic changes rather than all-or-nothing behavior.
- **Homo Plasticus:** a dedicated book experience that connects the website to the larger educational project.
- **Media and community:** podcast, TEDx/media material, community resources, learning-series infrastructure, and newsletter flows.
- **Owner tools:** an authenticated admin experience for managing content and operational parts of the site without editing source code directly.

## Technology

The current application uses:

- Next.js 16 and React 19
- TypeScript
- Three.js and React Three Fiber for interactive 3D scenes
- Vite / Vinext and Cloudflare tooling
- Drizzle ORM for structured application data
- Tailwind CSS
- Node-based validation and regression tooling

## Run locally

### Requirements

- Node.js 22.13 or newer
- npm

### Setup

```bash
git clone https://github.com/pegg-dot/SayNoToPlastic.git
cd SayNoToPlastic
cp .env.example .env.local
npm run install:ci
npm run dev
```

Then open the local URL printed by Vite.

The repository includes an `.env.example` describing the available environment variables. Some integrations, commerce features, admin functionality, and production services require their own credentials or configuration.

## Verification

The project has an unusually deep validation layer because the site evolved through repeated visual, content, accessibility, source, and deployment reviews.

For a normal development pass, the most useful checks are:

```bash
npm run lint
npm run build
npm test
npm run release:audit
```

More focused audit commands remain available in `package.json` for anatomy, content integration, accessibility-adjacent UI checks, media, commerce, source traceability, and release-specific regression testing.

## Repository structure

```text
app/            Application routes, components, content and API handlers
public/         Static media and site assets
worker/         Worker-side application code
scripts/        Build, validation and release tooling
tests/          Automated tests
db/             Database-related source
drizzle/        Database migrations and metadata
docs/           Project documentation and retained historical records
```

## Historical validation records

This project went through many tightly scoped review releases. The corresponding validation reports, change manifests, and older audit logs are intentionally preserved for traceability, but they are archived under `docs/archive/` so they do not dominate the public repository root.

See [`docs/archive/README.md`](docs/archive/README.md) for the archive structure.

## Project notes

The website is an educational resource, not a patient-specific medical tool. Scientific and health-related material should remain source-aware and should not be interpreted as individualized medical advice.

Operational documentation such as owner setup, commerce setup, QA checklists, and project-state records is retained in the repository because those files are still useful to maintainers.

## License

Source code in this repository is available under the [MIT License](LICENSE).

Third-party media, research material, supplied photography/video, book content, trademarks, and other non-code assets may have separate rights and are not automatically relicensed by the MIT License.