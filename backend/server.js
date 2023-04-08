const express = require('express');
const cors = require('cors');
const wordcut = require('wordcut');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

wordcut.init();

app.post('/wordcut', (req, res) => {
  const { text, skipFirstWord } = req.body;

  // Perform wordcut on the input text using the wordcut package
  let searchPartial = wordcut.cut(text).split('|').filter(word => word.trim().length > 0);
  
  // Skip the first word if requested
  if (skipFirstWord) {
    searchPartial = searchPartial.slice(1);
  }

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Return the wordcut result as a JSON object
  res.json({ searchPartial });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
