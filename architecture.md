# MindTrace Architecture & Design System

## Project Overview
MindTrace is a personal thought-recording application with a **modern minimalist design**. The application uses React, TypeScript, Tailwind CSS, and Supabase.

## Design Philosophy: Modern Minimalist Style

### Semantic Color System

The application uses a comprehensive CSS variable-based color system for consistency and maintainability. All colors are defined in `src/index.css` and used throughout the application via semantic utility classes.

#### Core Color Variables
```css
/* Text Colors - Information Hierarchy */
--color-text-primary: #111827      /* Main headings, critical text */
--color-text-secondary: #374151    /* Body text, secondary content */
--color-text-muted: #6b7280        /* Subtle text, form labels */
--color-text-subtle: #9ca3af       /* Very light text, placeholders */

/* State Colors - Semantic Actions */
--color-caution: #ea580c           /* Unlock/warning states (orange) */
--color-caution-bg: #fff7ed        /* Light orange backgrounds for caution states */
--color-danger: #dc2626            /* Delete/error actions (red) */
--color-danger-bg: #fef2f2         /* Light red backgrounds for errors */
--color-danger-text: #b91c1c       /* Error message text */

/* Interactive Colors - User Interface */
--color-interactive-bg: #f5f5f5     /* Form inputs, inactive backgrounds */
--color-interactive-hover: #f9f9f9   /* Hover state backgrounds */
--color-interactive-active: #d4d4d4  /* Active/pressed states */

/* Layout Colors - Structure */
--color-bg-primary: #ffffff        /* Main page backgrounds */
--color-bg-secondary: #fafafa      /* Secondary page areas */
--color-bg-card: #ffffff           /* Card and panel backgrounds */
--color-bg-overlay: rgba(0,0,0,0.5) /* Modal overlays */

/* Border Colors - Visual Separation */
--color-border-light: #f1f3f4      /* Subtle dividers */
--color-border-medium: #e5e7eb     /* Standard borders */
--color-border-strong: #d1d5db     /* Emphasized borders */
--color-border-danger: #fecaca     /* Error state borders */
```

#### Semantic Usage Guidelines
- **Orange (Caution)**: Reserved for unlock states and actions requiring user awareness
- **Red (Danger)**: Used exclusively for destructive actions (delete) and error states
- **Gray Hierarchy**: Follow the progression primary → secondary → muted → subtle for content importance
- **Interactive Consistency**: All hover effects use consistent background brightness for unified feel

#### Utility Classes
```css
/* Text Colors */
.text-primary, .text-secondary, .text-muted, .text-subtle
.text-caution, .text-danger

/* Background Colors */
.bg-interactive, .bg-interactive-hover, .bg-interactive-active
.bg-caution, .bg-danger

/* Border Colors */
.border-light, .border-medium, .border-strong, .border-danger
```

#### Component Color Consistency Rules
1. **Icon Buttons**: Default state has no background, hover shows `--color-interactive-hover`
2. **Special State Buttons**: Unlock uses caution colors, delete uses danger colors
3. **Error Messages**: Always use `bg-danger border-danger text-danger` combination
4. **Form Elements**: Use `bg-interactive` with `hover:bg-interactive-hover`

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

## Architecture & Code Organization

### Overall Structure
```
src/
├── components/           # UI Components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── services/            # Business logic and API calls
├── constants/           # Application constants
├── lib/                 # External service configurations
├── pages/               # Page components
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── index.css           # Global styles and design system
```

### Component Architecture

#### UI Components (`src/components/`)
```
components/
├── Auth/
│   └── Login.tsx               # Authentication form
├── Layout/
│   ├── Header.tsx              # App header with sidebar toggle
│   ├── Layout.tsx              # Main layout with sidebar
│   └── Sidebar.tsx             # Navigation sidebar
├── Thought/
│   ├── ThoughtInput.tsx        # Input form for new thoughts
│   ├── ThoughtItem.tsx         # Individual thought display
│   ├── ThoughtList.tsx         # List container for thoughts
│   ├── ThoughtActions.tsx      # Action buttons (edit, delete, hide)
│   ├── ThoughtEditForm.tsx     # Edit form component
│   └── EmptyState.tsx          # Empty state display
└── UI/
    ├── Button.tsx              # Reusable button component
    ├── DateSelector.tsx        # Date picker component
    ├── Icon.tsx                # Icon component
    ├── Modal.tsx               # Modal dialog component
    ├── ConfirmDialog.tsx       # Confirmation dialog
    └── DaysSinceBirth.tsx      # Days since birth display
```

