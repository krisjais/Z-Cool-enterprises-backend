const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');
const Admin = require('../models/Admin');

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/z-cool-tech';

function promptInput(query, isHidden = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    if (isHidden) {
      process.stdout.write(query);
      let password = '';
      const onData = (char) => {
        char = char + '';
        switch (char) {
          case '\n':
          case '\r':
          case '\u0004':
            process.stdin.removeListener('data', onData);
            break;
          default:
            process.stdout.write('*');
            password += char;
            break;
        }
      };
      process.stdin.on('data', onData);
      rl.question('', () => {
        rl.close();
        console.log('');
        resolve(password.trim());
      });
    } else {
      rl.question(query, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    }
  });
}

async function run() {
  try {
    await mongoose.connect(mongoUri);
    console.log('[SETUP] Connected to MongoDB database.');

    // 1. Resolve credentials from environment or interactive prompt
    let username = process.env.INITIAL_ADMIN_USERNAME || process.env.ADMIN_USERNAME;
    let email = process.env.INITIAL_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
    let password = process.env.INITIAL_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

    if (!username || !email || !password) {
      console.log('\n--- Z Cool Enterprises: Secure Administrator Setup ---');
      console.log('Provide administrator credentials below:\n');

      if (!username) {
        username = await promptInput('Enter Admin Username (min 3 chars): ');
      }
      if (!email) {
        email = await promptInput('Enter Admin Email address: ');
      }
      if (!password) {
        password = await promptInput('Enter Strong Admin Password (min 8 chars): ', false);
      }
    }

    // 2. Validate inputs
    if (!username || username.length < 3) {
      console.error('[VALIDATION ERROR] Username must be at least 3 characters.');
      process.exit(1);
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (!email || !emailRegex.test(email)) {
      console.error('[VALIDATION ERROR] Please provide a valid email address.');
      process.exit(1);
    }

    if (!password || password.length < 8) {
      console.error('[VALIDATION ERROR] Password must be at least 8 characters long.');
      process.exit(1);
    }

    // 3. Check for existing administrator to preserve accounts
    const existing = await Admin.findOne({
      $or: [{ username: username }, { email: email.toLowerCase() }],
    });

    if (existing) {
      console.log(`[PRESERVED] An administrator with username "${existing.username}" or email "${existing.email}" already exists.`);
      console.log('Existing accounts preserved. No changes made.');
      process.exit(0);
    }

    // 4. Create administrator (password is hashed automatically by Admin pre-save hook)
    const admin = await Admin.create({
      username: username,
      email: email.toLowerCase(),
      password: password,
      role: 'superadmin',
    });

    console.log(`\n[SUCCESS] Administrator account successfully created!`);
    console.log(`Username: ${admin.username}`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Role:     ${admin.role}`);
    console.log(`Database ID: ${admin._id}`);
    console.log('(Password has been hashed via bcrypt and stored securely. Never shared.)\n');

    process.exit(0);
  } catch (err) {
    console.error('[SETUP ERROR]', err.message);
    process.exit(1);
  }
}

run();
