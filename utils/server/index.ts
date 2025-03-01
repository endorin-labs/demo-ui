import { Message } from '@/types/chat';
import { OllamaModel } from '@/types/ollama';

import { OLLAMA_HOST } from '../app/const';

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';

export class OllamaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OllamaError';
  }
}

export const OllamaStream = async (
  model: string,
  systemPrompt: string,
  temperature: number,
  prompt: string,
) => {
  let url = `${OLLAMA_HOST}/api/chat`;

  // Format the messages array for the chat endpoint
  const messages = [
    { role: 'system', content: systemPrompt },
    // You'd need to parse your prompt string or convert existing messages
    // This assumes prompt is the latest user message
    { role: 'user', content: prompt },
  ];

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      model: model,
      messages: messages,
      options: {
        temperature: temperature,
      },
      stream: true, // Enable streaming
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const result = await res.json();
    if (result.error) {
      throw new OllamaError(result.error);
    }
  }

  const responseStream = new ReadableStream({
    async start(controller) {
      try {
        const reader = res.body?.getReader();
        if (!reader) throw new Error('Response body is not readable');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n');

          for (const line of lines) {
            if (!line.trim()) continue; // Skip empty lines

            try {
              const data = JSON.parse(line);
              if (data.message?.content) {
                controller.enqueue(encoder.encode(data.message.content));
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
              // Continue processing other lines even if one fails
            }
          }
        }

        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return responseStream;
};
