# CLAUDE.md - Project Context & Guidelines

## Project Overview
MindTrace is a personal thought-recording application with a **modern minimalist design** philosophy. The application focuses on simplicity, clarity, and distraction-free user experience.

## Core Development Principles

### 1. Simplicity First
- **"一切的要义是简单"** - Simplicity is the essence of everything
- Prefer simple, straightforward solutions over complex ones
- Don't over-engineer - often the simplest approach is the best
- Avoid premature optimization - focus on clarity first

### 2. Code Style Requirements
- **DO NOT ADD ANY COMMENTS** unless explicitly requested
- Keep responses concise (fewer than 4 lines unless detail is requested)
- Avoid unnecessary preamble or postamble in responses
- Focus on direct answers and implementations

### 3. Architecture Philosophy
- **Component Composition**: Break down complex components into smaller, focused pieces
- **Hook-based Logic Sharing**: Use custom hooks to encapsulate and share logic
- **Service Layer Separation**: Keep API calls separate from UI logic
- **Constants Management**: Centralize configuration for maintainability

## Key Technical Lessons Learned

### 1. Avoid Platform-Specific Over-Engineering
**Lesson**: When facing iOS Safari sidebar z-index and scroll issues, the temptation was to create complex iOS-specific solutions with `@supports` rules, device detection, and special positioning logic.

**Reality**: The problem was simply incorrect z-index values. A basic fix worked universally:
```css
Header: z-index: 30
Sidebar Overlay: z-index: 40  
Sidebar: z-index: 50
```

**Takeaway**: Before adding platform-specific code, verify that basic CSS/JS patterns work correctly. Often, universal solutions are more robust than platform-specific hacks.

### 2. Context Dependencies and Infinite Loops
**Problem**: useEffect dependencies causing infinite re-renders when using complex state management.

**Solution**: 
- Simplify dependencies in useEffect
- Use direct service calls instead of wrapped operations when possible
- Implement loading flags to prevent duplicate requests
- Be careful with object references in dependency arrays

### 3. React 18 StrictMode Behavior
**Issue**: React 18 StrictMode double-executes effects, causing duplicate API calls.

**Solution**: Implement deduplication logic and proper cleanup in useEffect hooks.

### 4. Error Handling Strategy
- Service layer throws descriptive errors
- Context layer catches and sets user-friendly messages  
- UI components display error states consistently
- Always include try-catch blocks with meaningful error messages

## Design & UX Guidelines

### 1. Semantic Color System
The application uses a comprehensive CSS variable-based color system for visual consistency and maintainability:

#### Color Variables
```css
/* Text Colors */
--color-text-primary: #111827    /* Main headings, important text */
--color-text-secondary: #374151  /* Body text, secondary content */
--color-text-muted: #6b7280      /* Subtle text, labels */
--color-text-subtle: #9ca3af     /* Very light text, placeholders */

/* State Colors */
--color-caution: #ea580c         /* Unlock/warning states (orange) */
--color-caution-bg: #fff7ed      /* Light orange backgrounds */
--color-danger: #dc2626          /* Delete/error actions (red) */
--color-danger-bg: #fef2f2       /* Light red backgrounds */
--color-danger-text: #b91c1c     /* Error text */

/* Interactive Colors */
--color-interactive-bg: #f5f5f5       /* Form inputs, cards */
--color-interactive-hover: #f9f9f9     /* Hover backgrounds */
--color-interactive-active: #d4d4d4    /* Active/pressed states */

/* Semantic Backgrounds */
--color-bg-primary: #ffffff      /* Main backgrounds */
--color-bg-secondary: #fafafa    /* Page backgrounds */
--color-bg-card: #ffffff         /* Card backgrounds */

/* Borders */
--color-border-light: #f1f3f4    /* Subtle borders */
--color-border-medium: #e5e7eb   /* Standard borders */
--color-border-strong: #d1d5db   /* Emphasized borders */
```

#### Semantic Usage Rules
- **Orange (Caution)**: Unlock states, warning actions - indicates user should proceed with awareness
- **Red (Danger)**: Delete operations, error states - indicates destructive or problematic actions
- **Gray Hierarchy**: Use text-primary → text-secondary → text-muted → text-subtle for information hierarchy
- **Interactive Elements**: All hover effects use consistent background opacity/brightness

#### Utility Classes
```css
.text-primary, .text-secondary, .text-muted, .text-subtle
.text-caution, .text-danger
.bg-interactive, .bg-interactive-hover, .bg-caution, .bg-danger
.border-light, .border-medium, .border-strong, .border-danger
```

#### Icon Button Consistency
All small icon buttons follow the same hover pattern:
- Default: No background, semantic text color
- Hover: Light background with consistent brightness across all states
- Special states (unlock) maintain semantic colors but consistent hover brightness

### 2. Modern Minimalist Design
- Clean, sans-serif typography (system fonts)
- Minimal shadows and borders
- Generous whitespace
- Subtle hover effects with `translateY(-1px)`

### 3. Responsive Design
- Mobile-first approach
- Sidebar overlay on mobile, persistent on desktop
- Touch-friendly target sizes
- Consistent spacing across breakpoints

## Code Organization Patterns

### 1. Component Structure
```
ThoughtItem (main component)
├── ThoughtActions (action buttons)
├── ThoughtEditForm (edit functionality)
└── Display logic only
```

### 2. Hook Patterns
```
useAsyncOperation - Generic async handling
useConfirmDialog - Reusable dialog state
useThoughtState - Complex state encapsulation
```

