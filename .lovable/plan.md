# Make LearnScape Labs dependable and polished

## Build
- Apply a consistent liquid-glass visual treatment with restrained transitions, accessible contrast, and reduced-motion support while preserving light and dark themes.
- Replace missing experiment thumbnails with original project images and improve the home screen’s paths into the available Physics, EEE, Algorithms, and Tutor labs.
- Repair existing high-value interactions: simulation controls, calculator/report/share actions, algorithm analysis controls, and tutor replies. Keep functionality within the current client-side app and its existing Cloud integration.
- Validate the main learning flows and page rendering at desktop and mobile widths; fix issues surfaced by the preview.

## Technical details
- Reuse the current React, Tailwind, shadcn, chart, routing, and Lovable Cloud patterns; do not add a server or introduce new lab routes.
- Use semantic theme tokens and honor `prefers-reduced-motion`; keep changes scoped to current screens and shared styling.