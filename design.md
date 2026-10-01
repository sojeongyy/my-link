# Nintendo.com circa 2001 ? Design Specification

## Overview

Nintendo.com circa 2001 is the web rendered as **console hardware**. Every region is a discrete beveled panel, edge-lit with a brighter highlight on top and a chrome-indigo shadow line beneath, as if stamped from the same injection-molded plastic as a Game Boy.

## Colors

### Brand & Accent
- **Signal Orange** `#f68d1f` ? forward/action cue (arrow buttons, chevron chips, Submit)
- **Amber** `#ecab37` ? utility chips, badges, tool marks
- **Nav Gold** `#e48600` ? primary nav menu words on carbon bar

### Surface
- **Periwinkle Metallic** `#7a8aba` ? primary interface body (canvas)
- **Light Periwinkle** `#8ba1d4` ? raised mid panels
- **Pale Sky** `#9fbee7` ? secondary-nav strip, light inset fills
- **Pale Lavender** `#acace7` ? home hero field, side promo cards
- **Chrome Indigo** `#3d4f97` ? beveled border / shadow line under every plate
- **Muted Indigo** `#60619c` ? inactive tabs, recessed chrome
- **Platinum Gray** `#dedede` ? list-row and inset content surface
- **White** `#ffffff` ? content cards, form fields, logo pill

### Text
- **Carbon Navy** `#21242e` ? primary text, dark command layer fill
- **Chrome Indigo** `#3d4f97` ? secondary text, small-caps chrome labels
- **White** `#ffffff` ? text on carbon, red, orange surfaces

## Typography

- **Display** 44px / 900 weight ? Hero wordmarks (white, outline + hard drop shadow)
- **Nav Link** 13px / 700 / uppercase / 0.5px tracking ? Primary nav words
- **UI Label** 11px / 700 / uppercase / 0.5px tracking ? Panel headers, button text
- **Link** 12px / 700 ? News headlines, "Read More"
- **Body** 12px / 400 ? Descriptions, info copy
- **Micro** 10px / 400 ? Footer, fine print

Font: Arial / Helvetica (web-safe). Display wordmarks use CSS text-stroke + text-shadow for box-art effect.

## Layout

- **Fixed-width canvas** ~780?830px, centered
- **Dual nav bars**: carbon primary (logo + section words + utility chips) + pale-sky secondary strip
- **Body**: full-width hero ¡æ two-column split (2/3 content + 1/3 right action rail)
- **Left rail**: thin vertical rotated tabs strip

## Elevation & Depth (Bevel Simulation)

| Level | Treatment |
|---|---|
| 0 ? Inset | Chrome-indigo top edge, lighter bottom edge |
| 1 ? Plate | Lighter top highlight, chrome-indigo shadow line beneath |
| 2 ? Raised chip | Beveled button with bright top + hard bottom shadow |
| 3 ? Command slab | Carbon near-black with halftone texture |

## Shapes

- `rounded.none` 0px ? default, nav bar, footer, chrome plates
- `rounded.xs` 2px ? utility buttons, form fields, badges
- `rounded.sm` 4px ? small panels, tiles, list rows
- `rounded.md` 6px ? content panels, hero panel
- `rounded.full` 9999px ? logo pill, radio dots, circle-arrow badges

## Do'|'s and Don'ts

### Do
- Build every region as a beveled plate (canvas body + chrome-indigo shadow line)
- Reserve warm color for wayfinding ONLY
- Keep structural labels uppercase Arial Bold with 0.5px tracking
- Default corners to sharp/chamfered

### Don''t
- Don''t soften every corner
- Don''t use soft blurred drop-shadows
- Don''t let signal/amber bleed into decoration
- Don''t flatten the dual-nav structure
