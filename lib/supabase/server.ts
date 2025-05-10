// Simple server client function
export function createServerClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  }
}

// Export with a different name
export const serverSupabase = createServerClient
