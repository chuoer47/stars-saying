# Child Safety And Privacy

[中文版](./SAFETY.md)

`stars-saying` is a child-facing astronomy learning app. The safety goal is to let children explore astronomy in a gentle and controlled environment without requiring accounts or public personal information.

## Current Safety Rules

- No account is required for the child flow.
- Chat stays around astronomy learning, star stories, observation guidance, and gentle companionship.
- Dangerous, sexual, hateful, illegal, self-harm, and personal-data requests are refused or redirected.
- Wishes and memory entries are stored locally in the browser.
- The wish wall is local-first and blocks common personal information patterns.
- Adult/internal pages are behind `/settings`.

## Personal Information Not To Collect

The app should not ask children for:

- real names
- phone numbers
- home addresses
- schools or classes
- email addresses
- social handles
- identity numbers

## Science Boundaries

- Mythology and culture can be included, but they must be clearly separated from scientific facts.
- When official data is unavailable, the UI should use local reviewed fallback content rather than invent details.
- If an answer is uncertain, it should say so and guide the child to a safer question or knowledge card.

## Before Public Release

- Set a strong `SETTINGS_PASSWORD`.
- Review all visible copy for child-friendly wording.
- Confirm raw secrets never appear in HTML or client JavaScript.
- Confirm public routes do not expose adult/internal pages without settings access.
- If cloud sync or analytics are added later, review the privacy explanation again.

## Parent/Teacher Note

The current version stores child content locally by default and does not provide a public community, account system, or cloud sync. Local wishes, memory entries, and chat history may be lost if browser site data is cleared.
