import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ApiKeyManager } from '@/lib/apiKeyUtils';
import { Database } from '@/types/database';

// DELETE - Delete an API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const apiKeyId = params.id;
    
    // Delete API key
    const success = await ApiKeyManager.deleteApiKey(apiKeyId, user.id);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'API key deleted successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete API key' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update API key (activate/deactivate)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;
    const apiKeyId = params.id;

    if (action === 'deactivate') {
      const success = await ApiKeyManager.deactivateApiKey(apiKeyId, user.id);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'API key deactivated successfully'
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to deactivate API key' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
