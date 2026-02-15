# Zeshopp Chat

## Overview
Zeshopp Chat is a full-featured messaging application built with React, TypeScript, and Supabase. It includes chat messaging, voice/video calls (WebRTC), a wallet system, stories/status updates, group chats, and more.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite, styled with Tailwind CSS and shadcn/ui
- **Backend**: Supabase (PostgreSQL database, Auth, Realtime, Storage, Edge Functions)
- **Routing**: react-router-dom v6
- **State Management**: React Query + custom stores (chatStore, accountStore, transactionStore)
- **Real-time**: Supabase Realtime subscriptions for messages, typing indicators, and presence
- **Calls**: WebRTC peer-to-peer voice/video calling
- **Wallet**: Ledger-based wallet system via Supabase Edge Functions

## Project Structure
```
src/
  App.tsx              - Main app with routing
  main.tsx             - Entry point
  index.css            - Design system (CSS variables, themes)
  assets/              - Static assets (logo)
  components/
    ui/                - shadcn/ui components
    call/              - Call-related components
    chat/              - Chat-related components (reactions, search, voice recorder)
    stories/           - Stories/status components
    dev/               - Dev health banner
    BottomNavigation.tsx - Tab bar navigation (Chats, Calls, Contacts, Settings)
    SpeedDialFAB.tsx   - Floating action button with speed dial menu
  contexts/
    AuthContext.tsx     - Authentication state
    CallContext.tsx     - Call state management
  hooks/               - Custom hooks (useTheme, useChatStore, useWebRTC, etc.)
  integrations/
    supabase/          - Supabase client and types
  lib/                 - Services (auth, chat, wallet, storage, etc.)
  pages/               - All page components
supabase/
  functions/           - Edge Functions (wallet operations, push notifications)
  migrations/          - Database migrations
```

## Environment Variables Required
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key

## Running
- Dev server: `npx vite --host 0.0.0.0 --port 5000`
- Build: `npx vite build`

## Recent Changes
- 2026-02-14: New feature systems (Round 7)
  - Bots System: 4 pre-built bots (Helper, Reminder, Quiz, News), bot chat UI with command suggestions, create custom bots with commands, bot message cards
  - Nearby People: GPS-based user discovery, visibility toggle, connection requests (send/accept/decline), distance display, mock nearby users
  - Voice Chat (Group Calls): voice room creation, participant grid with speaking indicators, mute/unmute, raise hand, animated pulse effects, VoiceChatBanner for group chats
  - Multi-Device Support: active sessions page, device detection (browser/OS/type), terminate sessions, mock sessions for demo
  - New services: botService, nearbyService, voiceChatService, deviceService
  - New pages: Bots, BotChat, NearbyPeople, VoiceChatRoom, ActiveSessions
- 2026-02-14: New feature systems (Round 6)
  - Stickers & GIFs: 6 sticker packs (Smileys, Animals, Food, Sports, Travel, Symbols) with Unicode symbols, sticker picker with tabs/search/favorites/recent, integrated in chat input
  - Channel System: broadcast channels with subscriber model, channel creation/editing/deletion, channel message feed with view counts, subscribe/unsubscribe, Channels page with Megaphone nav tab
  - Username & Deep Links: set unique username, availability check, shareable profile links, QR code generation, copy link, Settings integration
  - Chat Import/Export: export as JSON or plain text, date range filtering, media inclusion toggle, import from JSON with preview, integrated in chat three-dot menu
  - New services: stickerService, channelService, usernameService, chatExportService
  - New pages: Channels, ChannelView
  - New components: StickerGifPicker, UsernameSettings, ChatExportDialog, ChatImportDialog
- 2026-02-14: Advanced Telegram features (Round 5)
  - Polls: create polls in chat with question + options, vote with progress bars, close polls, anonymous/multiple answer modes
  - Silent Messages: toggle silent mode per chat (bell icon next to send), messages don't trigger notifications
  - Message Translation: translate any text message via context menu, 15 languages, cached translations with visual indicator
  - Custom Chat Themes: per-chat theme picker with 8 presets (Ocean, Forest, Sunset, Berry, etc.), font size selector
  - Secret Chats: enable E2E encrypted mode with lock indicator, self-destruct timer options
  - Location Sharing: share GPS location via attachment menu, coordinates sent as message
  - Slow Mode: group chat rate limiting (10s to 1h intervals), cooldown timer display, admin configurable
  - Video Messages (Circles): record circular video messages up to 60s with progress ring, camera preview
  - Admin Controls: group admin panel with permissions (send messages, media, add members, pin, change info), member mute/unmute
  - Message Threads/Topics: forum-style topics in groups with color-coded tabs, per-topic messaging, pin/delete topics
  - New services: pollService, silentMessageService, translationService, chatThemeService, secretChatService, locationService, slowModeService, videoMessageService, adminService, topicService
  - New components: PollCreator, PollCard, ChatThemePicker, LocationCard, VideoMessageRecorder
