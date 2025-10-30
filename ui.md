# UI/UX Design System for NativeSpeak

This document outlines the new design system for the NativeSpeak application, focusing on a modern, clean, and engaging user experience for language learners.

## 1. Color Palette

The new color palette is designed to be vibrant, accessible, and professional. It moves away from the generic blue to a more distinctive and motivating theme.

*   **Primary:** A deep, intelligent blue for core interactions and branding.
    *   `--primary-dark`: `#0D285B`
    *   `--primary-main`: `#1A50B5`
    *   `--primary-light`: `#4D7DD1`
*   **Accent/CTA:** A vibrant, energetic green for calls-to-action, success states, and highlighting key information.
    *   `--accent-green`: `#2EEA7A`
*   **Secondary Accent:** A warm orange for achievements, warnings, and secondary highlights.
    *   `--accent-orange`: `#FFA500`
*   **Neutral/Background:** A sophisticated dark theme to reduce eye strain and make content pop.
    *   `--bg-primary`: `#0A0F1E` (Main background)
    *   `--bg-secondary`: `#131A33` (Slightly lighter for cards/surfaces)
    *   `--bg-tertiary`: `#222B4C` (For elevated elements)
*   **Text:** High-contrast text colors for readability.
    *   `--text-primary`: `#FFFFFF`
    *   `--text-secondary`: `#B0B8D9`
    *   `--text-muted`: `#7A85B0`
*   **System:** Standard colors for feedback.
    *   `--success`: `#34D399`
    *   `--warning`: `#FBBF24`
    *   `--error`: `#F87171`

## 2. Typography

We will switch to a more modern and readable font pairing.

*   **Headings:** **Poppins** - A geometric sans-serif font that is clean, modern, and friendly.
*   **Body/UI:** **Inter** - A highly legible font designed for user interfaces.
*   **Monospace:** **JetBrains Mono** - Excellent for displaying code snippets or technical information.

We will implement a clear typographic scale for headings, paragraphs, and UI elements to create a strong visual hierarchy.

## 3. Layout & Spacing

The layout will be refined for a more spacious and organized feel.

*   **Consistency:** Use a consistent spacing scale (multiples of 4px or 8px) for all margins, paddings, and gaps.
*   **Sidebars:** The sidebars will be redesigned to be more intuitive, with better separation of concerns (e.g., user profile, navigation, settings).
*   **Content Area:** The main content area will have a maximum width to improve readability on large screens.
*   **Mobile Responsiveness:** All layout changes will be fully responsive to ensure a seamless experience on mobile devices.

## 4. Component Redesign

Key components will be updated with the new design system.

*   **Buttons:**
    *   **Primary CTA:** Solid background (`--accent-green`) with a subtle glow effect on hover.
    *   **Secondary:** Ghost button style (outline) or a subtle fill (`--bg-tertiary`).
    *   Rounded corners (`--radius-md`) for a softer, more modern feel.
*   **Modals:**
    *   Use the `--bg-secondary` color.
    *   Increased padding and a more prominent drop shadow for a "lifted" effect.
    *   A blurred backdrop (`backdrop-filter: blur(8px)`) to focus the user's attention.
*   **Input Fields:**
    *   Clean, simple design with a clear focus state (a glowing border using `--primary-main`).
*   **Cards & Panels:**
    *   Use `--bg-secondary` with a subtle border (`--border-color`).
    *   On hover, a slight lift effect (`transform: translateY(-4px)`) and a soft shadow will be applied.

## 5. Visual Effects & Polish

Subtle effects will be added to enhance the user experience.

*   **Texture:** A very subtle, almost imperceptible noise texture will be applied to the main background (`--bg-primary`) to add a premium, tactile feel.
*   **Gradients:** Gradients will be used sparingly for primary buttons and decorative elements to add depth.
*   **Shadows:** A multi-layered shadow system will be used to create a sense of depth and elevation for different UI elements.
*   **Transitions:** All interactive elements will have smooth and fast transitions (`0.2s ease-in-out`) for a responsive feel.

## Implementation Plan

1.  **Update `index.css`:** Implement the new color palette, typography, and global styles.
2.  **Refactor Component CSS:** Go through each component's CSS file (`.css` and `.module.css`) and update styles to match the new design system.
3.  **Update Component JSX (`.tsx`):** Make minor structural changes if needed to support the new styles (e.g., adding wrapper divs, updating class names).
4.  **Update `ui.md`:** This file will be the single source of truth for the design system.
