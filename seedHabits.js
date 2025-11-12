const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const amazingHabits = [
  {
    title: "Morning Meditation",
    description: "Start your day with 10 minutes of mindfulness meditation. Clear your mind, reduce stress, and boost your focus for the entire day ahead.",
    category: "Mindfulness",
    reminderTime: "07:00",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "Sarah Johnson",
    authorName: "Sarah Johnson",
    currentStreak: 45,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    title: "Daily Reading Challenge",
    description: "Read for 30 minutes every day. Expand your knowledge, improve vocabulary, and escape into different worlds through books.",
    category: "Learning",
    reminderTime: "21:00",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "Michael Chen",
    authorName: "Michael Chen",
    currentStreak: 67,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 67 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    title: "Evening Workout Routine",
    description: "30-minute workout session including cardio and strength training. Build muscle, improve endurance, and maintain a healthy lifestyle.",
    category: "Health & Fitness",
    reminderTime: "18:00",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "Emma Wilson",
    authorName: "Emma Wilson",
    currentStreak: 89,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    title: "Gratitude Journal",
    description: "Write down 3 things you're grateful for each day. Cultivate positivity, boost mental health, and appreciate life's blessings.",
    category: "Mindfulness",
    reminderTime: "22:00",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "Alex Rodriguez",
    authorName: "Alex Rodriguez",
    currentStreak: 120,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    title: "Learn a New Language",
    description: "Practice Spanish for 20 minutes daily using apps and flashcards. Expand your horizons and connect with new cultures.",
    category: "Learning",
    reminderTime: "12:00",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "Olivia Martinez",
    authorName: "Olivia Martinez",
    currentStreak: 34,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    title: "Drink 8 Glasses of Water",
    description: "Stay hydrated throughout the day by drinking at least 8 glasses of water. Improve skin health, energy levels, and overall wellness.",
    category: "Health & Fitness",
    reminderTime: "09:00",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "James Anderson",
    authorName: "James Anderson",
    currentStreak: 156,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 156 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    title: "Deep Work Session",
    description: "2 hours of focused, distraction-free work on important tasks. Boost productivity and accomplish more in less time.",
    category: "Productivity",
    reminderTime: "09:00",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "David Kim",
    authorName: "David Kim",
    currentStreak: 78,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 78 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    title: "Connect with Friends",
    description: "Reach out to at least one friend or family member each day. Strengthen relationships and build a supportive social network.",
    category: "Social",
    reminderTime: "17:00",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "Sophia Lee",
    authorName: "Sophia Lee",
    currentStreak: 52,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    title: "No Phone Before Bed",
    description: "Put away all screens 1 hour before bedtime. Improve sleep quality and wake up refreshed and energized.",
    category: "Health & Fitness",
    reminderTime: "22:00",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "Ryan Taylor",
    authorName: "Ryan Taylor",
    currentStreak: 23,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    title: "Creative Writing Time",
    description: "Write for 15 minutes every day. Express yourself, unleash creativity, and develop your writing skills.",
    category: "Learning",
    reminderTime: "20:00",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "Isabella Brown",
    authorName: "Isabella Brown",
    currentStreak: 41,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    title: "Healthy Breakfast Routine",
    description: "Start every day with a nutritious breakfast. Fuel your body, boost metabolism, and maintain steady energy throughout the morning.",
    category: "Health & Fitness",
    reminderTime: "07:30",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "Liam White",
    authorName: "Liam White",
    currentStreak: 98,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 98 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    title: "Evening Stretching",
    description: "10 minutes of gentle stretching before bed. Improve flexibility, reduce muscle tension, and promote better sleep.",
    category: "Health & Fitness",
    reminderTime: "21:30",
    imageUrl: null,
    userEmail: "demo@example.com",
    userName: "Ava Garcia",
    authorName: "Ava Garcia",
    currentStreak: 63,
    completionHistory: [],
    isPublic: true,
    createdAt: new Date(Date.now() - 63 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

async function seedHabits() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB!');

    const database = client.db('habitTrackerDB');
    const habitsCollection = database.collection('habits');

    // Clear existing demo habits (optional)
    console.log('🗑️  Clearing existing demo habits...');
    await habitsCollection.deleteMany({ userEmail: 'demo@example.com' });

    // Insert amazing habits
    console.log('📝 Inserting amazing habits...');
    const result = await habitsCollection.insertMany(amazingHabits);
    
    console.log(`\n🎉 SUCCESS! ${result.insertedCount} amazing habits created!`);
    console.log('\n✨ Created habits:');
    amazingHabits.forEach((habit, index) => {
      console.log(`   ${index + 1}. ${habit.title} - ${habit.category} (${habit.currentStreak} day streak)`);
    });

    console.log('\n🌟 Your webpage should now display these amazing habits!');
    console.log('🔗 Visit: http://localhost:5174\n');

  } catch (error) {
    console.error('❌ Error seeding habits:', error);
  } finally {
    await client.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedHabits();
