// Temporary stub file to prevent build errors
// This file should not be used - all auth is now handled by MongoDB

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    signUp: () => Promise.resolve({ data: null, error: new Error('Use MongoDB auth') }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Use MongoDB auth') }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: new Error('Use MongoDB API') })
      })
    }),
    insert: () => Promise.resolve({ data: null, error: new Error('Use MongoDB API') }),
    update: () => ({
      eq: () => Promise.resolve({ error: new Error('Use MongoDB API') })
    }),
    upsert: () => Promise.resolve({ error: new Error('Use MongoDB API') })
  })
};