import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
        throw new Error(
            'DATABASE_URL is not set in environment variables'
        )
    }

    const pool = new Pool({ connectionString })
    // @ts-ignore
    const adapter = new PrismaNeon(pool)
    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development'
            ? ['error', 'warn']
            : ['error'],
    })
}

export const prisma =
    globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
