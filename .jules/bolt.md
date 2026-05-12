
## 2026-05-12 - Prevent Re-renders in TikTok-Style Feed Architecture
**Learning:** In a TikTok-style feed component (`Feed.jsx`), toggling a local state modal (`modalRecipe`) causes the entire list of heavy `ReelCard` components (containing `ReactPlayer` and Framer Motion animations) to re-render. This is a codebase-specific architectural bottleneck where sibling UI elements (modals) trigger list re-renders.
**Action:** Always wrap heavy list items (like `ReelCard` with media players) in `React.memo()` when their parent component manages unrelated local state (like modals or overlays) to prevent unnecessary, expensive re-renders.
