# Blueprint

## Overview

This document outlines the plan for enhancing the session management capabilities of the NativeSpeak application. The goal is to implement the session management features described in the provided documentation to make the application more robust and resilient to connection interruptions.

## Current Implementation

The current implementation uses a `GenAILiveClient` to connect to the Live API. The `useLiveApi` hook manages the connection and configuration. However, it lacks the following features:

*   **Context Window Compression:** To extend session duration.
*   **Session Resumption:** To recover from connection drops.
*   **`goAway` message handling:** To gracefully handle impending connection closures.

## Implemented Changes

I have updated the application to include these features. Here is a summary of the changes:

### 1. `src/lib/genai-live-client.ts`

*   Added `sessionResumptionUpdate` and `goAway` to the `LiveClientEventTypes` interface.
*   In the `onMessage` method, detected and emitted `sessionResumptionUpdate` and `goAway` events.

### 2. `src/hooks/media/use-live-api.ts`

*   Enabled `contextWindowCompression` and `sessionResumption` in the default `LiveConnectConfig`.
*   Used a `useRef` to store the session resumption handle across connections.
*   Added a new event listener for the `sessionResumptionUpdate` event to update the handle.
*   Added a `goAway` event listener to log a console message when the connection is about to close.

These changes align the application with the best practices for session management with the Live API, resulting in a more stable and reliable user experience.