# Color Palette Mapping Guide

## Custom Palettes Defined in tailwind.config.js

### Palette Mapping for Existing Hardcoded Colors

**Primary Brand Colors:**
- `#0fafb8` (teal/cyan) → `cornflower_ocean-600` (#0096ed) or `cornflower_ocean-500` (#006daa)
- `#0a7981` (dark teal) → `deep_space_blue-600` (#0067ab) or `cornflower_ocean-500` (#006daa)

**Blue Colors:**
- `#3b82f6` (light blue) → `sapphire-600` (#0576e8) or `sapphire-500` (#0353a4)
- `#0042d7` (dark blue) → `prussian_blue-700` (#155de2) or `sapphire-500` (#0353a4)

**Neutral Colors (Keep as-is or map to Tailwind slate):**
- `#ffffff` (white) → Keep as-is
- `#1f2937` (dark gray) → `slate-800`
- `#111827` (darker gray) → `slate-900`
- `#4b5563` (medium gray) → `slate-600`
- `#e5e7eb` (light gray) → `slate-200`
- `#f3f4f6` (lighter gray) → `slate-100`

**Status Colors:**
- `#e63946` (red) → Tailwind `red-500`
- `#d1fae5` (light green) → Tailwind `green-100`
- `#f4fbf7` (very light green) → Tailwind `green-50`
- `#f9fafb` (almost white) → Tailwind `gray-50`

---

## Files Needing Color Updates

### CSS Files (Priority: HIGH)
1. **App.css** - 11 hardcoded color instances
2. **Navbar.css** - Contains brand colors
3. **Footer.css** (Layout/) - Contains brand colors
4. **Banner.css** - Contains brand colors
5. **Categories.css** - Contains brand colors

### JSX Files (Priority: MEDIUM)
1. **Home.jsx** - Brand colors in components
2. **Account.jsx** - Form colors
3. **Dashboard.jsx** - UI colors
4. **AddProject.jsx** - Form colors
5. Various component files with inline styles

---

## Recommended Action Plan

1. Replace `#0fafb8` with `#006daa` (cornflower_ocean-500)
2. Replace `#0a7981` with `#003559` (deep_space_blue-500)
3. Replace `#3b82f6` with `#0353a4` (sapphire-500)
4. Replace `#0042d7` with `#0576e8` (sapphire-600)
5. Keep neutral grays consistent with Tailwind slate scale
6. Use Tailwind red for error/status colors where applicable

---

## Post-Update Verification

After updating colors:
- [ ] All primary brand elements use cornflower_ocean or sapphire palette
- [ ] All secondary brand elements use deep_space_blue or prussian_blue palette
- [ ] Neutral elements use consistent slate/gray scale
- [ ] No hardcoded hex colors remain for brand elements
- [ ] All pages render consistently with new color scheme
