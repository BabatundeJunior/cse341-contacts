const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const db = require('./db/connect'); // make sure this comes before routes
const port = process.env.PORT || 3000;

app.use(express.json());

const contactsRoutes = require('./routes/contacts');
app.use('/contacts', contactsRoutes);

db.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
});
