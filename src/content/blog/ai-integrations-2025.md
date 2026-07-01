---
title: "Integrating AI into Web Apps in 2025"
date: 2025-05-05
banner: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80"
description: "Practical patterns for adding AI features to existing web applications — what works, what doesn't, and where the real complexity hides."
---

AI integrations went from a novelty to a baseline expectation in 2025. Most clients now ask about AI features in the first discovery call. Here's what I've learned from shipping several of them.

## Streaming is Non-Negotiable

Users have zero patience for a loading spinner on AI responses. If your AI call takes 3-8 seconds and you show nothing until it completes, you'll lose them. Streaming via the Vercel AI SDK or direct SSE endpoints makes AI feel instant even when it isn't.

```ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const result = streamText({
  model: anthropic('claude-sonnet-4-6'),
  prompt: userMessage,
});

return result.toDataStreamResponse();
```

The frontend renders tokens as they arrive. Perceived performance is completely different from actual performance.

## Where to Put the Logic

The temptation is to call AI APIs from the client. Don't. You'll expose API keys, lose the ability to add caching or rate limiting, and make your app impossible to instrument. All AI calls go through a server-side route — API route in Next.js, endpoint in Astro, or a dedicated service.

## Prompt Engineering is Underrated

Most AI integration bugs aren't in the code — they're in the prompt. Spending time on system prompts, few-shot examples, and output format constraints will do more for reliability than any amount of error handling. Define the output schema and validate it server-side before sending to the client.

## Cost Control

Token costs add up fast. Cache responses where possible, use smaller models for classification or routing tasks, and set token limits per call. A well-designed prompt that uses 500 tokens is better than a verbose one that uses 2000.

The biggest lesson: treat AI as an I/O operation with a probability distribution over outputs, not a deterministic function. Build UX that handles variability gracefully.
