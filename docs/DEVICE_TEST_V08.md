# The Expositor v0.8 — physical Manta validation

Target: Supernote Manta Chauvet 3.31.45. This sheet is intentionally separate from GitHub Actions tests; only a real device can pass it.

| Test | Expected | Result (you fill in) |
|---|---|---|
| Install .snplg from MyStyle | Recognized and installed; enables | |
| Toolbar plugin entry in NOTE | Opens The Expositor, no crash | |
| Return to Note | Plugin closes; pen input resumes | |
| Lasso 5 handwritten words | Editable on-device OCR text and NOTE/page reference | |
| Lasso long sentence | OCR yields usable editable text; ink unchanged | |
| No selection | Graceful source fallback, not an old stale capture | |
| PDF text selection | Selected text captured (never fake verified quote) | |
| Selected sermon | User can change target; no wrong-dossier misfiling | |
| Restart device | Active sermon and saved research still present | |
| Save with 30+ cards | Saves remain responsive; no corruption | |
| Public export of Prayer | Prayer absent | |
| Pulpit export of unverified exact quotation | Quote absent | |
| Verified exact quote | Requires source and page/location | |
| Full JSON backup and merge | Restores missing IDs without overwriting current | |
| Font, grayscale, touch size | Legible on Manta without squinting or repeated mistaps | |

After checking, report the failed step, screenshot and whether a reboot helps. Never use this alpha to store confidential counseling data: private records are not encrypted.

Firmware: https://support.supernote.com/changelog-for-manta-and-nomad
Installation: https://support.supernote.com/en_US/Whats-New/how-to-install-and-manage-plugins
