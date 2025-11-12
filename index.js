const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Middleware - CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local development
    'http://localhost:5174',
    'https://your-netlify-app.netlify.app', // Replace with your actual Netlify URL
    'https://your-custom-domain.com' // Replace with your custom domain if you have one
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: 'Unauthorized access' });
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized access' });
    }
    req.decoded = decoded;
    next();
  });
};

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and Collection references
let database;
let habitsCollection;

// Connect to MongoDB
async function connectDB() {
  if (!database) {
    await client.connect();
    console.log('Connected to MongoDB!');
    database = client.db('habitTrackerDB');
    habitsCollection = database.collection('habits');
  }
  return { database, habitsCollection };
}

// Health check route
app.get('/', (req, res) => {
  res.send('Habit Tracker Server is running!');
});

// JWT Token Generation Route
app.post('/jwt', async (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ message: 'Error generating token', error: error.message });
  }
});// POST /habits - Create a new habit (Protected)
app.post('/habits', verifyToken, async (req, res) => {
  try {
    await connectDB();
    const habit = req.body;
        const newHabit = {
          ...habit,
          currentStreak: 0,
          completionHistory: [],
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const result = await habitsCollection.insertOne(newHabit);
        res.status(201).send(result);
      } catch (error) {
        console.error('Error creating habit:', error);
        res.status(500).send({ message: 'Failed to create habit', error: error.message });
      }
    });

// GET /habits/public - Get all public habits
app.get('/habits/public', async (req, res) => {
  try {
    await connectDB();
    const habits = await habitsCollection
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(habits);
  } catch (error) {
    console.error('Error fetching public habits:', error);
    res.status(500).send({ message: 'Failed to fetch habits', error: error.message });
  }
});// GET /habits - Get user's habits by email query (Protected)
app.get('/habits', verifyToken, async (req, res) => {
  try {
    await connectDB();
    const userEmail = req.query.userEmail;
    if (!userEmail) {
      return res.status(400).send({ message: 'User email is required' });
    }
    
    // Verify that the user is requesting their own habits
    if (req.decoded.email !== userEmail) {
      return res.status(403).send({ message: 'Forbidden access' });
    }

    const habits = await habitsCollection
      .find({ userEmail: userEmail })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(habits);
  } catch (error) {
    console.error('Error fetching user habits:', error);
    res.status(500).send({ message: 'Failed to fetch habits', error: error.message });
  }
});// GET /habits/:id - Get single habit by ID (Protected)
app.get('/habits/:id', verifyToken, async (req, res) => {
  try {
    await connectDB();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const habit = await habitsCollection.findOne(query);
    
    if (!habit) {
      return res.status(404).send({ message: 'Habit not found' });
    }
    
    res.send(habit);
  } catch (error) {
    console.error('Error fetching habit:', error);
    res.status(500).send({ message: 'Failed to fetch habit', error: error.message });
  }
});

// PUT /habits/:id - Update habit (Protected)
app.put('/habits/:id', verifyToken, async (req, res) => {
  try {
    await connectDB();
    const id = req.params.id;
    const updates = req.body;
    
    // Find the habit first to verify ownership
    const habit = await habitsCollection.findOne({ _id: new ObjectId(id) });
    if (!habit) {
      return res.status(404).send({ message: 'Habit not found' });
    }
    
    // Verify that the user owns this habit
    if (habit.userEmail !== req.decoded.email) {
      return res.status(403).send({ message: 'Forbidden: You can only update your own habits' });
    }

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        ...updates,
        updatedAt: new Date()
      }
    };
    
    const result = await habitsCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).send({ message: 'Failed to update habit', error: error.message });
  }
});

// DELETE /habits/:id - Delete habit (Protected)
app.delete('/habits/:id', verifyToken, async (req, res) => {
  try {
    await connectDB();
    const id = req.params.id;
    
    // Find the habit first to verify ownership
    const habit = await habitsCollection.findOne({ _id: new ObjectId(id) });
    if (!habit) {
      return res.status(404).send({ message: 'Habit not found' });
    }
    
    // Verify that the user owns this habit
    if (habit.userEmail !== req.decoded.email) {
      return res.status(403).send({ message: 'Forbidden: You can only delete your own habits' });
    }

    const query = { _id: new ObjectId(id) };
    const result = await habitsCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).send({ message: 'Failed to delete habit', error: error.message });
  }
});

