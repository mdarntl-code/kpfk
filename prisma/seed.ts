import { PrismaClient, Role, SessionStatus, PaymentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAvailability() {
    const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
    const count = getRandomInt(3, 6);
    const shuffled = times.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).sort();
}

async function main() {
    const password = await bcrypt.hash('password123', 10)

    try {
        await prisma.payment.deleteMany()
        await prisma.feedback.deleteMany()
        await prisma.session.deleteMany()
        await prisma.user.deleteMany()
    } catch (e) {
        console.log('Error clearing data:', e)
    }

    const learner = await prisma.user.create({
        data: {
            email: 'learner@example.com',
            name: 'Learner User',
            password,
            role: Role.LEARNER,
            bio: 'Ready to learn and grow!',
            avatar: 'LU'
        }
    })

    const mentorsData = [
        { email: "sarah@example.com", name: "Sarah Chen", avatar: "SC", skill: "Guitar Basics", category: "Music", bio: "Professional guitar instructor.", location: "Brooklyn, NY", rate: 25 },
        { email: "marcus@example.com", name: "Marcus Rivera", avatar: "MR", skill: "Math Helper", category: "Academic", bio: "Former high school math teacher.", location: "Austin, TX", rate: 30 },
        { email: "aiko@example.com", name: "Aiko Tanaka", avatar: "AT", skill: "Japanese for Beginners", category: "Language", bio: "Native speaker and certified instructor.", location: "San Francisco, CA", rate: 40 },
        { email: "david@example.com", name: "David Okafor", avatar: "DO", skill: "Python Programming", category: "Technology", bio: "Senior software engineer.", location: "Seattle, WA", rate: 60 },
        { email: "elena@example.com", name: "Elena Volkov", avatar: "EV", skill: "Watercolor Painting", category: "Art & Design", bio: "Gallery-exhibited watercolor artist.", location: "Portland, OR", rate: 35 },
        { email: "james@example.com", name: "James Wright", avatar: "JW", skill: "Yoga & Meditation", category: "Fitness", bio: "Certified yoga instructor.", location: "Denver, CO", rate: 20 },
        { email: "priya@example.com", name: "Priya Sharma", avatar: "PS", skill: "Indian Cooking", category: "Cooking", bio: "Food blogger sharing authentic recipes.", location: "Chicago, IL", rate: 45 },
        { email: "tom@example.com", name: "Tom Bradley", avatar: "TB", skill: "Public Speaking", category: "Business", bio: "Executive presentation coach.", location: "New York, NY", rate: 80 },
        { email: "anna@example.com", name: "Anna Schmidt", avatar: "AS", skill: "German Language", category: "Language", bio: "Native German with 5 years of teaching experience.", location: "Berlin, DE", rate: 35 },
        { email: "chris@example.com", name: "Chris Evans", avatar: "CE", skill: "Personal Trainer", category: "Fitness", bio: "Fitness enthusiast and personal trainer.", location: "Los Angeles, CA", rate: 50 },
        { email: "maria@example.com", name: "Maria Garcia", avatar: "MG", skill: "Digital Marketing", category: "Business", bio: "Marketing expert with agency background.", location: "Madrid, ES", rate: 55 },
        { email: "lucas@example.com", name: "Lucas Silva", avatar: "LS", skill: "Web Development", category: "Technology", bio: "Full-stack developer working with React and Node.", location: "Lisbon, PT", rate: 45 },
    ]

    const createdMentors = []
    for (const m of mentorsData) {
        const reviewCount = getRandomInt(10, 50);
        const rating = (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1);

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
                rate: m.rate,
                availability: getRandomAvailability(),
                location: m.location,
                role: Role.MENTOR
            }
        })
        createdMentors.push(mentor)
    }

    // Add Sessions and feedback to all mentors
    const feedbackComments = [
        "Incredible mentor, explained everything perfectly!",
        "Very patient and knowledgeable.",
        "I learned so much in just one hour.",
        "Great session, highly recommended.",
        "Good communication, but the pace was a bit fast.",
        "Excellent! Looking forward to the next session."
    ]

    for (const mentor of createdMentors) {
        // Create 2 completed sessions with feedback for each mentor
        for (let i = 0; i < 2; i++) {
            await prisma.session.create({
                data: {
                    mentorId: mentor.id,
                    learnerId: learner.id,
                    title: `Session with ${mentor.name}`,
                    scheduledAt: new Date(Date.now() - 86400000 * (i * 10 + 2)),
                    price: mentor.rate || 20,
                    status: SessionStatus.COMPLETED,
                    payment: {
                        create: {
                            amount: mentor.rate || 20,
                            status: PaymentStatus.COMPLETED
                        }
                    },
                    feedback: {
                        create: {
                            rating: getRandomInt(4, 5),
                            comment: feedbackComments[getRandomInt(0, feedbackComments.length - 1)]
                        }
                    }
                }
            })
        }

        // Create 1 pending session for some mentors
        if (Math.random() > 0.5) {
            await prisma.session.create({
                data: {
                    mentorId: mentor.id,
                    learnerId: learner.id,
                    title: `Upcoming Session with ${mentor.name}`,
                    scheduledAt: new Date(Date.now() + 86400000 * getRandomInt(1, 5)),
                    price: mentor.rate || 20,
                    status: SessionStatus.PENDING,
                    payment: {
                        create: {
                            amount: mentor.rate || 20,
                            status: PaymentStatus.PENDING
                        }
                    }
                }
            })
        }
    }

    console.log('Seeding finished successfully.')
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
