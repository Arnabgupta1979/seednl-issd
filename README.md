# seednl-issd

Demo pilots for the proposed SeedNL × WSER course on guiding seed sector transformation. **Pilots for review, not approved course content.** All farmers and places are fictional.

| Path | What |
|---|---|
| `index.html` | Landing page linking the demos |
| `demos/e02-many-routes/` | E02 animated explainer, script and captions (**no recorded audio**) plus editable sources |
| `demos/g01-seed-choices/` | G01 farmer seed-choice activity plus editable sources and docs |
| `docs/` | Mapping to the V2.0 objectives, storyboard, debrief, test record |

## View online (GitHub Pages)
Settings → Pages → Deploy from branch → `main` / root. The site is then at `https://arnabgupta1979.github.io/seednl-issd/`. The landing page carries `noindex`, which only discourages search engines. It does not make the site private.

## View locally
Unzip or clone and double-click `index.html`. Chrome or Edge is safest. If the game's separate script files are blocked, open `demos/g01-seed-choices/G01_standalone.html`.

## Edit
- **Game:** content is in `demos/g01-seed-choices/js/data.js`. After editing run `node build_single.cjs` in that folder.
- **Explainer:** edit `scenes.js` and `manifest.json`, then `node build.cjs` and `node make_captions.cjs` in `demos/e02-many-routes/`.

## Adding another demo
Create `demos/<name>/`, add a card to `index.html`, add a line to this table.

## Embedding in an LMS
Not yet tested (TalentLMS vs Curatr undecided). Candidate: an iframe pointing at the Pages URL (explainer 16:9; game about 900 px tall) with a direct-link fallback. See `docs/Test_record.md` for what has and has not been tested.

## Limits
Generic seed-system statements need expert review (`demos/g01-seed-choices/docs/Source_register.md`). Not tested on real LMS, screen reader, phone, Safari or Firefox.
