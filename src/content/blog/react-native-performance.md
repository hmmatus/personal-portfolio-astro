---
title: "React Native Performance: What Actually Moves the Needle"
date: 2025-01-22
banner: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80"
description: "After working on 10+ React Native apps, here are the performance optimizations that actually made a measurable difference in production."
---

Performance in React Native is a topic where a lot of advice exists, but most of it focuses on micro-optimizations that don't move metrics in production apps. After shipping more than ten mobile applications, here's what actually helped.

## The Real Culprit: Re-renders

The most common performance issue I've seen isn't slow animations or large bundles — it's unnecessary re-renders caused by unstable references. Passing inline objects or functions as props creates a new reference on every render, causing child components to re-render even when nothing changed.

```tsx
// bad — new object reference every render
<ProfileCard user={{ name, avatar }} />

// good — stable reference
const user = useMemo(() => ({ name, avatar }), [name, avatar]);
<ProfileCard user={user} />
```

`React.memo` is only useful when props are referentially stable. Without `useMemo` and `useCallback` at the right layers, memoization does nothing.

## FlatList Optimization

`FlatList` is the most performance-sensitive component in most apps. Three things that consistently helped:

1. **`keyExtractor` must be stable** — using array index breaks virtualization on list updates.
2. **`getItemLayout`** — provide it whenever list items have fixed height. Eliminates expensive layout measurements.
3. **`initialNumToRender`** — set it to just what fits on screen. Default is 10, which is often too high for complex list items.

## Hermes Engine

Enabling Hermes (now default in RN 0.70+) gave us a consistent 20-30% startup time reduction across Android builds. If you're still on JSC for any reason, switching is the single highest-leverage change you can make.

## New Architecture

The new architecture (Fabric + JSI) eliminates the async bridge and enables synchronous native calls. On apps with heavy native module usage — camera, biometrics, crypto — the difference is noticeable. Worth the migration effort for production apps.

Profile with Flipper before optimizing. Most performance problems are visible in the component profiler before you write a single line of fix.
