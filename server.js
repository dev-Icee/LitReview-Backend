const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });
console.log(process.env.NODE_ENV);

const DB = process.env.DB_URL;

mongoose.connect(DB).then(() => console.log('DB connection successful!'));
// , {
//   useNewUrlParser: true
// }

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
