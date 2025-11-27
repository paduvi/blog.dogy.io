# CSS Class Naming Convention Guide

## Overview
This project uses a custom CSS utility class system with a strict naming convention to ensure consistency and maintainability.

## Naming Rules

### 1. Allowed Characters
- **Lowercase letters**: a-z
- **Numbers**: 0-9
- **Hyphens**: `-` (for word separation)
- **Underscores**: `_` (for responsive prefixes)

### 2. Forbidden Characters
- ❌ Colons `:` (no Tailwind-style pseudo-classes)
- ❌ Slashes `/` (no Tailwind-style opacity syntax)
- ❌ Brackets `[]` (no arbitrary values)
- ❌ Parentheses `()`
- ❌ Special characters

## Class Naming Patterns

### Base Utilities
Use hyphens to separate words:
```css
.text-center
.bg-white
.flex-col
.items-center
.justify-between
```

### Responsive Prefixes
Use underscores for responsive breakpoint prefixes:
```css
.md_block          /* Medium screens and up */
.lg_grid-cols-3    /* Large screens and up */
.md_text-xl        /* Medium screens text size */
```

**Breakpoints:**
- `md_` - min-width: 768px
- `lg_` - min-width: 1024px

### Hover States
Use `hover-` prefix for hover states:
```css
.hover-bg-gray-100
.hover-text-primary
.hover-underline
.hover-scale-105
```

### Group Hover States
Use `group-hover-` prefix for group hover states:
```css
.group-hover-text-primary
.group-hover-scale-105
.group-hover-underline
```

Apply to parent:
```tsx
<div className="group">
  <h3 className="group-hover-text-primary">Title</h3>
</div>
```

### Focus States
Use `focus-` prefix for focus states:
```css
.focus-outline-none
```

## Common Patterns

### Layout
```tsx
<div className="container py-8">
  <div className="grid grid-cols-1 lg_grid-cols-12 gap-8">
    <div className="lg_col-span-8">Main content</div>
    <aside className="lg_col-span-4">Sidebar</aside>
  </div>
</div>
```

### Responsive Typography
```tsx
<h1 className="text-4xl md_text-5xl font-bold">
  Responsive Heading
</h1>
```

### Interactive Elements
```tsx
<button className="bg-primary text-white hover-bg-primary-hover transition-colors">
  Click me
</button>
```

### Card with Hover Effects
```tsx
<div className="card group">
  <img className="group-hover-scale-105 transition-transform" />
  <h3 className="group-hover-text-primary">Title</h3>
</div>
```

## Migration from Tailwind Syntax

If you see Tailwind-style syntax, convert it as follows:

### Responsive Classes
```diff
- lg:grid-cols-2
+ lg_grid-cols-2

- md:text-5xl
+ md_text-5xl
```

### Hover States
```diff
- hover:underline
+ hover-underline

- hover:bg-gray-200
+ hover-bg-gray-200
```

### Group Hover
```diff
- group-hover:text-primary
+ group-hover-text-primary

- group-hover:scale-105
+ group-hover-scale-105
```

### Opacity in Gradients
```diff
- from-black/50
+ from-black-50
```

### Arbitrary Values
```diff
- min-h-[300px]
+ min-h-300  (define in CSS first)
```

### Pseudo-classes
```diff
- focus:outline-none
+ focus-outline-none
```

## Adding New Classes

When you need a new utility class:

1. **Check if it exists** in `src/app/globals.css`
2. **Follow the naming convention** (alphanumeric + hyphens + underscores)
3. **Add to the appropriate section** in globals.css
4. **Use semantic names** that describe the purpose

Example:
```css
/* In globals.css */
.hover-border-primary:hover {
  border-color: var(--primary);
}

.lg_aspect-auto {
  aspect-ratio: auto;
}
```

## Validation

To check for naming violations, you can use the refactoring script:

```bash
node refactor-css.js
```

This will report:
- Unused CSS classes
- Classes used but not defined
- Classes with invalid naming

## Best Practices

1. **Reuse existing classes** before creating new ones
2. **Keep classes atomic** - one purpose per class
3. **Use CSS variables** for colors and common values
4. **Group related classes** in globals.css with comments
5. **Document complex patterns** in this guide

## Common Utilities Reference

### Spacing
- Padding: `p-{size}`, `px-{size}`, `py-{size}`, `pt-{size}`, `pb-{size}`
- Margin: `m-{size}`, `mx-{size}`, `my-{size}`, `mt-{size}`, `mb-{size}`

### Typography
- Size: `text-xs`, `text-sm`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`
- Weight: `font-medium`, `font-bold`, `font-semibold`
- Color: `text-muted`, `text-primary`, `text-white`

### Layout
- Display: `flex`, `grid`, `block`, `hidden`
- Flex: `flex-col`, `flex-row`, `items-center`, `justify-between`
- Grid: `grid-cols-1`, `gap-4`, `gap-6`, `gap-8`

### Colors
- Background: `bg-white`, `bg-gray-50`, `bg-gray-100`, `bg-primary`
- Text: `text-main`, `text-muted`, `text-primary`
- Border: `border`, `border-b`, `border-t`

### Effects
- Transitions: `transition-all`, `transition-colors`, `transition-transform`
- Shadows: `shadow-sm`, `shadow-lg`
- Opacity: `opacity-0`, `opacity-90`
