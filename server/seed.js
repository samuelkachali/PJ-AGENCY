require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pj-agency';

async function run() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const defaults = [
    { name: 'Land', description: 'Plots and land for sale/rent' },
    { name: 'Shops', description: 'Shops and business premises' },
    { name: 'Houses', description: 'Houses for sale or rent' },
    { name: 'Cars', description: 'Vehicles for sale' },
    { name: 'Equipment', description: 'Machinery and equipment' }
  ];
  for (const c of defaults) {
    await Category.updateOne({ name: c.name }, { $setOnInsert: c }, { upsert: true });
  }

  const adminEmail = 'admin@pj.agency';
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({ username: 'admin', email: adminEmail, password: 'Admin123!', role: 'admin' });
    console.log('Admin user created: admin@pj.agency / Admin123!');
  } else {
    console.log('Admin user already exists');
  }

  console.log('Seed complete');
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });