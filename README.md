# Say No to Plastic

**Live site:** https://saynotoplastic.com

Say No to Plastic is an interactive educational website about microplastics, plastic exposure, the human body, and practical ways to reduce everyday exposure.

I built the project for fun as a way to turn a complicated subject into something more visual, understandable, and useful than a collection of research papers or generic health advice.

## About

Say No to Plastic is designed for people who are curious about microplastics and want a clearer way to understand where exposure comes from, what researchers are studying, how different parts of the body fit into the conversation, and what realistic changes people can make in everyday life.

The site combines science, interactive anatomy, visual storytelling, practical guides, media, and community resources into one experience. Rather than asking visitors to read everything at once, it lets them move from the big picture into deeper material when they want it.

The project was developed with content and direction from **Dr. Elie R. Haddad**, whose work around *Homo Plasticus* helped shape the educational material and broader message behind the site. Say No to Plastic extends that work into a public digital experience built to make the subject easier to explore.

## What is in the site

- **Interactive anatomy** that helps visitors explore body systems and exposure concepts visually.
- **Science and evidence** covering exposure routes, detection methods, research, and source-aware educational content.
- **Practical guides** focused on realistic ways to reduce everyday plastic exposure.
- **Homo Plasticus** content connecting the website to the larger educational project.
- **Media and community** including podcast, TEDx and other media material, community resources, and newsletter experiences.

## Who it is for

The site is meant for a general audience. You do not need a scientific or medical background to use it.

It is especially useful for people who want to:

- understand microplastics without starting with dense academic literature;
- see how exposure can be explained visually;
- explore practical ways to reduce plastic use and exposure;
- learn more about the ideas behind *Homo Plasticus* and Dr. Haddad's work.

## Technology

The site is built with a modern TypeScript and React stack, including Next.js, Three.js, React Three Fiber, Vite/Vinext, Cloudflare tooling, Drizzle ORM, and Tailwind CSS.

A large part of the project also involved building custom validation and regression tooling for visual changes, content integration, source tracking, accessibility-related checks, media, and release verification.

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

## Historical project records

The site went through many tightly scoped review releases while it was being built. The old validation reports, change manifests, and audit logs are still preserved for traceability, but they live under `docs/archive/` instead of taking over the repository root.

## Note

Say No to Plastic is an educational project, not a patient-specific medical product. Scientific and health-related material should not be interpreted as individualized medical advice.

## License

Source code in this repository is available under the [MIT License](LICENSE).

Third-party media, research material, supplied photography/video, book content, trademarks, and other non-code assets may have separate rights and are not automatically relicensed by the MIT License.