require('dotenv').config(); // Load .env from current dir (server)
const { User } = require('./src/models'); // Path relative to server folder

async function fixUsers() {
    try {
        console.log('Connecting to database...');
        // 1. Create or Update admin@test.com
        const [adminTest, created] = await User.findOrCreate({
            where: { email: 'admin@test.com' },
            defaults: {
                name: 'Test Admin',
                role: 'admin',
                password: 'admin123'
            }
        });

        if (!created) {
            adminTest.password = 'admin123';
            await adminTest.save();
            console.log('Updated password for admin@test.com');
        } else {
            console.log('Created user admin@test.com');
        }

        // 2. Fix admin@admin.com (if exists)
        const adminAdmin = await User.findOne({ where: { email: 'admin@admin.com' } });
        if (adminAdmin) {
            adminAdmin.password = 'password';
            await adminAdmin.save();
            console.log('Fixed password for admin@admin.com');
        }

        // 3. Fix user@user.com (if exists)
        const userUser = await User.findOne({ where: { email: 'user@user.com' } });
        if (userUser) {
            userUser.password = 'password';
            await userUser.save();
            console.log('Fixed password for user@user.com');
        }

    } catch (error) {
        console.error('Error fixing users:', error);
    } finally {
        process.exit();
    }
}

fixUsers();
