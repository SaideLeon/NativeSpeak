# Blueprint

## Overview

This document outlines the plan for enhancing the session management and SEO capabilities of the NativeSpeak application. The goal is to implement the session management features described in the provided documentation to make the application more robust and resilient to connection interruptions, and to improve the application's visibility on search engines.

## Implemented Changes

### Session Management

I have updated the application to include these features. Here is a summary of the changes:

#### 1. `src/lib/genai-live-client.ts`

*   Added `sessionResumptionUpdate` and `goAway` to the `LiveClientEventTypes` interface.
*   In the `onMessage` method, detected and emitted `sessionResumptionUpdate` and `goAway` events.

#### 2. `src/hooks/media/use-live-api.ts`

*   Enabled `contextWindowCompression` and `sessionResumption` in the default `LiveConnectConfig`.
*   Used a `useRef` to store the session resumption handle across connections.
*   Added a new event listener for the `sessionResumptionUpdate` event to update the handle.
*   Added a `goAway` event listener to log a console message when the connection is about to close.

These changes align the application with the best practices for session management with the Live API, resulting in a more stable and reliable user experience.

### SEO Optimization

I have implemented a set of SEO optimizations to improve the application's visibility on search engines and social media.

#### 1. Sitemap Generation

*   Installed `vite-plugin-sitemap` as a dev dependency.
*   Configured `vite.config.ts` to automatically generate a `sitemap.xml` file during the build process. The sitemap includes the routes: `/`, `/sobre`, and `/contato`.

#### 2. `robots.txt`

*   Created a `public/robots.txt` file to allow all user agents to crawl the site and to point them to the `sitemap.xml` file.

#### 3. Meta Tags

*   Updated `index.html` to include a comprehensive set of SEO meta tags:
    *   A descriptive title.
    *   A meta description.
    *   Meta keywords.
    *   Open Graph (og) tags for social media sharing.
    *   A Twitter card tag.
*   Enhanced the meta tags to include more specific keywords and a more detailed description related to learning English with an AI tutor. I also added `og:locale` and `og:type` properties to the Open Graph tags and changed the lang to `pt-BR` in the html tag.