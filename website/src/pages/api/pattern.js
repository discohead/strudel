import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Mark this endpoint as server-rendered to handle POST requests
export const prerender = false;

const PATTERN_FILE = resolve('./current-pattern.js');

export async function GET() {
  try {
    const content = existsSync(PATTERN_FILE) 
      ? readFileSync(PATTERN_FILE, 'utf8')
      : '';
    
    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST({ request }) {
  try {
    const { content } = await request.json();
    writeFileSync(PATTERN_FILE, content, 'utf8');
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function all({ request }) {
  const method = request.method;
  
  if (method === 'GET') {
    return GET();
  } else if (method === 'POST') {
    return POST({ request });
  }
  
  return new Response('Method not allowed', { status: 405 });
}