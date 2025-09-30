import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/cosmos'

export async function GET() {
  try {
    // Test Cosmos DB connection
    await getDatabase();
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: 'connected'
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
