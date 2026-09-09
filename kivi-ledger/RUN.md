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

## Troubleshooting

| Problem | What to do |
| --- | --- |
| Port 3000 is busy | Run `npm run dev -- -p 3001` from `source-code`, then open `http://localhost:3001`. |
| `npm ci` fails | Check `node --version`; it must be `v20.9.0` or newer. |
| `npm run start` fails | Run `npm run build` first. |
| The app looks stale during testing | Use a private/incognito browser window or clear local site data, then reload. |
