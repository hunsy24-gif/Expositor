# THE EXPOSITOR — MASTER PLAN
**Version:** Research and product specification 1.0 · 29 October 2026  
**Target:** Supernote Manta, Chauvet 3.31.45, official React Native 0.79.2 PluginHost  
**Status:** Design and implementation backlog. This document describes **proposals**, not existing v0.6 functionality.

## Nonnegotiable mission

The Expositor exists to help a preacher **receive, interpret, believe, organize, and proclaim** the meaning of a biblical passage faithfully. Scripture has final authority; a human preacher does the exegesis and bears the responsibility. Neither an AI model nor a revered commentator adjudicates interpretation.

**Three homes, one connected workflow:**
- **Scripture Study**: original passage and authorial burden.
- **Sermon Dossier**: all discoveries, sources, questions, private reflections, media references, and preaching outputs for one sermon.
- **Lifetime Treasury**: lasting insights linked across passages, prior sermons, and reading.

**Anti-goals:** auto-written sermons; fake historical quotes; forcing Christ into texts by shortcuts; confusing an AI confidence score with interpretive warrant; compulsory forms that crowd handwriting; extracting private pastoral notes; irreversible changes to original NOTE/DOC files; treating the Spirit's work as a completion score.

## Historical / homiletical source map

Sources below are **paraphrased design influences**, not embedded copyrighted book content. Page numbers refer to the user's own PDF copies, not necessarily print pagination. These source files are not included in this public GitHub repository.

| Source | Specific location | Faithful takeaway | Design translation |
|---|---|---|---|
| C. H. Spurgeon, *Lectures to My Students*, choice of text, minister's self-watch, private prayer, illustrations, commentaries, impromptu speech | Public-domain original; The Spurgeon Library discussion of his preparation | Meditation and preparation are lifelong; consult sources without surrendering first-hand engagement; a brief outline may arise from extensive preparation. Spurgeon's personal weekly timetable is not universal | Daily treasury capture; source-first, then commentary comparison; distillation into pulpit notes |
| James W. Alexander, *Thoughts on Preaching* | PDF pp. 4–5 (journal origin), 9–10 (meditation), 18–20 (repetition/Scripture memory), 237–262 (expository preaching) | Journaling supports lifelong learning; expository preaching trains congregations to read books in context; warns against ingenious divisions and thin messages | Scripture continuity map; journal-to-sermon links; repeated-idea detector; substance-before-rhetoric audit |
| D. Martyn Lloyd-Jones, *Preaching and Preachers* | PDF pp. 172–191 (preacher), 192–211 (sermon preparation), 212–230 (shape), 311–335 (Spirit) | Preacher's life and sermon are distinct; reflect and pray; retain logical progression; resist cleverness, formalism, and mechanical dependence on notes; preparation and spiritual dependence are complementary | Personal prayer journal kept private, logical-flow test, text-centered review, flexible pulpit modes |
| Haddon Robinson, *Biblical Preaching* | PDF pp. 33–48 (idea), 53–78 (text study), 79–115 (text to sermon/purpose), 117–158 (structure/development) | Subject + complement become exegetical idea; analyze, then translate into homiletical idea and determine purpose | Exegetical idea worksheet with proof references and purpose/response fields |
| Bryan Chapell, *Christ-Centered Preaching* | PDF pp. 61–109 (priority/components), 237–268 (application), 306–375 (redemptive connections) | Contextual meaning and redemptive context matter; fallen condition focus is not merely felt needs; application needs textual warrant and grace-shaped enablement | Need/grace/application workshop with anti-moralism checks and canonical-path tracing |
| Richard Baxter, *The Reformed Pastor* | PDF pp. 18–41, 42–73, 101–143 | Guard the minister's own heart, care for the actual flock, instruct real people rather than perform abstractly | Pastoral-hearer categories and prayerful care without storing confidential counseling details |
| Robby Gallaty & Steven W. Smith, *Preaching for the Rest of Us* | PDF pp. 39–50, 51–108, 175–177 | Re-present **substance, structure, and spirit**; distinguish internal literary frame from canonical frame | Three-part fidelity audit and genre-aware movement editor |
| Ryan Fullerton, Jim Orrick & Brian Payne, *Encountering God Through Expository Preaching* | PDF pp. 147–174 and 175–217 | Ask how a text fits, says, is built, and stays; actual proclamation should grow out of the preacher's experience of God's Word | Four-questions workbench and differentiated manuscript/outline/no-notes rehearsal |
| John Piper, *The Supremacy of God in Preaching* | PDF pp. 17–48, 84–88 | Godward aim, gravity and gladness, tethering every claim to Scripture | Godward theological check and claim-to-verse evidence |
| John Stott, *Between Two Worlds*, chapter “Preaching as Bridge-building” | User-supplied EPUB | Faithful exegesis and contemporary understanding are both required; application must not rewrite the original message | Ancient-world/modern-hearer two-column bridge |
| H. B. Charles Jr., “On Sermon Preparation”; “A System of Sermon Preparation”; “On Sermon Outlines” | ftc.co, hbcharlesjr.com, preachingandpreachers.org | Read and pray; study text; consult sources; craft thesis, purpose and structure; draft for clarity; internalize and distill for speaking | Time-saving pipeline with manuscript / outline / pulpit cards and rehearsal |
| Craig Blomberg, *Preaching the Parables* | User-supplied PDF | Parables require genre-sensitive reading and attention to the particular narrative and interpretive controls | Optional parable-specific study sheet; not a universal rule for every biblical genre |

