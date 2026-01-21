const { User } = require('./src/models');

(async () => {
  try {
    console.log('Testing user login...\n');
    
    // Cari user
    const user = await User.findOne({ where: { email: 'admin@test.com' } });
    if (user) {
      console.log('✓ User found');
      console.log('  ID:', user.id);
      console.log('  Email:', user.email);
      console.log('  Name:', user.name);
      console.log('  Password:', user.password);
      console.log('  Role:', user.role);
      
      // Test password comparison
      const inputPassword = 'password123';
      console.log('\nTesting password...');
      if (user.password === inputPassword) {
        console.log('✓ Password match!');
        console.log('\nLogin would succeed. Response:');
        console.log({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'admin'
        });
      } else {
        console.log('✗ Password mismatch');
        console.log('  Stored:', JSON.stringify(user.password));
        console.log('  Provided:', JSON.stringify(inputPassword));
      }
    } else {
      console.log('✗ User not found');
    }
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err.message);
    console.error(err);
    process.exit(1);
  }
})();
