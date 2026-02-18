
import { PrismaClient, Role, SessionStatus, PaymentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAvailability() {
    const times = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"];
    const count = getRandomInt(3, 8);
    const shuffled = times.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).sort();
}

async function main() {
    const password = await bcrypt.hash('password123', 10)

    // Clear existing data
    try {
        await prisma.payment.deleteMany()
        await prisma.feedback.deleteMany()
        await prisma.session.deleteMany()
        await prisma.user.deleteMany()
    } catch (e) {
        console.log('Error clearing data (might be empty):', e)
    }

    // Create Learner
    const learner = await prisma.user.create({
        data: {
            email: 'learner@example.com',
            name: 'Learner User',
            password,
            role: Role.LEARNER,
            bio: 'Ready to learn!',
            avatar: 'LU'
        }
    })

    const mentorsData = [
        {
            email: "sarah@example.com",
            name: "Sarah Chen",
            avatar: "SC",
            skill: "Guitar Basics",
            category: "Music",
            bio: "Professional guitar instructor with 10 years of experience teaching beginners.",
            location: "Brooklyn, NY",
        },
        {
            email: "marcus@example.com",
            name: "Marcus Rivera",
            avatar: "MR",
            skill: "Math Helper",
            category: "Academic",
            bio: "Former high school math teacher turned private tutor.",
            location: "Austin, TX",
        },
        {
            email: "aiko@example.com",
            name: "Aiko Tanaka",
            avatar: "AT",
            skill: "Japanese for Beginners",
            category: "Language",
            bio: "Native Japanese speaker and certified language instructor.",
            location: "San Francisco, CA",
        },
        {
            email: "david@example.com",
            name: "David Okafor",
            avatar: "DO",
            skill: "Python Programming",
            category: "Technology",
            bio: "Senior software engineer at a top tech company.",
            location: "Seattle, WA",
        },
        {
            email: "elena@example.com",
            name: "Elena Volkov",
            avatar: "EV",
            skill: "Watercolor Painting",
            category: "Art & Design",
            bio: "Fine arts graduate and gallery-exhibited watercolor artist.",
            location: "Portland, OR",
        },
        {
            email: "james@example.com",
            name: "James Wright",
            avatar: "JW",
            skill: "Yoga & Meditation",
            category: "Fitness",
            bio: "Certified yoga instructor with 8 years of practice.",
            location: "Denver, CO",
        },
        {
            email: "priya@example.com",
            name: "Priya Sharma",
            avatar: "PS",
            skill: "Indian Cooking",
            category: "Cooking",
            bio: "Home chef and food blogger sharing authentic family recipes.",
            location: "Chicago, IL",
        },
        {
            email: "tom@example.com",
            name: "Tom Bradley",
            avatar: "TB",
            skill: "Public Speaking",
            category: "Business",
            bio: "Executive presentation coach and former TEDx speaker.",
            location: "New York, NY",
        },
    ]

    const createdMentors = []
    for (const m of mentorsData) {
        const rate = getRandomInt(15, 60);
        const reviewCount = getRandomInt(5, 100);
        const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1); // 4.0 to 5.0

        const mentor = await prisma.user.create({
            data: {
                email: m.email,
                password,
                name: m.name,
                avatar: m.avatar,
                skill: m.skill,
                category: m.category,
                bio: m.bio,
                rating: parseFloat(rating),
                reviewCount: reviewCount,
                rate: rate,
                availability: getRandomAvailability(),
                location: m.location,
                role: Role.MENTOR
            }
        })
        createdMentors.push(mentor)
    }
    console.log(`Created ${createdMentors.length} mentors`)

    // Create Mock Sessions
    const sessionData = [
        {
            mentor: createdMentors[0],
            status: 'COMPLETED',
            title: "Intro to Guitar Chords",
            date: new Date(Date.now() - 86400000 * 2)
        },
        {
            mentor: createdMentors[1],
            status: 'UPCOMING',
            title: "Algebra Review",
            date: new Date(Date.now() + 86400000 * 2)
        },
        {
            mentor: createdMentors[2],
            status: 'CANCELLED',
            title: "Japanese Basics",
            date: new Date(Date.now() + 86400000 * 5)
        }
    ]

    for (const s of sessionData) {
        await prisma.session.create({
            data: {
                mentorId: s.mentor.id,
                learnerId: learner.id,
                title: s.title,
                scheduledAt: s.date,
                price: s.mentor.rate || 15,
                status: s.status === 'COMPLETED' ? SessionStatus.COMPLETED :
                    s.status === 'CANCELLED' ? SessionStatus.CANCELLED : SessionStatus.UPCOMING,
                payment: {
                    create: {
                        amount: s.mentor.rate || 15,
                        status: s.status === 'COMPLETED' ? PaymentStatus.COMPLETED :
                            s.status === 'CANCELLED' ? PaymentStatus.FAILED : PaymentStatus.PENDING
                    }
                }
            }
        })
    }

    console.log('Seeding finished.')
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