**Editorial rule:** these authorities inform *questions and training*, not the substance of the biblical answer. Never silently label a generated paraphrase as an exact author quotation.

## The ideal pastor's experience: 14-step trail

The user can skip/reorder stages when prudent; do not force a ritualistic checklist or a fixed number of points. Each stage saves useful evidence and an optional transition into the next stage.

| # | Workspace | The question answered | Saved outcome | Safeguard |
|---|---|---|---|---|
| 0 | Gather / prayer | What passage, congregation, occasion, and reason am I preaching? | Sermon ID, book, pericope, preaching date, optional prayer | No invented “divine leading” score |
| 1 | Read first | What does the text actually say? | Observation, repeated words, syntax, commands, contrasts, events | Commentary hidden by default until observations recorded (override available) |
| 2 | Trace the book | What comes before and after, and how does this passage advance the author's purpose? | Context map, structure of book, parallel passages | Do not isolate a verse |
| 3 | Discover structure | How does the author develop his argument/narrative/poem? | Textual movements with verse anchors | Do not force three alliterated headings |
| 4 | Investigate | What linguistic, cultural and historical questions actually affect interpretation? | Question ledger; original-language notes; answers with sources | Lexical fallacy and historical-guess warnings |
| 5 | Compare interpretations | What are the strongest plausible readings and where do they diverge? | Alternative views with evidence, uncertainty, decision | Present fair alternative; note contested conclusions |
| 6 | Exegetical burden | What did the author communicate, to whom, and why? | Robinson subject/complement and one-sentence exegetical idea | Required link to textual evidence, not a confidence percentage |
| 7 | Canonical and redemptive context | How does this fit Scripture's unfolding story and Christ's work? | Reference chain with relationship type: direct, typological, thematic, redemptive-historical, illustration | No forced messianic links, no bare cross-reference lists |
| 8 | First hearer / present hearer | What did this mean then; why does it matter now? | Ancient-to-present bridge, cultural assumptions | Preserve original meaning across the bridge |
| 9 | Preacher's heart | What must I personally believe, repent of, pray, or rejoice in? | Private journal; prayer | Not part of public sermon exports, never interpreted as piety grade |
| 10 | Pastoral response | How should this passage address different kinds of hearers? | Audience matrix with textual justification; gospel and grace | No identifying counseling cases |
| 11 | Sermon architecture | What should the congregation grasp, feel, and do? | Homiletical idea, purpose, text-governed movements, transitions | Any key point without verse support flagged |
| 12 | Substance to speech | Have I explained, illustrated, applied, and urged the text clearly? | Full draft, selected sourced stories, alternative modes | Illustration may not become the controlling message |
| 13 | Rehearse / preach / learn | Can I preach clearly; what followed, and what did I learn? | Spoken-speed pulpit notes, rehearsal log, prayer, brief after-action review | Outcomes not a “success” metric; preserve feedback honestly |

### Genre lens (automatically *suggested*, never imposed)

