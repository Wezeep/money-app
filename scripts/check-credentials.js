#!/usr/bin/env node
/**
 * Pre-start check for development credentials
 * Runs before npm dev commands to ensure credentials are set up
 */

const fs = require('fs');
const path = require('path');

const credentialsFile = path.join(__dirname, '..', 'SEED_DATA_CREDENTIALS.md');
const templateFile = path.join(__dirname, '..', 'SEED_DATA_CREDENTIALS.template.md');

if (!fs.existsSync(credentialsFile)) {
  console.log('\n');
  console.log('\x1b[33m%s\x1b[0m', '⚠️  WARNING: SEED_DATA_CREDENTIALS.md not found!');
  console.log('\x1b[33m%s\x1b[0m', '');
  console.log('You need development credentials to run the backend.');
  console.log('');
  console.log('\x1b[36m%s\x1b[0m', '📋 SETUP INSTRUCTIONS:');
  console.log('  1. Contact the repository owner for credentials');
  console.log('  2. See SEED_DATA_CREDENTIALS.template.md for details');
  console.log('  3. See ONBOARDING.md for full setup instructions');
  console.log('');
  console.log('\x1b[33m%s\x1b[0m', 'The backend may fail to seed test data without this file.');
  console.log('\n');
  
  // Don't block in CI/CD environments
  if (!process.env.CI) {
    process.exit(0); // Warning only, don't block
  }
}
