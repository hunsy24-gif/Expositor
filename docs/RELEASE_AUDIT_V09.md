# Expositor v0.9 — Release Audit and Device-Validation Matrix
**Target:** Manta, Chauvet 3.31.45 (official October 20, 2026 release).  
**Status:** native build candidate. CI compilation and source-level tests do **not** constitute a physical Manta pass.  
**Scope:** all currently implemented Expositor behavior. The separate master plan lists future work not shipped in this alpha.

## Results legend

- **TESTED IN CI** = runnable automated tests on GitHub runner (pure model, UI-source assertions or package build).
- **SOURCE REVIEW** = code checked against working open-source SDK plugins; real firmware behavior unverified.
- **DEVICE REQUIRED** = user needs to test it on the actual updated Manta.
- **NOT IMPLEMENTED** = proposal; do not advertise.

| ID | Area | Required behavior | Verification | Remaining concern |
|---|---|---|---|---|
| 01 | Firmware | Plugin format compatible with Chauvet 3.31.45 React Native 0.79.2 | Native CI build and SDK template | DEVICE REQUIRED |
| 02 | Installer | Valid ZIP-backed .snplg with JS bundle, native .npk, config, icon | Package verifier in CI | DEVICE REQUIRED |
| 03 | Installation | Install via MyStyle → Settings/Plugins | Official documented flow | DEVICE REQUIRED |
| 04 | Main toolbar | Expositor opens in NOTE and DOC | registerButton(1) review, localized name and iconURI | DEVICE REQUIRED |
| 05 | Stroke lasso | Save source-selected handwriting without modifying strokes | API review and capture code | DEVICE REQUIRED |
| 06 | Text lasso | Separate typed Note text-box button [3] | Source API review; code | DEVICE REQUIRED |
| 07 | DOC selection | Read last selected PDF text | PluginDocAPI.getLastSelectedText code and community example | DEVICE REQUIRED |
| 08 | OCR | recognizeElements with current page display size | Community reference and source review | DEVICE REQUIRED; may fail on complex ink |
| 09 | Lasso teardown | setLassoBoxState(2), including failed read permission | Source review | DEVICE REQUIRED; ensure pen remains interactive |
| 10 | Selection source | Current file and page indexed without mutating original | Source review | DEVICE REQUIRED; manual path fallback |
| 11 | Source return | Tap index to reopen exact PDF/NOTE page | NOT IMPLEMENTED | No direct links guaranteed |
| 12 | Sermon creation | Passage + working title creates dossier | CI domain tests | DEVICE REQUIRED |
| 13 | Sermon switching | Active dossier persists across restart | CI model tests | DEVICE REQUIRED |
| 14 | Prevent misfiling | Editing existing card cannot choose other sermon silently | UI source guard | DEVICE REQUIRED |
| 15 | Protect unsaved drafts | Navigation and Return warn before discard | UI source guard | DEVICE REQUIRED |
| 16 | Capture race | One recognition at a time; previous draft protected | Source guard | DEVICE REQUIRED |
| 17 | Resource types | Observations, commentary, questions, exact/paraphrased quotations, image references, prayer | CI domain tests | Images are references only, no binary import |
| 18 | Search | Public research searchable by title, passage, body and source | Source review | DEVICE REQUIRED; unrecognized handwriting not searchable |
| 19 | Private entries | Private journal/prayer cards excluded from public exports | CI privacy tests | **NOT ENCRYPTED** |
| 20 | Exact quotations | Unverified exact quotations excluded from pulpit | CI tests | Human must verify original wording |
| 21 | Research and pulpit | Public research and filtered pulpit selected cards exported via Share | CI model tests | DEVICE REQUIRED for share sheet |
| 22 | Mentor Desk | 5 sermon stages, original historical-source-informed questions | CI mentor tests | Interpretation belongs to preacher |
| 23 | Exegetical review | 10 checkpoints and text-first stage workbench | CI domain tests | Not spiritual performance metrics |
| 24 | Storage | Save, reread, previous-copy recovery and corrupted-write behavior | CI storage-core tests | DEVICE REQUIRED for AsyncStorage |
| 25 | Version migration | v1/v2 to v3 model; refuse future unsupported version | CI tests | DEVICE REQUIRED across upgrades |
| 26 | Backup | Full JSON share and non-destructive merge | CI domain tests | Device share may limit size; backup NOT encrypted |
| 27 | Scale | Model round-trip on 25 dossiers/2500 cards | CI test; pure JS only | NOT a proven physical storage quota/performance result |
| 28 | E-ink design | Monochrome, large touch targets, simple navigation | Source audit | Device readability/refesh test required |
| 29 | Rehearsal/manuscript | Full manuscript mode / timed rehearsal | NOT IMPLEMENTED | Planned |
| 30 | Treasure archive | Cross-sermon linked sources, Scripture range index | NOT IMPLEMENTED | Planned |
| 31 | Pictures/maps | Image attachment/gallery with rights/source | NOT IMPLEMENTED | References only |
| 32 | Confidential journals | Encrypted private records/backups | NOT IMPLEMENTED | Do not store counseling-identifiable data |

## Release-blocking checks for physical device

Do not call this plugin dependable for ongoing ministry until ALL pass:
1. Install; enter from NOTE; return to NOTE, pen still writes.
2. Lasso an ordinary handwritten sentence, save OCR into Mark 2:13–22, check original ink preserved.
3. Select text in a non-confidential PDF and save to correct dossier with real source path/page.
4. Create a second sermon, switch back, confirm no misfiling.
5. Make an unsaved card; attempt Home and Return; verify warning, no unexpected loss.
6. Save ten cards, quit, reopen, reboot; verify each remains.
7. Export public/pulpit; private journal and prayer must be absent. Exact quotation requires verified provenance.
8. Export complete JSON backup to a private destination; if device share fails, record the failure. Restore to disposable installation only after making an independent copy.
9. Repeat after plugin update; ensure same pluginID preserves data.

## Strongest findings from the v0.8 code audit and fixes in v0.9

- **DATA LOSS RISK:** Leaving unfinished resource/idea editors did not warn; now guarded.
- **MISFILING RISK:** Editing a card while choosing another sermon could lose the card or file it incorrectly; editing cannot change destination.
- **BUILD/INTEGRATION RISK:** Toolbar icon used an asset URI that may not resolve in firmware; now attempts installed plugin icon path with asset fallback.
- **LASSO INTEGRATION RISK:** Separate typed NOTE text-box and handwritten NOTE buttons; PDF selection uses its own action.
- **STUCK INPUT RISK:** NOTE lasso released on normal/failure paths, including permission denial; device confirmation required.
- **DATA CORRUPTION RISK:** Storage now has explicit corruption, readback, migration and I/O failure tests; will not overwrite a newer-version database.
- **REPEATED CAPTURE RISK:** In-progress capture lock and dirty-card gate prevent a second event from replacing unsaved ink.
- **E-INK USABILITY:** Simplified header, >=44dp buttons, explicit Return to Note.
- **TRUTHFULNESS:** A successful JavaScript/Android build is not proof of physical behavior or the final “ultimate plugin” vision.

## Sources informing engineering

- Official Supernote Manta changelog: https://support.supernote.com/changelog-for-manta-and-nomad
- Supernote plugin developer materials: https://github.com/AgP42/SuperTemplate
- Community Manta-tested NOTE/DOC lasso: https://github.com/j-raghavan/sn-dictionary
- Community pen-handwriting recognition and capture: https://github.com/Sparkinman/task-hub-supernote-plugin

Private sermon data and third-party copyrighted book contents must not be committed to this public GitHub repository.
