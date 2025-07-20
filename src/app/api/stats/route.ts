import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ApiKeyManager } from '@/lib/apiKeyUtils';
import { Database } from '@/types/database';

// GET - Fetch usage statistics
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const apiKeyId = searchParams.get('api_key_id');
    const days = parseInt(searchParams.get('days') || '30');

    if (!apiKeyId) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }

    // Verify the API key belongs to the user
    const userApiKeys = await ApiKeyManager.getUserApiKeys(user.id);
    const apiKeyExists = userApiKeys.some(key => key.id === apiKeyId);

    if (!apiKeyExists) {
      return NextResponse.json(
        { error: 'API key not found or access denied' },
        { status: 403 }
      );
    }

    // Fetch usage statistics
    const stats = await ApiKeyManager.getUsageStats(apiKeyId, days);
    
    // Calculate totals
    const totals = stats.reduce((acc, stat) => ({
      totalSms: acc.totalSms + stat.sms_count,
      totalSuccess: acc.totalSuccess + stat.success_count,
      totalFailed: acc.totalFailed + stat.failed_count
    }), { totalSms: 0, totalSuccess: 0, totalFailed: 0 });

    return NextResponse.json({
      success: true,
      data: {
        stats: stats,
        totals: totals,
        period: `${days} days`
      }
    });

  } catch (error) {
    console.error('Error fetching usage statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