### 3. Service Pattern
```
thoughtService - Pure API operations
Context - Coordinates service and state
Components - Pure UI logic
```

## Testing & Build Strategy

### 1. Type Safety
- Always run `npm run build` after significant changes
- Fix TypeScript errors immediately
- Use proper type definitions, avoid `any`

### 2. Linting
- Run `npm run lint` and fix all errors
- Maintain consistent code style
- Address warnings promptly

### 3. Error Prevention
- Test across different devices when possible
- Verify responsive behavior
- Check for console errors

## Feature Implementation Guidelines

### 1. Days-Since-Birth Numbering
- Users prefer seeing days since birth (e.g., "10145") rather than dates
- This creates a personal timeline perspective
- Always implement this for date displays in thoughts

### 2. Export Functionality
- Markdown format with specific structure
- Include copy-to-clipboard and download options
- Sort chronologically (oldest to newest)
- Use days-since-birth in headers

### 3. Hidden Thoughts System
- Lock/unlock metaphor for hiding/showing content
- Orange color indicates "unlock" state (caution)
- Confirmation dialogs for showing hidden content
- Persistent state using localStorage

## Performance Considerations

### 1. Lazy Loading
- Implement pagination for large datasets
- Load thoughts by date ranges (configurable days per load)
- Prevent duplicate requests with proper state management

### 2. State Optimization
- Use useCallback for stable function references
- Proper dependency arrays in useEffect
- Avoid unnecessary re-renders

### 3. Bundle Optimization
- Tree-shake unused imports
- Optimize asset loading
- Use Vite's build optimizations

## Common Pitfalls to Avoid

### 1. Over-Abstraction
- Don't create abstractions until you see clear patterns
- Prefer duplication over wrong abstraction initially
- Refactor only when patterns emerge

### 2. Premature Performance Optimization
- Focus on functionality first
- Optimize only when performance issues are identified
- Measure before optimizing

### 3. Complex State Management
- Start with simple useState
- Graduate to context only when prop drilling becomes painful
- Use reducers only for complex state logic

### 4. CSS Specificity Wars
- Use Tailwind classes consistently
- Avoid !important unless absolutely necessary
- Keep specificity low and predictable

## User Experience Priorities

### 1. Core Functionality
1. **Writing thoughts** - Primary user action, must be effortless
2. **Reading thoughts** - Clear, distraction-free display
3. **Navigation** - Intuitive, responsive sidebar
4. **Export** - Reliable data export for user control

### 2. Secondary Features
- Hidden thoughts toggle
- Profile management
- Search (future consideration)
- Analytics/insights (future consideration)

### 3. Mobile Experience
- Touch-friendly interactions
- Proper keyboard handling
- Smooth animations
- Reliable offline behavior (future)

## Development Workflow

### 1. Feature Development Process
1. Understand requirements thoroughly
2. Plan component structure
3. Implement service layer first
4. Build UI components
5. Test across devices
6. Optimize and refactor

### 2. Code Review Checklist
- [ ] No unnecessary comments added
- [ ] TypeScript builds without errors
- [ ] ESLint passes without warnings
- [ ] Mobile responsiveness verified
- [ ] Error states handled properly
- [ ] Loading states implemented
- [ ] Proper cleanup in useEffect

### 3. Deployment Checklist
- [ ] Build succeeds
- [ ] All tests pass
- [ ] Performance regression check
- [ ] Cross-browser testing
- [ ] Mobile device testing

## Future Considerations

### 1. Potential Features
- Full-text search across thoughts
- Thought categories/tags
- Mood tracking integration
- Export to various formats (PDF, EPUB)
- Backup/sync functionality

### 2. Technical Improvements
- Progressive Web App (PWA) features
- Offline functionality
- Performance monitoring
- Analytics implementation
- A/B testing framework

### 3. Scalability Planning
- Database query optimization
- CDN for static assets
- Caching strategies
- Rate limiting
- User data privacy enhancements

## Recent Improvements

### Color System Overhaul (December 2024)
**Problem**: Inconsistent color usage across components with hardcoded Tailwind classes, making maintenance difficult and visual consistency poor.

**Solution**: Implemented a comprehensive CSS variable-based semantic color system:

#### What Was Done:
1. **CSS Variables**: Created semantic color variables in `src/index.css` for text, state, interactive, background, and border colors
2. **Utility Classes**: Added semantic utility classes (`.text-primary`, `.bg-interactive-hover`, etc.) for easier component usage
3. **Component Updates**: Updated all major components to use semantic classes instead of hardcoded colors
4. **Hover Consistency**: Standardized all icon button hover effects to use consistent background brightness
5. **Documentation**: Updated both CLAUDE.md and architecture.md with comprehensive color system documentation

#### Benefits:
- **Maintainability**: Single source of truth for colors, easy to adjust theme
- **Consistency**: All components follow the same visual patterns
- **Readability**: Semantic names make code self-documenting
- **Scalability**: Easy to extend or modify color scheme in the future

#### Key Patterns Established:
- Orange for caution/unlock states, red for danger/delete
- Consistent gray hierarchy for text importance
- Unified hover effects across all interactive elements
- Semantic background colors with matching brightness levels

---

**Last Updated**: December 13, 2024
**Project Version**: Post-color-system-overhaul
**Key Maintainer Guidelines**: Keep it simple, test thoroughly, prioritize user experience, use semantic color classes