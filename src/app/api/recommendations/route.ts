import { NextRequest, NextResponse } from 'next/server';

// Define your backend endpoint URL here
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://your-backend-api.com/recommendations';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body (user's answers)
    const body = await request.json();
    
    // Call your external backend API
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers if needed
        // 'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the recommendation
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendation' },
      { status: 500 }
    );
  }
}
