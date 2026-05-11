## 2024-05-11 - Adding ARIA labels to IconButtons
**Learning:** Material UI IconButtons in this app frequently lack accessible names for screen readers, and since the primary language is Russian, localized `aria-label`s are necessary for the best user experience.
**Action:** Look for icon-only buttons (`IconButton` in Material UI) throughout the codebase and ensure they have descriptive `aria-label` attributes in Russian.
