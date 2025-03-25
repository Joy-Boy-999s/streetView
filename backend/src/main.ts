const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'your-secret-key';
const users = []; // In-memory user storage (replace with a database in production)

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { name, email, password: hashedPassword };
  users.push(user);

  const token = jwt.sign({ email, name }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/api/dashboard', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'User not logged in' });

  try {
    jwt.verify(token, SECRET_KEY);
    res.json({ message: 'Welcome to the dashboard', cards: [
      { id: '1', title: 'North India', description: 'Explore the northern region' },
      { id: '2', title: 'South India', description: 'Discover southern culture' },
      { id: '3', title: 'East India', description: 'Journey to the east' },
    ]});
  } catch (error) {
    res.status(401).json({ message: 'User not logged in' });
  }
});

app.get('/api/map/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'User not logged in' });

  try {
    jwt.verify(token, SECRET_KEY);
    res.json({ cardId: req.params.id, message: 'Map view loaded' });
  } catch (error) {
    res.status(401).json({ message: 'User not logged in' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
