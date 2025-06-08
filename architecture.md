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