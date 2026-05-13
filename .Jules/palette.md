## 2024-05-13 - Keyboard Accessibility in Custom Minimalist Themes
**Learning:** Custom built components (like theme togglers and plain text footer links) often lose native focus states when styled heavily with utilities like Tailwind, rendering the site completely untraversable for keyboard users.
**Action:** When working on custom templates, *always* verify `focus-visible` styling is explicitly defined. Implement a standard "Skip to main content" link as the very first interactive element on the page, and tie it to smooth scrolling to provide context to the user when the skip occurs.
