# Kivi Ledger - Submission Package

Kivi Ledger is an interactive Next.js prototype for capturing, transforming, and revisiting personal notes across Narratives, Conversations, Memory, Utility, and History.

## Package structure

This repository intentionally has four visible top-level items:

- `README.md` - project overview and local prototype access
- `RUN.md` - clean-machine, production, and GitHub upload instructions
- `docs/` - submission documents and permanent visual reference
- `source-code/` - the complete runnable Next.js prototype

`docs/` currently includes the product-position document, vision document, and [reference PDF](<docs/Reference Images.pdf>). Add any final PDF versions of the positioning or vision documents to this same folder before submission.

## Run the interactive prototype

Requirements:

- Node.js `20.9.0` or newer
- Node.js `24.20.0` and npm `11.19.0` were used for validation

```bash
cd source-code
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). This is the local interactive prototype link. A hosted URL does not exist until you deploy the repository yourself.

For the full run, production, and GitHub upload process, see [RUN.md](RUN.md).
