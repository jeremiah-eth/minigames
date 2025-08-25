# Scrabble Game Development Scratchpad

## Project Overview
Building a **simple, intuitive Scrabble game** using MiniKit where the user plays against an AI opponent. The game features a **sleek, responsive UI** that aligns with Base branding guidelines.

## Design Principles
- **Simplicity**: Clean, uncluttered interface with minimal cognitive load
- **Intuitiveness**: Clear visual feedback and straightforward interactions
- **Base Branding**: Consistent with Base's design language and color palette
- **Responsive**: Optimized for mobile-first MiniKit experience
- **Accessibility**: Easy to use for players of all skill levels

## Current Setup
- MiniKit project with OnchainKit integration
- Next.js 15.3.3 with TypeScript
- Tailwind CSS for styling
- Wallet integration via Wagmi
- Frame metadata and notification system ready
- Base branding guidelines integration

## Game Features Plan

### Core Gameplay
- [ ] 15x15 Scrabble board
- [ ] Standard Scrabble tile distribution (100 tiles total)
- [ ] Letter values and bonus squares (double/triple letter/word)
- [ ] Word validation system
- [ ] Score calculation
- [ ] Turn-based gameplay

### AI Opponent
- [ ] Simple word-finding algorithm
- [ ] Basic strategy (prioritize high-scoring moves)
- [ ] Configurable difficulty levels
- [ ] Move validation and scoring

### UI Components Needed
- [ ] `ScrabbleBoard` - Clean, grid-based game board with Base styling
- [ ] `TileRack` - Horizontal tile rack with smooth animations
- [ ] `GameControls` - Minimal, intuitive action buttons (Pass, Swap, Submit)
- [ ] `ScoreDisplay` - Clean score indicators with Base typography
- [ ] `GameState` - Game logic and state management
- [ ] `Tile` - Elegant tile design with letter values and smooth interactions
- [ ] `GameHeader` - Simple header with turn indicator and game status
- [ ] `GameFooter` - Minimal footer with game actions

### MiniKit Integration
- [ ] Frame metadata for sharing game state
- [ ] Wallet connection for player identity
- [ ] Notifications for turn updates
- [ ] Responsive design for mobile-first experience
- [ ] Optional: On-chain leaderboards/statistics

## Technical Implementation

### Dependencies to Add
- [ ] Word dictionary/validation library (e.g., `word-list`, `an-array-of-english-words`)
- [ ] Possibly simple AI library for opponent moves

### Game State Structure
```typescript
interface GameState {
  board: BoardTile[][];
  playerTiles: string[];
  aiTiles: string[];
  playerScore: number;
  aiScore: number;
  currentTurn: 'player' | 'ai';
  gameStatus: 'playing' | 'finished';
  tileBag: string[];
}
```

### Scrabble Constants
- Standard tile distribution: A(9), B(2), C(2), D(4), E(12), F(2), G(3), H(2), I(9), J(1), K(1), L(4), M(2), N(6), O(8), P(2), Q(1), R(6), S(4), T(6), U(4), V(2), W(2), X(1), Y(2), Z(1)
- Letter values: A(1), B(3), C(3), D(2), E(1), F(4), G(2), H(4), I(1), J(8), K(5), L(1), M(3), N(1), O(1), P(3), Q(10), R(1), S(1), T(1), U(1), V(4), W(4), X(8), Y(4), Z(10)

### Bonus Squares Layout
- Triple Word: (0,0), (7,0), (14,0), (0,7), (14,7), (0,14), (7,14), (14,14)
- Double Word: (1,1), (2,2), (3,3), (4,4), (5,5), (6,6), (8,8), (9,9), (10,10), (11,11), (12,12), (13,13), (7,7)
- Triple Letter: (1,5), (1,9), (5,1), (5,5), (5,9), (5,13), (9,1), (9,5), (9,9), (9,13), (13,5), (13,9)
- Double Letter: (0,3), (0,11), (2,6), (2,8), (3,0), (3,7), (3,14), (6,2), (6,6), (6,8), (6,12), (7,3), (7,11), (8,2), (8,6), (8,8), (8,12), (11,0), (11,7), (11,14), (12,6), (12,8), (14,3), (14,11)

## Development Phases

### Phase 1: Basic Setup & UI Foundation
- [x] Create game components structure with Base design system
- [x] Set up basic game state management
- [x] Create clean Scrabble board layout with Base styling
- [x] Implement elegant tile system with smooth interactions
- [x] Design responsive layout for mobile-first experience

### Phase 2: Core Gameplay
- [x] Implement word validation
- [x] Add score calculation
- [x] Create tile placement logic
- [x] Add turn management
- [x] Add word dictionary/validation
- [x] Implement proper tile selection and placement
- [x] Add visual feedback for valid/invalid moves

### Phase 3: AI Opponent
- [x] Implement basic AI word finding algorithm
- [x] Add AI strategy and move selection
- [x] Create AI difficulty levels (Easy, Medium, Hard)
- [x] Add AI move visualization and animations
- [x] Test and balance AI difficulty
- [x] Add AI thinking time simulation

### Phase 4: MiniKit Integration
- [x] Integrate with Frame metadata for game state sharing
- [x] Add wallet-based player tracking and statistics
- [x] Implement notifications for turn updates and game events
- [x] Add game state persistence with wallet identity
- [x] Polish UI for mobile-first MiniKit experience
- [x] Add social sharing features via Farcaster

### Phase 5: Polish & Features
- [x] Add sound effects and audio feedback
- [x] Implement smooth animations and transitions
- [x] Add haptic feedback for mobile devices
- [x] Create game achievements and milestones
- [x] Add tutorial/hint system for new players
- [x] Implement game settings and preferences
- [x] Add keyboard shortcuts and accessibility
- [x] Final testing, bug fixes, and performance optimization

## Design System & Base Branding
- **Colors**: Use Base's blue (#0052FF) as primary, with clean grays and whites
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins following Base guidelines
- **Animations**: Subtle, smooth transitions for better UX
- **Icons**: Simple, recognizable icons that match Base's style

## Notes & Ideas
- Keep the interface minimal - focus on core gameplay
- Use clear visual feedback for valid/invalid moves
- Consider adding a "hint" system for new players
- Maybe add a "practice mode" without AI
- Could add different board themes or layouts
- Consider adding a "challenge mode" with time limits
- Maybe integrate with Farcaster for social features

## Resources
- [Scrabble Rules](https://scrabble.hasbro.com/en-us/rules)
- [MiniKit Documentation](https://docs.base.org/builderkits/minikit/overview)
- [OnchainKit Documentation](https://docs.base.org/builderkits/onchainkit/getting-started)
