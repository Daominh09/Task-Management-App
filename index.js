// app.js
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { format } from 'date-fns';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 2400;

// __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory tasks
const tasks = {
  today: [], // each item: { text: string }
  work: []
};

// Setup view engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper to get formatted date
function getFormattedDate() {
  const now = new Date();
  return {
    day: format(now, 'd'),
    month: format(now, 'LLLL'),
    weekDay: format(now, 'EEEE')
  };
}

// Home page: show today tasks
app.get('/', (req, res) => {
  const dateInfo = getFormattedDate();
  res.render('index', {
    ...dateInfo,
    todayTasks: tasks.today
  });
});

// Add a new today task
app.post('/submit', (req, res) => {
  const { newTask } = req.body;
  if (newTask && newTask.trim()) {
    tasks.today.push({ text: newTask.trim() });
  }
  res.redirect('/');
});

// Delete a today task when checkbox clicked
app.post('/toggleToday', (req, res) => {
  const idx = parseInt(req.body.index, 10);
  if (!isNaN(idx) && idx >= 0 && idx < tasks.today.length) {
    tasks.today.splice(idx, 1);
  }
  res.redirect('/');
});

// Work page: show work tasks
app.get('/work', (req, res) => {
  res.render('work', {
    workTasks: tasks.work
  });
});

// Add a new work task
app.post('/submitWork', (req, res) => {
  const { newTask } = req.body;
  if (newTask && newTask.trim()) {
    tasks.work.push({ text: newTask.trim() });
  }
  res.redirect('/work');
});

// Delete a work task when checkbox clicked
app.post('/toggleWork', (req, res) => {
  const idx = parseInt(req.body.index, 10);
  if (!isNaN(idx) && idx >= 0 && idx < tasks.work.length) {
    tasks.work.splice(idx, 1);
  }
  res.redirect('/work');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
