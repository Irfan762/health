console.log('\n🚀 CREATE TEST ACCOUNTS FOR MEDIEQUIP');
console.log('=========================================\n');

console.log('❌ Getting "Invalid login credentials"?');
console.log('✅ This means you need to CREATE accounts first!\n');

console.log('📝 STEP 1: CREATE ADMIN ACCOUNT');
console.log('1. Go to: http://localhost:8080/admin-login');
console.log('2. Click "Don\'t have an account? Sign up"');
console.log('3. Use these details:');
console.log('   📧 Email: admin@test.com');
console.log('   🔑 Password: password123');
console.log('   👤 Name: Admin User');
console.log('4. Click "Create Account"\n');

console.log('📝 STEP 2: CREATE CLINIC ACCOUNT');
console.log('1. Go to: http://localhost:8080/login');
console.log('2. Click "Don\'t have an account? Sign up"');
console.log('3. Use these details:');
console.log('   📧 Email: clinic@test.com');
console.log('   🔑 Password: password123');
console.log('   👤 Name: Clinic User');
console.log('4. Click "Create Account"\n');

console.log('🔄 ALTERNATIVE: Use ANY email/password you want!');
console.log('• The system will create accounts for any valid email');
console.log('• Password must be at least 6 characters');
console.log('• Use real email format (something@something.com)\n');

console.log('⚠️  IMPORTANT:');
console.log('• ADMIN accounts: Use /admin-login page');
console.log('• CLINIC accounts: Use /login page');
console.log('• New accounts are automatically created in Supabase');
console.log('• You can create multiple test accounts\n');

console.log('🎯 QUICK TEST:');
console.log('1. Create admin account → Access admin panel');
console.log('2. Create clinic account → Browse equipment');
console.log('3. Test rental requests between accounts\n');

console.log('✨ Application URL: http://localhost:8080');
console.log('=========================================\n');