- **Gospels / narrative:** scenes, speakers, conflict, plot, narrator emphasis, response, context; resist speculative psychology.
- **Epistles:** discourse relationships, argument, imperatives supported by indicatives, historical situation, theological logic.
- **Poetry / Psalms:** voice, parallelism, imagery, shifts in emotional movement, canonical setting.
- **Prophecy:** covenant historical setting, oracles, judgment, restoration, literary images, fulfillment claims with warranted evidence.
- **Parables:** audience, provoking situation, story movement, contrasts, central burden; guard against uncontrolled allegory.
- **Wisdom:** genre and generalization vs promise, moral reasoning, tension with the rest of Scripture.
- **Apocalyptic:** symbolism, Old Testament echoes, immediate audience, literary setting, disputed interpretive schemes made transparent.

## The Sermon Dossier: single home for every resource

Each dossier needs:
- Main identity: sermon ID, passage reference, Bible book, pericope bounds, series, date, status, genre, audience categories.
- Five browsable shelves: **Text**, **Questions**, **Research**, **Heart**, **Pulpit**; the same record may appear in multiple shelves via tags.
- Resource types: own handwritten observations, transcribed text, PDF/EPUB Digest references, commentary notes, quotations, article references, source images/diagrams/maps, lexical findings, cross-references, illustrations, application ideas, objections, sermons/lessons, private journal reflections.
- Exact source provenance: title/author/edition, source type, original file URI/path, page/paragraph locator, URL (if available), exact vs paraphrase, verified/uncertain/disputed status, date accessed, license and re-use rights for images.
- Importance states: **To investigate → Evidenced → Useful but not for this sermon → Pulpit candidate → Used in sermon**.
- Cross-sermon backlinks (a note can belong to multiple sermons without destructive copies).
- Biblically sensible search index across references, ranges, tags and recognized text; no claim to search unrecognized ink until device API supports it.
- Reopen original source location (must be device-tested; manual fallback to document path/page).

### One-tap capture choices

From NOTE/DOC lasso, document text selection, native Digest, or a linked import:
1. **Keep observation** (original note path and selected-element metadata; original ink unchanged).
2. **Save research** (source/author/page captured; editable note).
3. **Save question** (question queue with follow-up and answer supported by sources).
4. **Save quotation** (exact and verified only if transcription/source checked).
5. **Keep privately** (private heart journal; never publicly exported).
6. **Connect passage** (verse reference + relationship type).

The native **Supernote Digest** already captures document excerpts and recognized handwriting, including category and source information. Prefer its existing features and documented user-initiated export paths; do **not** promise undocumented programmatic digest creation, mass reading, or guaranteed full-ink recognition. Source: support.supernote.com article “What Is Digest and What Does It Do?” (updated May 2026).

## The *five* most important new intellectual tools

### 1. Exegetical Courtroom (propose, test, revise)
A claim card contains: proposed meaning; exact verse evidence; literary logic; best competing reading; commentary comparison; textual difficulties; decision; still-unresolved matters. It never shows “95% true.” Coach asks *Where is that in the text?* and points to specific unsupported leaps. User retains final judgment.

### 2. Sermon Logic Map
Each sermon movement has a relation to the exegetical idea (defines, proves, explains, illustrates, contrasts, applies, invites) and a Scripture reference. Detect orphan sections, excessive introduction, unrelated tangents, repeated points, and application before explanation. The app should gently ask rather than rewrite the preacher's thought.

### 3. Bridge and Application Lab
Each application links an original authorial meaning, an enduring principle, a contemporary life situation, an intended response and gospel-shaped enablement; add audience categories (unbeliever, weary believer, confident religious person, youth, parent, suffering saint) without trying to represent those as equally present in every text. Distinguish God-given promises from moral prescriptions.

### 4. Source Integrity Vault
Citation manifest linked to original page. “Exact quotation” requires verification. “Paraphrase” may be useful but can never be displayed in quotation marks as if original wording. Copyright and media-rights metadata; public repo contains no third-party text from licensed user PDFs. Unsupported historical story tagged “unverified.”

### 5. Pulpit Internalizer
Three non-destructive outputs: **full manuscript**, **spoken outline**, **one-page pulpit card**. Read aloud with optional manual timing, practice stating idea in 15 seconds / explaining one movement in 60 seconds, reveal hidden supports after verbal rehearsal. Prayer remains prayer, not a completion badge. Notes should support eyes-up preaching, not penalize full-manuscript preachers.

