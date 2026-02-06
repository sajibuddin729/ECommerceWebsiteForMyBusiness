const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: '.env.local' });

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
        console.log('Connected to MongoDB');

        const newEmail = 'sajibuddin729@gmail.com';
        const newPassword = '**************';

        // Check if user already exists
        let user = await User.findOne({ isAdmin: true });

        if (user) {
            console.log('Found existing admin user:', user.email);
            user.email = newEmail;
            user.password = newPassword;
            await user.save();
            console.log('Admin user updated successfully');
        } else {
            console.log('No admin user found. Creating one...');
            await User.create({
                name: 'Admin',
                email: newEmail,
                password: newPassword,
                phone: '9876543210',
                isAdmin: true,
                address: {
                    street: '123 Admin St',
                    city: 'New York',
                    state: 'NY',
                    pincode: '10001',
                    country: 'USA',
                },
            });
            console.log('New Admin user created successfully');
        }

        console.log('\n=====================================');
        console.log('New Admin Credentials:');
        console.log(`Email: ${newEmail}`);
        console.log(`Password: ${newPassword}`);
        console.log('=====================================\n');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error updating admin:', error);
        if (mongoose.connection.readyState !== 0) {
            mongoose.connection.close();
        }
    }
};

updateAdmin();
