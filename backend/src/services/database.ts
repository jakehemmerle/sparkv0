import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Connect to database on startup
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully (Prisma)')
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  })

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma
