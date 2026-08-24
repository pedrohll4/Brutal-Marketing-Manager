'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { mockProfiles } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isClient: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isEmployee: boolean;
  activeClientId?: string;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchUserRole: (newRole: UserRole, targetId?: string) => void;
  availableProfiles: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to Admin/Owner Lucas
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockProfiles[0]);

  useEffect(() => {
    // If Supabase is active, check session
    const client = supabase;
    if (isSupabaseConfigured && client) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // Fetch profile
          client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setCurrentUser({
                  id: data.id,
                  email: data.email,
                  fullName: data.full_name,
                  role: data.role,
                  avatarUrl: data.avatar_url,
                  phone: data.phone,
                });
              }
            });
        }
      });
    }
  }, []);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    // Find profile or fallback
    const found = mockProfiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // If entered random email, set as Admin or Client
    setCurrentUser({
      id: 'usr-custom',
      email,
      fullName: email.split('@')[0],
      role: 'ADMIN',
      avatarUrl: mockProfiles[0].avatarUrl,
    });
    return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    // Switch to client login view or reset to default
    setCurrentUser(mockProfiles[0]);
  };

  const switchUserRole = (newRole: UserRole, targetId?: string) => {
    const target = mockProfiles.find(p => p.role === newRole) || mockProfiles[0];
    if (newRole === 'CLIENT') {
      const clientProfile = mockProfiles.find(p => p.role === 'CLIENT');
      if (clientProfile) {
        setCurrentUser({ ...clientProfile, clientId: targetId || 'cli-procampo' });
        return;
      }
    }
    setCurrentUser(target);
  };

  const role = currentUser.role;
  const isOwner = role === 'OWNER';
  const isAdmin = role === 'ADMIN' || isOwner;
  const isEmployee = role === 'EMPLOYEE';
  const isClient = role === 'CLIENT';
  const activeClientId = currentUser.clientId || (isClient ? 'cli-procampo' : undefined);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        role,
        isClient,
        isAdmin,
        isOwner,
        isEmployee,
        activeClientId,
        login,
        logout,
        switchUserRole,
        availableProfiles: mockProfiles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
