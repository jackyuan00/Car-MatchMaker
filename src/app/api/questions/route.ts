import { NextResponse } from 'next/server';

// Define your backend endpoint URL here
const BACKEND_API_URL = process.env.BACKEND_QUESTIONS_URL || 'https://your-backend-api.com/questions';

export async function GET() {
  try {
    // Call your external backend API
    const response = await fetch(BACKEND_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers if needed
        // 'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
      },
      // Disable caching
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the questions
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching questions:', error);
    
    // Fallback to local questions if backend fails
    const fallbackQuestions = await import('../../data/questions.json');
    return NextResponse.json(fallbackQuestions);
  }
}