- 2026-02-14: Advanced Telegram features (Round 4)
  - Chat Folders: folder tabs below filter chips, create/edit/delete folders, assign chats to folders, folder management via long-press
  - Privacy & Security Settings: full privacy page (last seen, read receipts, online status, profile photo, forwarded messages, phone number, groups visibility)
  - User Blocking: block/unblock from contact profile with confirmation, blocked users list in privacy settings with unblock
  - Link Previews: detect URLs in messages, render clickable links, show preview card with favicon + hostname
  - Notification Settings: granular controls for messages, groups, calls (toggles, sound selectors, vibrate)
  - Data & Storage Settings: storage usage display, clear cache, auto-download toggles, data saver mode, chat history export/delete
  - Scheduled Messages: schedule messages with date/time picker, client-side timer sends at scheduled time, view/delete scheduled messages in chat menu
  - New services: linkPreviewService, scheduledMessageService
  - New pages: PrivacySettings, NotificationSettings, DataStorageSettings
  - Updated privacyService with forwarded messages, phone number, groups fields
- 2026-02-14: Advanced Telegram features (Round 3)
  - Forward to chat picker: select chats to forward messages instead of clipboard
  - Draft messages: auto-saves unsent text per chat with 500ms debounce, shows "Draft:" in chat list
  - Disappearing messages: per-chat timer (off/24h/7d/30d) with UI in chat menu and header indicator
  - Multi-select mode: checkbox selection for bulk delete/forward with action bar
  - Media viewer: full-screen image/video gallery with zoom, navigation, download
  - Archive chats: swipe-to-archive with archived section at bottom of chat list
  - Service infrastructure: archiveService, blockService, privacyService, chatFolderService, draftService, disappearingService
  - ForwardPicker component with multi-chat selection and send confirmation
  - MediaViewer component with keyboard nav, pinch zoom, swipe between media
- 2026-02-13: Telegram-style message context menu (long-press/right-click)
  - Quick emoji reactions bar at top of context menu
  - Reply option with preview bar above input
  - Copy text to clipboard
  - Forward message (now uses chat picker)
  - Pin/Unpin messages with pinned message banner
  - Edit own text messages (updates in Supabase)
  - Delete with confirmation dialog
  - Save/Unsave messages
  - Message status info (read/delivered/sent at time)
  - Desktop support: long-press via mouse + right-click context menu
  - WallpaperPicker extracted as standalone component
  - Chat three-dot menu: Mute, Video Call, Search, Wallpaper, Clear History, Delete Chat
- 2026-02-13: Rebuilt Stories feature (Telegram-style)
  - Full video story support (record, upload, playback)
  - Telegram-style viewer: tap left/right to navigate, long-press to pause
  - Progress bars per story with proper video duration sync
  - Pause/play and mute/unmute controls
  - Story viewers list (pull-up sheet showing who viewed your story)
  - Reply to stories (sends as chat message)
  - Camera capture and gallery media picker
  - Text stories with 8 color backgrounds
  - Swipe down to close viewer
  - Animated slide-up story creator
  - storyService supports video type, media upload, viewer list
- 2026-02-13: Added more modern features (Round 2)
  - Message status ticks (sent/delivered/read) in chat list preview
  - Media type icons (camera/mic/file) for last message in chat list
  - Last seen / Online status text under user names
  - Missed calls badge count on Calls tab in bottom navigation
  - Animated empty states for Chats, Calls, and Contacts pages
  - formatLastSeen utility for human-readable last seen timestamps
  - useMissedCalls hook with real-time Supabase subscription
- 2026-02-13: Added modern features (Round 1)
  - Bottom Navigation Bar (Chats, Calls, Contacts, Settings tabs)
  - Speed Dial FAB (New Chat, New Group, Add Contact)
  - Chat Pinning (localStorage-backed per user)
  - Chat Filters (All, Unread, Groups)
  - Swipe actions on chats (Pin, Mute, Archive)
- 2026-02-13: Imported from Lovable to Replit
  - Configured Vite for port 5000 with allowedHosts
  - Removed lovable-tagger plugin
  - Set up static deployment config

## User Preferences
- Dark theme by default (Zeshopp dark theme design system)
- Pink/fruity primary brand color (HSL 338 85%)
