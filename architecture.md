# MindTrace Architecture & Design System

## Project Overview
MindTrace is a personal thought-recording application with a **modern minimalist design**. The application uses React, TypeScript, Tailwind CSS, and Supabase.

## Design Philosophy: Modern Minimalist Style

### Color Palette
- **Primary Background**: `#ffffff` (pure white)
- **Secondary Background**: `#fafafa` (light gray)
- **Card Background**: `#ffffff` (white)
- **Primary Accent**: `#111827` (charcoal gray)
- **Text Primary**: `#111827` (charcoal gray)
- **Text Secondary**: `#374151` (medium gray)
- **Text Muted**: `#6b7280` (light gray)
- **Border Colors**: `#f3f4f6` (very light gray), `#e5e7eb` (light gray)
- **Date Labels**: `#f9fafb` (very light gray background)

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', etc.)
- **Line Height**: 1.5-1.6 for optimal readability
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold)

### Design Elements

#### Cards (`.modern-card`)
- Clean rounded corners (8px)
- Minimal shadows with neutral tones
- Clean, flat appearance
- Simple border lines

#### Buttons
- **Primary**: Charcoal gray with clean hover effects
- **Secondary**: White with gray borders
- **Danger**: Clean red for destructive actions
- Subtle hover animations (translateY and shadow)

#### Inputs
- Clean white backgrounds
- Gray focus states
- Sans-serif typography for all content

#### Date Elements
- Clean date selectors with minimal styling
- Simple divider lines for date sections
- Gray accent colors when active

## Component Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── Login.tsx           # Modern minimalist login form
│   ├── Layout/
│   │   ├── Header.tsx          # Clean header with sans-serif title
│   │   └── Layout.tsx          # Clean white background
│   ├── Thought/
│   │   ├── ThoughtInput.tsx    # Minimalist input with date selector
│   │   ├── ThoughtItem.tsx     # Clean thought cards
│   │   ├── ThoughtList.tsx     # List with simple date dividers
│   │   └── EmptyState.tsx      # Welcome message with minimal styling
│   └── UI/
│       ├── Button.tsx          # Modern button variants
│       ├── DateSelector.tsx    # Clean date buttons
│       └── Modal.tsx           # Minimal modal dialogs
├── contexts/                   # React contexts for state management
├── hooks/                      # Custom React hooks
├── lib/                        # Supabase client configuration
├── pages/                      # Page components
├── types/                      # TypeScript type definitions
├── utils/                      # Utility functions
└── index.css                   # Global styles and design system
```

## CSS Classes

### Core Design Classes
- `.modern-card` - Main card component with clean styling
- `.modern-page` - Page background with light gray color
- `.modern-title` - Sans-serif titles with charcoal color
- `.modern-text` - Body text with optimal readability
- `.date-label` - Styled date indicators
- `.diary-*` classes - Mapped to modern equivalents for compatibility

### Button Classes
- `.btn` - Base button with minimal shadows and transitions
- `.btn-primary` - Charcoal gray primary buttons
- `.btn-secondary` - White secondary buttons with gray borders
- `.btn-danger` - Clean red for destructive actions

### Input Classes
- `.input` - Styled form inputs with clean colors and sans-serif fonts

## Responsive Design
- Mobile-first approach
- Content container max-width: 800px on desktop
- Proper touch targets for mobile devices
- iOS Safari specific optimizations

## Accessibility Features
- Proper focus states with gray accent colors
- Keyboard navigation support
- Screen reader friendly markup
- Sufficient color contrast ratios

## Animation & Interactions
- Subtle hover effects with `translateY(-1px)`
- Smooth transitions (200ms duration)
- Loading states with gray-colored spinners
- Minimal shadow animations on hover

## Technical Stack
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS with custom modern minimalist components
- **Build Tool**: Vite
- **Backend**: Supabase (Auth + Database)
- **Deployment**: Vercel

## Key Features
- Clean, modern minimalist interface
- Date-organized thought entries
- Clean typography with system fonts
- Responsive design for all devices
- Smooth animations and transitions
- Minimal, distraction-free design 