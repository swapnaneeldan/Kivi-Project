# Run and publish Kivi Ledger

## 1. Run it locally

You need Git and Node.js `20.9.0` or newer. The project was validated with Node.js `24.20.0` and npm `11.19.0`.

From this package folder:

```bash
cd source-code
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Stop the local server with `Ctrl+C`.

## 2. Check the production version locally

```bash
cd source-code
npm run lint
npm run build
npm run start
```

Then open [http://localhost:3000](http://localhost:3000). `npm run start` only works after a successful build.

## 3. Upload this package to GitHub

1. Go to GitHub in your browser, sign in, and create a **new empty repository** named `kivi-ledger` (do not ask GitHub to add a README, `.gitignore`, or license).
2. In Terminal, go to this package folder:

   ```bash
   cd "/Users/swapnaneeldan/Desktop/Files/Miscellaneous/kivi.ai/kivi-ledger"
   ```

3. Check what will be uploaded:

   ```bash
   git status
   ```

4. Stage the complete package and the removals made during repackaging:

   ```bash
   git add -A
   git commit -m "Prepare Kivi Ledger submission"
   ```

5. Copy the repository URL that GitHub gives you. Then connect and upload it:

   ```bash
   git remote add origin <paste-your-github-repository-url-here>
   git branch -M main
   git push -u origin main
   ```

6. Confirm in your GitHub browser tab that you see exactly `README.md`, `RUN.md`, `docs/`, and `source-code/` at the repository root.

## 4. Host the interactive prototype

GitHub stores the code; it does not run this Next.js app by itself. To give reviewers a clickable prototype link, import the GitHub repository into a Next.js-compatible hosting service.

When the host asks for the project settings, use:

- Root directory: `source-code`
- Install command: `npm ci`
- Build command: `npm run build`
- Start command (if requested): `npm run start`
- Environment variables: none

After deployment, test the real hosted link and place that URL in your submission form. Do not invent a URL before it exists.

## Troubleshooting

| Problem | What to do |
| --- | --- |
| Port 3000 is busy | Run `npm run dev -- -p 3001` from `source-code`, then open `http://localhost:3001`. |
| `npm ci` fails | Check `node --version`; it must be `v20.9.0` or newer. |
| `npm run start` fails | Run `npm run build` first. |
| The app looks stale during testing | Use a private/incognito browser window or clear local site data, then reload. |