## The *five* most important organizational tools

1. **Lifetime Treasury:** topical wisdom notes linked to passage, preacher, sermon, and source; intentional resurfacing for future preaching, not algorithmic claims about God's providence.
2. **Series Continuity:** passage coverage, unresolved study questions, previous and next sermon, key repeated book motifs, congregational learning goals.
3. **Reading Queue:** source PDFs/EPUBs, progress, urgent research, reference-only, finished; no duplicate-copy mania.
4. **Sermon Recycler:** when returning to a previously preached text, open the Bible fresh first, then compare the old sermon; prevent blind reuse.
5. **Post-Sermon Review:** what the congregation asked, what was unclear, what could be improved, what to revisit, prayer notes; avoid vanity metrics.

## Manta UX rules

- Primary tool for writing remains **native Supernote NOTE**. Do not replace handwriting with cramped React Native text inputs.
- Single narrow information panel, large tap targets, monochrome and high contrast, no continuous motion or frequent e-ink refresh.
- Dashboard answers **“What should I work on next?”**. Only one active recommendation and a few links to Scripture, Questions, Research, Heart and Pulpit.
- Each study stage has (a) short pastoral question, (b) link to the original passage, (c) generous handwritten area via native NOTE, (d) one-tap keep/source association, (e) optional evidence review.
- No arbitrary step is required to unlock the next stage. Do not gamify prayer or authority of Scripture with scores.
- SOURCE / EXEGESIS / HEART / SERMON / PULPIT tabs and staged shelves fit the 3:4 e-ink display.
- Prefer native headings, keywords, links and Digests over reinventing their features.
- Support safe back navigation and preserve unsaved drafts when a tool is closed or user returns to native reader.

## Optional AI, future phase only

Only with explicit user opt-in, clear disclosure, data-minimization and independent controls; do not send private journal or identifying pastoral data. The model reviews user-developed interpretations and sources, identifies unsupported claims, and offers relevant alternative readings **with evidence**. It cannot declare spiritual leading, make up author citations, or generate final sermons without deliberate user request. Offline-first core remains useful with airplane mode.

## Data and reliability contract

The current v0.6 uses local AsyncStorage with an unencrypted privacy flag; do not claim encrypted private pastoral records. Future robust vault should use a versioned schema and recoverable local file storage, stable document identifiers plus source path fallback, backups/restores, safe migrations and automated testing. Specific entities:

```text
Sermon(id, passageStart, passageEnd, seriesId, version, date, genre, status)
StudyStage(sermonId, stage, summary, completeOptional)
Source(id, kind, title, author, edition, originalUri, page, rights, verified)
Discovery(id, sermonIds[], sourceId?, verseRange, kind, text?, noteUri?, tags[], evidenceIds[])
Claim(id, sermonId, statement, textEvidence[], counterevidence[], resolution)
Application(id, sermonId, verseRange, audienceCategory, warrant, response, grace)
JournalEntry(id, sermonId?, privacy="private", noteUri, date)
SermonMovement(id, sermonId, order, claimIds[], scriptureRefs[], function)
Output(id, sermonId, kind="manuscript|outline|card", immutableRevision, timestamp)
```

- **Data privacy:** Export from the public/pulpit views must exclude `JournalEntry` and all prayer/private cards. Search excludes them by default. A **complete backup** necessarily contains private material and must be clearly warned and encrypted in a future version.
- **Data durability:** test restart, update, interrupted write, corrupt file, backup/restore, deleted references, duplicate IDs and migration. Fail closed for invalid data.
- **No invented evidence:** quoted text is not `Verified` merely because a model produced it.
- **No unsafe automatic imports:** preserve copyright, licensing and privacy. Never upload user books/notes to the public GitHub repo.
- **No destructive edits to NOTE/DOC:** capture and index by reference; verify navigation before advertising it.

## Implementation sequence and objective release gates

**Currently shipped:** v0.6.0-alpha native installer, confirmed built and structurally validated in GitHub Actions. No physical Manta test report is recorded in this repo.

