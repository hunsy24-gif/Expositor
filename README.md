# The Expositor — Manta-first sermon research

**0.8.0 alpha, targeted to Chauvet 3.31.45.** A single home for passage-first expository preaching, handwritten research, sourced quotations, prayer, and pulpit preparation.

### Design discipline

Scripture leads. The preacher studies. The sermon follows. The plugin does not create sermons or interpret biblical passages on the preacher's behalf.

### v0.9 stability and e-ink changes

- Tested storage-core: corruption fallback, two-copy retention, read/write failure visibility and refusal to overwrite data written by a newer Expositor version.
- Confirmation before navigating away from unfinished research or an unsaved exegetical idea; no silent discarding when closing the plugin.
- A research card being edited cannot be moved to a different sermon through the new-card destination selector.
- Simpler top toolbar, readably sized pen targets, save feedback.
- Reliable registered toolbar icon path and separate stroke / typed-text NOTE selection buttons (on-device confirmation still required).
- Single in-flight ink recognition; a new lasso cannot overwrite another pending research capture.
- Pure-JS load/save and corpus-size regression tests added to CI.

### What's genuinely implemented

- Saved, searchable sermon dossiers: passages, series, observation/interpretation/reflection/sermon/pulpit stages, central idea and purpose.
- Note/Document toolbar actions, including **Keep in Sermon** lasso or document text-selection.
- **New in 0.8:** on-device NOTE handwriting OCR, typed NOTE lasso extraction, and PDF/EPUB DOC selected text retrieval. The extracted text is shown in an editable card; original ink and documents are not changed. It is always **To verify** until checked by the preacher.
- **New in 0.8:** current file/page reference, explicit ability to change the target sermon before saving, last active sermon retained across restart, prominent **Return to Note** control and >=44dp tap targets.
- Per-sermon research cards: own observations, questions, structure, commentary references, cross-references, illustration/image references, application, private journal and prayer.
- Source-informed Mentor Desk questions based on users' preaching library (original questions, **not** verbatim attributed quotations).
- Pulpit-selected public exports with private journal/prayer data excluded and unverified exact quotations blocked.
- Local persisted JSON model with verification, previous-save recovery and opt-in full backup/merge.

### Firm limits / safety

- This alpha **has been compiled in GitHub Actions and package-verified**, but physical Manta opening, OCR accuracy, document selection, navigation, long-term storage and update migration **must be tested on the device**. Code cannot guarantee firmware integration.
- The plugin stores the selected text and source path/page as records. **It does not paste ink into the app**, embed image files, automatically create Note files or guarantee direct tappable links back to sources.
- No online research, AI calls, or telemetry. Only the user can import or export data via their chosen share destination.
- **Private** means excluded from public outputs, not encrypted. Do **not** put confidential counseling records in this alpha. Full JSON backup includes private notes and is not encrypted. 
- Back up prior to updating. Use throwaway handwritten notes for the first OCR and restart tests.
- Installing manually sourced plugins bypasses Supernote's review process. Review requested permissions. Current plugin needs FILE:READ to capture selected ink and pages. It does not request file write, delete, or network permission.

### Install

Download the latest **verified release** from GitHub Releases; transfer the real `.snplg` (not an Actions ZIP) into `MyStyle`. On your Manta choose Settings → Apps → Plugins → Select Plugin Package → Install.

### First 10-minute test

1. Create a test dossier named “Mark 2:13–22”; save and reopen it.
2. Write a sentence in a disposable NOTE. Lasso it; choose **Keep in Sermon**; check the recognized text and source page against your ink.
3. Change the destination sermon, return, verify the correct dossier receives the card, then save.
4. Select text in a throwaway PDF via the Document text-selection tool; use the selection toolbar's **Keep in Sermon** and verify the selected text and source location.
5. Add a Prayer card marked Pulpit, and an unverified exact quotation marked Pulpit. Export research and pulpit notes; both must be omitted.
6. Exit using **Return to Note**. Close/reopen the plugin and restart your Manta. Make sure every test card and active sermon persists.
7. Export a complete backup and keep it somewhere safe; do not share it publicly.

### Development

- Native build: `bash build_on_workstation.sh` (Node 22, JDK 21, Android SDK).
- CI: `.github/workflows/build-supernote-plugin.yml`
- Product direction: `docs/EXPOSITOR_MASTERPLAN.md`
- Device feedback and release gate: `docs/DEVICE_TEST_V08.md`

Original sources include Supernote's official Chauvet 3.31.45 changelog, official Plugin installation documentation, and community SDK examples from Task Hub and sn-dictionary.

**The Manta is the primary handwriting surface. The Expositor organizes and retrieves Scripture-centered work rather than replacing NOTE with a cramped text editor.**
