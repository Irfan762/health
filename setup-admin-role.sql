-- SQL Script to manually create admin user role
-- Run this in your Supabase SQL Editor if needed

-- First, you need to get the user ID from the auth.users table
-- Replace 'your-user-id-here' with the actual UUID from auth.users

-- Example: Update user role to admin
-- UPDATE public.user_roles 
-- SET role = 'admin' 
-- WHERE user_id = 'your-user-id-here';

-- Or insert new admin role if it doesn't exist
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('your-user-id-here', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- To find user IDs, run:
-- SELECT id, email FROM auth.users WHERE email LIKE '%admin%';

-- Then use the ID in the update statement above