### A — Reliability-first (required for any trustworthy daily use)
1. Confirm device opening, NOTE/DOC buttons, permissions, saving/reopening/restart.
2. Eliminate unsaved draft losses and resource misfiling between sermons.
3. Versioned data export, restore, migration and privacy regression tests.
4. Source references with document relocation recovery.
**Gate:** 25 disposable dossiers / 100 cards / device restart / successful backup-and-restore; no lost or misclassified data.

### B — Text-first Research Workbench (highest preaching value)
5. Text and pericope map, observational handwriting shortcuts.
6. Exegetical questions + evidence ledger + alternatives.
7. Genre-sensitive structure analyzer and Robinson subject/complement.
8. Commentary citation and provenance cards; digest capture guidance.
**Gate:** Mark 2:13–22 can be researched without unsupported automatic conclusions; every major claim has verse evidence.

### C — Heart, application and pulpit (second-highest preaching value)
9. Private journal with genuinely separate storage, explicit privacy and encryption strategy.
10. Ancient→modern bridge, grace-shaped application, differentiated hearers.
11. Movements, transitions, manuscript, clear pulpit outputs.
12. Spoken-speed rehearsal and after-sermon review.
**Gate:** Preacher can complete an expository sermon without leaving dossier organization; no private material reaches a public output.

### D — Lifetime library (highest long-term value)
13. Scripture reference index with pericope coverage.
14. Search and backlinks across sermon projects; reading queue.
15. Saved verified quotations, historical images and attribution.
16. Sermon resurface / renewal / series continuity.
**Gate:** A discovery linked to Mark 2 and Isaiah 62 appears in both study contexts without duplicating source files.

### E — Optional connected research and coaching
17. Offline-first local companion import for user-authorized source files; optional PC/e-Sword export.
18. AI review only on a user-initiated, scrubbed draft; source provenance and explicit uncertainty.
19. Search, backup and media import performance / accessibility testing on Manta.
**Gate:** With all network and AI features disabled, the plugin remains fully useful.

## Example: Mark 2:13–22 as the integration test

**Provisional investigation, not a sermon outline:**
- Observe two connected controversies: Jesus eating with tax collectors/sinners (vv. 13–17) and fasting / bridegroom / garments / wineskins (vv. 18–22).
- Ask why Mark put these scenes together within Mark 2:1–3:6.
- Track Jesus' self-descriptions: physician and bridegroom; examine the future “taken away” language without jumping beyond textual evidence.
- Test historical questions about tax collectors, table fellowship and fasting; keep source provenance.
- For bridegroom/feast imagery, investigate OT parallels and mark whether links are direct, thematic or speculative.
- Warn against a generic “embrace change” sermon; ask what newness means *in Mark*.
- Leave the exegetical idea unset until the preacher has studied, questioned and weighed the material.
- Privately journal on need for the Physician; do not push that entry into sermon export.
- Only then draft movements and applications that can be demonstrated from the passage.

**Acceptance scenario:** Lasso an observation in native NOTE; save source path and note-page link in the Mark 2 dossier; add a commentary PDF reference with author/page; add a verified quotation; add a private prayer; select two evidence-backed cards for pulpit; close/reopen/restart; export public notes; verify no prayer and no unverified exact quotation; open original document page; export and restore a backup safely.

## Important sources for engineering / references

- Supernote Manta firmware Chauvet 3.31.45 changelog: https://support.supernote.com/changelog-for-manta-and-nomad
- Supernote native Digest: https://support.supernote.com/en_US/Tools-Features/what-is-digest-and-what-does-it-do
- Native headings/keywords: https://support.supernote.com/en_US/1759244-using-titles-keywords-and-stars
- Native links: https://support.supernote.com/en_US/inserting-links-to-notebooks
- Spurgeon preparation discussion: https://www.spurgeon.org/articles/principles-from-spurgeons-sermon-prep-process
- H. B. Charles Jr., sermon preparation: https://ftc.co/resource-library/blog-entries/on-sermon-preparation/
- H. B. Charles Jr., outline craft: https://www.preachingandpreachers.org/article/on-sermon-outlines/
- STEP Bible, optional external resource: https://stepbible.org/
- NET Bible translators' notes: https://netbible.org/

## Release truth-in-advertising

A source-level test is not a physical Manta test. A compiled `.snplg` is not proof that source links or handwriting selection work. A UI containing a tab is not proof of resource imports. Only advertise features with successful native tests. Keep this master plan separate from the current published v0.6 alpha release.
