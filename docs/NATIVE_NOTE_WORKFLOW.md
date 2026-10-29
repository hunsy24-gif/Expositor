# Writing inside native Supernote Notes — v1.0 alpha

The Expositor is a **bridge** from passage-based research into the native NOTE handwriting environment; it is **not** a replacement notebook editor.

## Option A: Put a prompt or research card onto the Note itself (new in v1.0)

1. Open an existing `.note` notebook and **turn to a new blank page**.
2. Open The Expositor from that NOTE page's toolbar. Choose your sermon dossier.
3. Choose **WRITE IN MY NOTE** to prepare a study stage, journal or research prompt. The six built-in choices include First Reading, Meaning, Personal Meditation, Sermon, Pulpit and Research.
4. Alternatively, find a **non-private** research card and tap **SEND TO NOTE**. From the Mentor Desk, tap **WRITE ANSWER IN NOTE** under a coaching question.
5. Review/edit the short text. Tap **INSERT INTO MY BLANK NOTE PAGE**, confirm the native permission dialog if asked, and choose **Return to writing**.
6. Write, underline, sketch, pray and add new pages with Supernote's **native pen system**.

**Safety:** The plugin refuses to write over occupied Note pages and refuses to insert while in a PDF/EPUB. It reads the current Note/page and checks again after permission prompts. It inserts *one short editable text box* via `PluginNoteAPI.insertText`, saves the Note, and leaves the majority of the page blank. It does not delete, replace or move ink. Failures do not pretend to succeed. **This is a new native integration and still requires a physical Manta test.**

**Privacy:** Personal prayer **prompts** may be inserted; private journal *content* and private research cards cannot be transferred automatically into an unencrypted NOTE. The user can write privately in the native Note instead. A NOTE file itself is not encryption.

**Important limitation:** The imported text box does not update the Expositor's internal research record when you add handwriting. Capture handwritten selections back with **Keep in Sermon** (on-device recognition is not guaranteed); originals remain native handwriting.

## Option B: Turn the bundled 16-page PDF into native Note templates

The companion file is called `The_Expositor_Native_NOTE_Handwriting_Templates.pdf`. Place it in **MyStyle** (USB, Supernote Partner or cloud file transfer). Open an existing native NOTE, choose **Templates → Customization**, locate the PDF and apply individual pages or a selection of pages. You can write directly on them in NOTE; this is **not merely annotating a PDF**.

Page types: First Reading; Literary Context; Text Structure; Genre Lens; Words & Questions; Source & Evidence; Interpretation Courtroom; Author's Burden; Scripture & Christ; Preacher's Heart; Bridge to Today; Sermon Movements; Pulpit Distillation; After the Sermon; Free Scripture Journal; Free Research Notes.

The PDF is 3:4 portrait with black/white high-contrast titles and most of each page intentionally blank for the pen. It does not need a functioning plugin.

Official reference: https://support.supernote.com/en_US/Tools-Features/using-pdfs-as-templates

## Research loop: source ↔ native Note ↔ dossier

- **Read** Scripture on the Manta or in e-Sword; write your first observations in native NOTE.
- **Digest** selected text from PDF/EPUB commentaries using Supernote's native Digest system; keep source name/page.
- **Index** selected handwritten or document text through Expositor's **Keep in Sermon**, reviewing OCR. A quotation is not automatically verified.
- **Reflect** in a native Note using a journaling page; don't store personally identifying pastoral counseling details in alpha builds.
- **Gather and apply** carefully: capture key evidence, cross-references, unresolved questions and user-authored interpretation in the dossier; send only a brief extract/prompt back to a blank NOTE page.
- **Rehearse** from the Note or a filtered pulpit export. The native Note is the master handwriting record; the dossier is an index.

## What we deliberately do not claim

- No automatic full-ink transcription into the sermon or invisible syncing of all Note pages.
- No guaranteed deep link back to every page or file; locations are indexed.
- No silent creation/deletion/overwriting of pages or notebooks.
- No embedded copying of the user's copyrighted pastoral books, commentaries or photographs.
- No guarantee of saving or pen responsiveness until tested on a real Manta running Chauvet 3.31.45.

## Manta acceptance test (use disposable notebook)

1. Add a new blank page in a disposable NOTE.
2. Open The Expositor → sermon → WRITE IN MY NOTE → Read & observe → confirm insertion.
3. Tap Return to writing; verify text appears at top and handwriting works beneath it.
4. Close and reopen NOTE, reboot Manta; text and pen strokes remain.
5. Try importing a second time on an occupied page; **must refuse**.
6. Open PDF and attempt Note insertion; **must refuse**.
7. Return to blank NOTE, send one non-private source card; verify title, page, and unverified status.
8. Confirm no private journal card has a transfer control. If anything crashes, report action, firmware, and screenshot.

## SDK engineering references

- Supernote SDK Note text insertion and save: https://github.com/apclark31/supernote-plugin-research/blob/main/src/sdk/PluginNoteAPI.ts
- Device-proven, text-box insertion example: https://github.com/AdamDiament/snBible/blob/main/src/insert.ts
- Supernote NOTE templates: https://support.supernote.com/en_US/Tools-Features/using-pdfs-as-templates
