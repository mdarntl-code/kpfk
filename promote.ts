import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // 1. Promote learner to SUPERADMIN
    await prisma.user.updateMany({
        where: { email: 'learner@example.com' },
        data: { role: Role.SUPERADMIN }
    })
    console.log('Promoted learner@example.com to SUPERADMIN')

    // 2. Create a dedicated Admin account if it doesn't exist
    const password = await bcrypt.hash('admin123', 10)

    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@example.com' }
    })

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                email: 'admin@example.com',
                name: 'System Admin',
                password,
                role: Role.SUPERADMIN,
                bio: 'Platform Administrator',
                avatar: 'AD'
            }
        })
        console.log('Created dedicated admin account: admin@example.com / admin123')
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
