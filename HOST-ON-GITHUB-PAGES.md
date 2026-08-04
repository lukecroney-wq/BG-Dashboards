# Host the BG Dashboard as an installable app (GitHub Pages)

This turns your dashboard into a **web app**: one link you send once, that installs to the
home screen (iPhone/Android) or desktop (Mac/PC) like a real app, works **offline** after the
first open, and shows an **"Update available"** banner whenever you publish a new version.

It's **free**. No credit card.

---

## What's in this kit (the `pwa-kit` folder)

- `sw.js` — the service worker (offline + install engine)
- `manifest.webmanifest` — the app's name and icons
- `version.txt` — the current version (drives the update banner)
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` — the app icons

The dashboard HTML file already has the app code built in (v3-S159+), so you don't edit it.

---

## One-time setup (about 10 minutes)

1. **Create a free GitHub account** at https://github.com (if you don't have one).
2. Click **+ (top right) → New repository**.
   - Name it something like `bg-dashboards`.
   - Set it **Public** (required for free Pages).
   - Check **"Add a README"**, then **Create repository**.
3. Turn on hosting: in the repo, go to **Settings → Pages**.
   - Under **Build and deployment → Source**, choose **Deploy from a branch**.
   - Branch: **main**, folder: **/ (root)**. Click **Save**.
   - After a minute your site is live at:
     `https://YOURNAME.github.io/bg-dashboards/`

---

## Add a customer (one folder per customer)

Each customer gets their own folder so they each have their own data and their own app.

1. In the repo, click **Add file → Create new file**.
2. In the name box type the customer folder and a placeholder, e.g. `ahauto/README.md`, and Commit.
   (Typing `foldername/` creates the folder.)
3. Open that folder, then **Add file → Upload files**, and upload **all of these into the folder**:
   - your exported dashboard for that shop, **renamed to `index.html`**
   - `sw.js`
   - `manifest.webmanifest`
   - `version.txt`
   - `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`
4. **Set the version:** open `version.txt` in that folder and make it match the version shown in the
   bottom-right badge of the dashboard you just uploaded (e.g. `v3-S159`). Commit.

That customer's link is now:
`https://YOURNAME.github.io/bg-dashboards/ahauto/`

Send them that link. (Repeat with a new folder name for each shop.)

> Tip: keep the shared files (`sw.js`, `manifest.webmanifest`, icons) handy — you copy the same
> ones into every customer folder. Only `index.html` and `version.txt` differ per customer.

---

## How your customer installs it as an app

**iPhone / iPad (Safari):** open the link → tap the **Share** button → **Add to Home Screen** → Add.
An icon appears on the home screen; tapping it opens full-screen like an app.

**Android (Chrome):** open the link → tap the **⋮** menu → **Install app** (or **Add to Home screen**).

**Mac / PC (Chrome or Edge):** open the link → click the **install icon** in the address bar
(a small monitor/▽ icon), or menu → **Install BG Products Sales Insights**.

After installing, it works **offline** — no internet needed to open it.

---

## Publishing an update (this is the magic part)

When you improve a shop's dashboard:

1. Export the new file, rename to `index.html`.
2. In that customer's folder: **Upload files** → replace `index.html`.
3. Open `version.txt` and change it to the **new** version (e.g. `v3-S160`). Commit.

That's it. The next time the customer opens (or focuses) their installed app, it shows:
**"A new version is available — Update."** One tap reloads it to the new build. If they're offline,
they keep using the last version until they're back online.

> The only thing that triggers the banner is `version.txt` changing, so **always bump it** when you
> replace `index.html`. If you forget, the app still loads the newest file on a manual refresh — the
> banner just won't pop up on its own.

---

## Good to know

- **Free limits:** GitHub Pages allows files up to 100 MB and about 100 GB of traffic per month —
  far more than you need, with lots of room as the file grows.
- **Privacy:** a Public repo means the files are technically viewable by anyone who knows the exact
  URL. The dashboards contain the shop's sales figures. If that matters, options are: use unguessable
  folder names, or move to a paid private host later (Cloudflare Pages, Netlify, or GitHub Pages on a
  paid plan). Say the word and I'll write up a private-hosting version.
- **Custom domain (optional):** you can point something like `dashboards.yourcompany.com` at the site
  in Settings → Pages later.
- **The rep master file** stays on your computer — you don't host that one.
