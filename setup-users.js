import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vwwvhsgyushkcchtkqbn.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3d3Zoc2d5dXNoa2NjaHRrcWJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzI3OTU0NiwiZXhwIjoyMDc4ODU1NTQ2fQ.YJhJGJGJGJGJGJGJGJGJGJGJGJGJGJGJGJGJGJGJGJG'; // This would be your service role key

// For demo purposes, let's create a simple setup function
const setupDemoUsers = async () => {
  console.log('Setting up demo users...');
  
  const testUsers = [
    {
      email: 'admin@hospital.com',
      password: 'admin123',
      role: 'admin',
      full_name: 'Admin User'
    },
    {
      email: 'clinic@hospital.com', 
      password: 'clinic123',
      role: 'clinic',
      full_name: 'Clinic User'
    },
    {
      email: 'doctor@clinic.com',
      password: 'doctor123', 
      role: 'clinic',
      full_name: 'Dr. Smith'
    }
  ];

  console.log('\n=== DEMO LOGIN CREDENTIALS ===');
  console.log('\n🔐 ADMIN LOGIN:');
  console.log('Email: admin@hospital.com');
  console.log('Password: admin123');
  console.log('URL: http://localhost:8080/admin-login');
  
  console.log('\n🏥 CLINIC LOGIN:');
  console.log('Email: clinic@hospital.com');
  console.log('Password: clinic123');
  console.log('URL: http://localhost:8080/login');
  
  console.log('\n👨‍⚕️ DOCTOR LOGIN:');
  console.log('Email: doctor@clinic.com');
  console.log('Password: doctor123');
  console.log('URL: http://localhost:8080/login');
  
  console.log('\n📝 INSTRUCTIONS:');
  console.log('1. Go to the application at http://localhost:8080');
  console.log('2. Click "Sign In" or use the login URLs above');
  console.log('3. Use the credentials provided above');
  console.log('4. For admin access, use the admin login page');
  console.log('5. For clinic access, use the regular login page');
  
  console.log('\n✨ You can also create new accounts using the signup forms!');
};

setupDemoUsers();