#### Context Providers (`src/contexts/`)
```
contexts/
├── AuthContext.tsx             # Authentication state management
├── ThoughtContext.tsx          # Thought data and operations
├── HiddenToggleContext.tsx     # Hidden thoughts toggle state
└── UserProfileContext.tsx      # User profile management
```

#### Custom Hooks (`src/hooks/`)
```
hooks/
├── useAsyncOperation.ts        # Generic async operation handler
├── useConfirmDialog.ts         # Confirmation dialog state
├── useThoughtState.ts          # Local thought state management
├── useHiddenToggle.ts          # Hidden thoughts toggle logic
└── useThoughtOperations.ts     # Thought CRUD operations
```

#### Service Layer (`src/services/`)
```
services/
└── thoughtService.ts           # Thought API operations and data fetching
```

#### Constants (`src/constants/`)
```
constants/
└── index.ts                    # Application-wide constants
    ├── STORAGE_KEYS           # LocalStorage keys
    ├── PAGINATION             # Pagination settings
    ├── ERROR_MESSAGES         # Error message constants
    ├── UI_CONFIG              # UI configuration
    ├── EXPORT                 # Export settings
    └── THEME                  # Theme configuration
```

### State Management Architecture

#### 1. Context + Hooks Pattern
- **ThoughtContext**: Global thought state and operations
- **AuthContext**: User authentication state
- **HiddenToggleContext**: UI state for hidden thoughts
- **UserProfileContext**: User profile data

#### 2. Custom Hook Abstraction
- **useAsyncOperation**: Standardized async operation handling
- **useConfirmDialog**: Reusable confirmation dialog logic
- **useThoughtState**: Local state management for thoughts

#### 3. Service Layer Separation
- **thoughtService**: Pure API operations
- Clear separation between UI logic and data fetching
- Centralized error handling and retry logic

### Key Architectural Decisions

#### 1. Component Composition
- **ThoughtItem** broken down into:
  - `ThoughtActions` - Action buttons
  - `ThoughtEditForm` - Edit functionality
  - Main component focuses on display logic

#### 2. Hook-Based Logic Sharing
- **useAsyncOperation**: Standardizes loading/error states
- **useConfirmDialog**: Reusable confirmation patterns
- **useThoughtState**: Encapsulates complex state logic

#### 3. Constants Management
- Centralized configuration
- Type-safe constant definitions
- Easy maintenance and updates

#### 4. Error Handling Strategy
- Service layer throws descriptive errors
- Context layer catches and sets user-friendly messages
- UI components display error states consistently

### Data Flow

```
User Action → Component → Hook → Service → Supabase
                ↓
State Update ← Context ← Hook Response ← Service Response
                ↓
UI Re-render
```

#### Example: Adding a Thought
1. User submits form in `ThoughtInput`
2. Component calls `addThought` from `ThoughtContext`
3. Context uses `thoughtService.addThought()`
4. Service makes Supabase API call
5. On success, context updates local state
6. UI re-renders with new thought

### Performance Considerations

#### 1. Lazy Loading
- Pagination with configurable days per load
- Incremental data fetching

#### 2. State Optimization
- `useCallback` for stable function references
- Proper dependency arrays in `useEffect`
- Memoized state setters

#### 3. Loading Prevention
- Duplicate request prevention
- Component mount/unmount guards
- Loading state management

## Responsive Design
- Mobile-first approach
- Sidebar overlay on mobile, persistent on desktop
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
- Date-organized thought entries with days-since-birth numbering
- Hidden/visible thought toggle functionality
- Export functionality with markdown format
- Clean typography with system fonts
- Responsive design for all devices
- Smooth animations and transitions
- Minimal, distraction-free design
- Comprehensive error handling and loading states