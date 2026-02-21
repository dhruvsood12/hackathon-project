import { NextRequest, NextResponse } from 'next/server';
import { validateEmail, validateName } from '@/lib/validate';
import { getUserByEmail, createUser } from '@/lib/store';

// Simple ID generator for demo
function generateId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      );
    }

    // Check if user exists, otherwise create
    let user = getUserByEmail(email);
    if (!user) {
      user = createUser({
        id: generateId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        interests: []
      });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