// PUT /habits/:id/complete - Mark habit as complete for today (Protected)
app.put('/habits/:id/complete', verifyToken, async (req, res) => {
  try {
    await connectDB();
    const id = req.params.id;
    const { completionDate } = req.body;
    
    // Find the habit first to verify ownership
    const habit = await habitsCollection.findOne({ _id: new ObjectId(id) });
    if (!habit) {
      return res.status(404).send({ message: 'Habit not found' });
    }
    
    // Verify that the user owns this habit
    if (habit.userEmail !== req.decoded.email) {
      return res.status(403).send({ message: 'Forbidden: You can only complete your own habits' });
    }

    const today = new Date(completionDate).toISOString().split('T')[0];
    
    // Check if already completed today
    const alreadyCompleted = habit.completionHistory?.some(date => {
      const completionDay = new Date(date).toISOString().split('T')[0];
      return completionDay === today;
    });

    if (alreadyCompleted) {
      return res.status(400).send({ message: 'Habit already completed today' });
    }

    // Add completion date to history
    const completionHistory = habit.completionHistory || [];
    completionHistory.push(new Date(completionDate));

    // Calculate streak
    const sortedHistory = completionHistory
      .map(d => new Date(d).toISOString().split('T')[0])
      .sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 1;
    for (let i = 0; i < sortedHistory.length - 1; i++) {
      const currentDate = new Date(sortedHistory[i]);
      const nextDate = new Date(sortedHistory[i + 1]);
      const diffTime = currentDate - nextDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Update habit with new completion
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        completionHistory: completionHistory,
        currentStreak: currentStreak,
        lastCompletedAt: new Date(completionDate),
        updatedAt: new Date()
      }
    };

    await habitsCollection.updateOne(filter, updateDoc);
    
    // Return updated habit
    const updatedHabit = await habitsCollection.findOne(filter);
    res.send(updatedHabit);
  } catch (error) {
    console.error('Error marking habit complete:', error);
    res.status(500).send({ message: 'Failed to mark habit complete', error: error.message });
  }
});

// PATCH /habits/:id/complete - Alternative endpoint for mark complete
app.patch('/habits/:id/complete', verifyToken, async (req, res) => {
  try {
    await connectDB();
    const id = req.params.id;
    const completionDate = new Date();
    
    // Find the habit first to verify ownership
    const habit = await habitsCollection.findOne({ _id: new ObjectId(id) });
    if (!habit) {
      return res.status(404).send({ message: 'Habit not found' });
    }
    
    // Verify that the user owns this habit
    if (habit.userEmail !== req.decoded.email) {
      return res.status(403).send({ message: 'Forbidden: You can only complete your own habits' });
    }

    const today = completionDate.toISOString().split('T')[0];
    
    // Check if already completed today
    const alreadyCompleted = habit.completionHistory?.some(date => {
      const completionDay = new Date(date).toISOString().split('T')[0];
      return completionDay === today;
    });

    if (alreadyCompleted) {
      return res.status(400).send({ message: 'Habit already completed today' });
    }

    // Calculate new streak
    const completionHistory = habit.completionHistory || [];
    completionHistory.push(completionDate);
    
    const sortedHistory = completionHistory
      .map(d => new Date(d).toISOString().split('T')[0])
      .sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 1;
    for (let i = 0; i < sortedHistory.length - 1; i++) {
      const currentDate = new Date(sortedHistory[i]);
      const nextDate = new Date(sortedHistory[i + 1]);
      const diffTime = currentDate - nextDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        completionHistory: completionHistory,
        currentStreak: currentStreak,
        lastCompletedAt: completionDate,
        updatedAt: new Date()
      }
    };

    const result = await habitsCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    console.error('Error marking habit complete:', error);
    res.status(500).send({ message: 'Failed to mark habit complete', error: error.message });
  }
});

// Export the Express app for Vercel
module.exports = app;
