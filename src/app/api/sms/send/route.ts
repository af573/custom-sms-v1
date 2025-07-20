import { NextRequest, NextResponse } from 'next/server';
import SMSService from '@/lib/smsService';
import { validateApiKeyMiddleware, ApiKeyManager } from '@/lib/apiKeyUtils';

export async function POST(request: NextRequest) {
  try {
    // Get API key from headers
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!apiKey) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'API key is required',
          error_code: 'MISSING_API_KEY'
        },
        { status: 401 }
      );
    }

    // Validate API key
    const validation = await validateApiKeyMiddleware(apiKey);
    if (!validation.valid) {
      return NextResponse.json(
        {
          status: 'error',
          message: validation.error,
          error_code: 'INVALID_API_KEY'
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { number, message, phone } = body;
    
    // Support both 'number' and 'phone' for phone number
    const phoneNumber = number || phone;

    if (!phoneNumber || !message) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Phone number and message are required',
          error_code: 'MISSING_PARAMETERS'
        },
        { status: 400 }
      );
    }

    // Initialize SMS service
    const smsService = new SMSService();
    
    // Log the attempt
    await ApiKeyManager.logSmsUsage(
      validation.data!.id,
      phoneNumber,
      message,
      'pending'
    );

    // Send SMS
    const result = await smsService.sendSMS(phoneNumber, message);

    // Update log with result
    await ApiKeyManager.logSmsUsage(
      validation.data!.id,
      phoneNumber,
      message,
      result.success ? 'sent' : 'failed',
      result
    );

    if (result.success) {
      return NextResponse.json({
        status: 'success',
        message: 'SMS sent successfully',
        data: {
          phone_number: phoneNumber,
          message: message,
          timestamp: new Date().toISOString(),
          api_key_name: validation.data!.keyName
        },
        API_OWNER: '〲ɱ๏ɳᴀʳᴄʰ ⌾ғ sʜᴀᴅᵒʷˢ〴',
        Contact_Owner: '@AF_Team_Owner',
        SYSTEM: 'CUSTOM SMS API',
        TG_Channel: '@AF_T3M'
      });
    } else {
      return NextResponse.json({
        status: 'failed',
        message: result.message || 'Failed to send SMS',
        error_code: 'SMS_SEND_FAILED',
        API_OWNER: '〲ɱ๏ɳᴀʳᴄʰ ⌾ғ sʜᴀᴅᵒʷˢ〴',
        Contact_Owner: '@AF_Team_Owner',
        SYSTEM: 'CUSTOM SMS API',
        TG_Channel: '@AF_T3M'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('SMS API Error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Internal server error',
      error_code: 'INTERNAL_ERROR',
      API_OWNER: '〲ɱ๏ɳᴀʳᴄʰ ⌾ғ sʜᴀᴅᵒʷˢ〴',
      Contact_Owner: '@AF_Team_Owner',
      SYSTEM: 'CUSTOM SMS API',
      TG_Channel: '@AF_T3M'
    }, { status: 500 });
  }
}

// GET method for backward compatibility (like the original PHP)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const number = searchParams.get('number');
    const message = searchParams.get('msg') || searchParams.get('message');
    const apiKey = searchParams.get('api_key') || request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'API key is required',
          error_code: 'MISSING_API_KEY'
        },
        { status: 401 }
      );
    }

    if (!number || !message) {
      return NextResponse.json({
        status: 'error',
        message: 'Parameters missing (number and msg/message required)',
        API_OWNER: '〲ɱ๏ɳᴀʳᴄʰ ⌾ғ sʜᴀᴅᵒʷˢ〴',
        Contact_Owner: '@AF_Team_Owner',
        SYSTEM: 'CUSTOM SMS API',
        TG_Channel: '@AF_T3M'
      }, { status: 400 });
    }

    // Validate API key
    const validation = await validateApiKeyMiddleware(apiKey);
    if (!validation.valid) {
      return NextResponse.json(
        {
          status: 'error',
          message: validation.error,
          error_code: 'INVALID_API_KEY'
        },
        { status: 401 }
      );
    }

    // Initialize SMS service
    const smsService = new SMSService();
    
    // Log the attempt
    await ApiKeyManager.logSmsUsage(
      validation.data!.id,
      number,
      message,
      'pending'
    );

    // Send SMS
    const result = await smsService.sendSMS(number, message);

    // Update log with result
    await ApiKeyManager.logSmsUsage(
      validation.data!.id,
      number,
      message,
      result.success ? 'sent' : 'failed',
      result
    );

    if (result.success) {
      return NextResponse.json({
        status: 'success',
        message: 'SMS sent successfully',
        API_OWNER: '〲ɱ๏ɳᴀʳᴄʰ ⌾ғ sʜᴀᴅᵒʷˢ〴',
        Contact_Owner: '@AF_Team_Owner',
        SYSTEM: 'CUSTOM SMS API',
        TG_Channel: '@AF_T3M'
      });
    } else {
      return NextResponse.json({
        status: 'failed',
        message: result.message || 'Failed to send SMS',
        API_OWNER: '〲ɱ๏ɳᴀʳᴄʰ ⌾ғ sʜᴀᴅᵒʷˢ〴',
        Contact_Owner: '@AF_Team_Owner',
        SYSTEM: 'CUSTOM SMS API',
        TG_Channel: '@AF_T3M'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('SMS API Error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Internal server error',
      API_OWNER: '〲ɱ๏ɳᴀʳᴄʰ ⌾ғ sʜᴀᴅᵒʷˢ〴',
      Contact_Owner: '@AF_Team_Owner',
      SYSTEM: 'CUSTOM SMS API',
      TG_Channel: '@AF_T3M'
    }, { status: 500 });
  }
}
