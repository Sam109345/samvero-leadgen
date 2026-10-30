/**
 * SAMVERO INITIAL ACCOUNT BOOTSTRAP SCRIPT (Phase 17)
 * 
 * Secure one-time bootstrap script:
 * - Super Admin: sameer.centric@gmail.com
 *   Password read exclusively from process.env.PORTAL_ADMIN_PASSWORD or process.env.INITIAL_ADMIN_PASSWORD
 *   Assigns SUPER_ADMIN role
 *   Prevents duplicate admin creation
 *   Never hardcodes or logs passwords
 * 
 * - Customer: client@gmail.com
 *   Password read from process.env.PORTAL_CUSTOMER_PASSWORD or process.env.INITIAL_CUSTOMER_PASSWORD
 *   Assigns CUSTOMER role
 *   Prevents duplicate customer creation
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = 'samvero_salt_secure_2026';
  return crypto.scryptSync(password.trim(), salt, 64).toString('hex');
}

async function bootstrap() {
  console.log('====================================================');
  console.log('🔒 SAMVERO SaaS Initial Account Bootstrap Engine');
  console.log('====================================================\n');

  const dataDir = path.join(__dirname, '..', 'data');
  const dbFile = path.join(dataDir, 'saas-db.json');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let db = {
    plans: [],
    applications: [],
    users: [],
    subscriptions: [],
    subscriptionHistory: [],
    payments: [],
    renewals: [],
    customerLeads: [],
    notifications: [],
    settings: {},
  };

  if (fs.existsSync(dbFile)) {
    try {
      db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
      if (!Array.isArray(db.users)) db.users = [];
    } catch (e) {
      console.warn('Existing db file read error, creating fresh state');
    }
  }

  // 1. Super Admin Provisioning
  const adminEmail = 'sameer.centric@gmail.com';
  const adminPassword = process.env.PORTAL_ADMIN_PASSWORD || process.env.INITIAL_ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('❌ Error: PORTAL_ADMIN_PASSWORD or INITIAL_ADMIN_PASSWORD environment variable is required.');
    console.error('Please set it in your environment or .env.local before running bootstrap.');
  } else {
    const existingAdmin = db.users.find((u) => u.email.toLowerCase() === adminEmail.toLowerCase());
    if (existingAdmin) {
      console.log(`ℹ️ Super Admin account (${adminEmail}) already exists. Duplicate creation prevented.`);
      if (existingAdmin.role !== 'super_admin') {
        existingAdmin.role = 'super_admin';
        console.log(`Updated role to super_admin.`);
      }
    } else {
      const adminUser = {
        id: 'user-sameer',
        email: adminEmail,
        name: 'Sameer (Executive Admin)',
        businessName: 'SAMVERO Technologies Inc.',
        country: 'Pakistan',
        role: 'super_admin',
        status: 'active',
        passwordHash: hashPassword(adminPassword),
        mustChangePassword: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.users.push(adminUser);
      console.log(`✅ Super Admin account (${adminEmail}) successfully provisioned with role: SUPER_ADMIN.`);
    }
  }

  // 2. Initial Customer Provisioning
  const customerEmail = 'client@gmail.com';
  const customerPassword = process.env.PORTAL_CUSTOMER_PASSWORD || process.env.INITIAL_CUSTOMER_PASSWORD;

  if (!customerPassword) {
    console.error('❌ Error: PORTAL_CUSTOMER_PASSWORD or INITIAL_CUSTOMER_PASSWORD environment variable is required.');
    console.error('Please set it in your environment or .env.local before running bootstrap.');
  } else {
    const existingCustomer = db.users.find((u) => u.email.toLowerCase() === customerEmail.toLowerCase());
    if (existingCustomer) {
      console.log(`ℹ️ Initial Customer account (${customerEmail}) already exists. Duplicate creation prevented.`);
    } else {
      const customerUser = {
        id: 'user-client-101',
        email: customerEmail,
        name: 'Alexander Wright',
        businessName: 'Apex Digital Growth LLC',
        phone: '+1 (415) 890-2341',
        whatsapp: '+14158902341',
        country: 'US',
        companyWebsite: 'https://apexdigitalgrowth.com',
        role: 'customer',
        status: 'active',
        passwordHash: hashPassword(customerPassword),
        mustChangePassword: true, // Require password change on first login per Phase 17
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.users.push(customerUser);
      console.log(`✅ Initial Customer account (${customerEmail}) successfully provisioned with role: CUSTOMER.`);
    }
  }

  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf8');
  console.log('\n✅ Bootstrap state synchronized successfully.');
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
