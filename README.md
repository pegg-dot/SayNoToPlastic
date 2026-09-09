# Say No to Plastic

**Live site:** https://saynotoplastic.com

Say No to Plastic is an interactive educational website about microplastics, human exposure, and the growing body of research around how plastic-derived material is showing up in the body.

I built the site for fun as a design and engineering project. The goal was to take a subject that is usually presented through dense papers, scattered headlines, and generic advice and turn it into something visual, understandable, and useful for a normal person.

## About the project

The site is for people who are curious about microplastics but do not want to start by reading medical journals. It brings the science, the limits of the evidence, interactive anatomy, everyday exposure routes, practical changes, and the broader *Homo Plasticus* project into one place.

A major part of the experience is the body journey. Visitors can move through evidence involving blood, brain tissue, cardiovascular tissue, pregnancy and placenta, reproductive tissue, the endocrine system, kidneys, skin, the digestive system, and other areas while seeing what a study found and, just as importantly, what it did **not** prove.

The project also connects the research to practical exposure-reduction ideas around food storage, heating plastic, bottled water, synthetic clothing, indoor air, and other repeated sources of everyday contact.

## Dr. Elie R. Haddad and *Homo Plasticus*

The educational direction of the project is closely connected to **Elie R. Haddad, MD**, a cardiologist and cardiac electrophysiologist with more than two decades of clinical experience.

Dr. Haddad is the author of *Homo Plasticus*, which explores how the plastic age became a human-exposure and health question. The website turns many of those ideas into an interactive public experience, pairing emerging human evidence with clear explanations of uncertainty and practical action.

The site also includes Dr. Haddad's broader public work around the subject, including the **Beyond Plastic** podcast and his TEDx talk, **The Invisible Inheritance of Nanoplastics**.

## Who it is for

Say No to Plastic is built for a general audience. You do not need a medical or scientific background to use it.

It is meant for people who want to:

- understand what researchers are actually finding about microplastics in humans;
- separate evidence from overstatement or fear-based claims;
- explore the body and exposure routes visually;
- make realistic changes without trying to eliminate every piece of plastic from their life;
- learn more about *Homo Plasticus* and Dr. Haddad's work.

## What I built

The site includes:

- an interactive whole-body microplastics journey;
- organ-by-organ evidence chapters with study context and limitations;
- interactive 3D anatomy references;
- practical exposure-reduction guides;
- *Homo Plasticus* book content and previews;
- the Beyond Plastic podcast experience;
- TEDx and media pages;
- newsletter and community flows;
- source, editorial, accessibility, and medical-disclaimer infrastructure;
- owner-facing tools for maintaining content without editing source code directly.

## Technology

The project uses a modern TypeScript and React stack with Next.js, Three.js, React Three Fiber, Vite/Vinext, Cloudflare tooling, Drizzle ORM, and Tailwind CSS.

A large part of the build also involved custom validation and regression tooling for visual changes, content integration, source traceability, accessibility-related checks, media, and release verification.

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

The site went through many tightly scoped review releases while it was being built. The old validation reports, change manifests, and audit logs are preserved for traceability under `docs/archive/` instead of taking over the repository root.

## Note

Say No to Plastic is an educational project, not a patient-specific medical product. Scientific and health-related material should not be interpreted as individualized medical advice.

## License

Source code in this repository is available under the [MIT License](LICENSE).

Third-party media, research material, supplied photography/video, book content, trademarks, and other non-code assets may have separate rights and are not automatically relicensed by the MIT License.