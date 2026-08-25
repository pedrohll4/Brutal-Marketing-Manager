'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, UserAccount } from '../types';
import { mockProfiles } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../supabase/client';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-admin-1',
    username: 'admin',
    email: 'admin@brutalmarketing.com.br',
    password: 'admin',
    fullName: 'Lucas Antunes (Admin Supremo)',
    role: 'OWNER',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01',
  },
  {
    id: 'usr-emp-1',
    username: 'joao.silva',
    email: 'joao.editor@brutalmarketing.com.br',
    password: 'joao',
    fullName: 'João Silva',
    role: 'EMPLOYEE',
    employeeId: 'emp-1',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-05',
  },
  {
    id: 'usr-emp-2',
    username: 'mariana.costa',
    email: 'mariana.creative@brutalmarketing.com.br',
    password: 'mariana',
    fullName: 'Mariana Costa',
    role: 'EMPLOYEE',
    employeeId: 'emp-2',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10',
  },
  {
    id: 'usr-client-1',
    username: 'nicole.procampo',
    email: 'nicole@procampo.com.br',
    password: 'procampo',
    fullName: 'Nicole Procampo',
    role: 'CLIENT',
    clientId: 'cli-procampo',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15',
  },
];

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isClient: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isEmployee: boolean;
  isLoading: boolean;
  activeClientId?: string;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  registerUserAccount: (account: Omit<UserAccount, 'id' | 'createdAt'>) => UserAccount;
  changePassword: (newPass: string) => boolean;
  userAccounts: UserAccount[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(INITIAL_USER_ACCOUNTS);
  // STRICT: starts as null, only set if active session exists
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load registered accounts and active session from localStorage on start
  useEffect(() => {
    try {
      const savedAccounts = localStorage.getItem('brutal_user_accounts');
      if (savedAccounts) {
        const parsed = JSON.parse(savedAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge initial and custom accounts avoiding duplicates
          const merged = [...INITIAL_USER_ACCOUNTS];
          parsed.forEach((pAcc) => {
            const idx = merged.findIndex((m) => m.id === pAcc.id || m.email === pAcc.email);
            if (idx >= 0) {
              merged[idx] = pAcc;
            } else {
              merged.push(pAcc);
            }
          });
          setUserAccounts(merged);
        }
      }

      const savedSession = localStorage.getItem('brutal_current_session');
      if (savedSession) {
        const parsedUser = JSON.parse(savedSession);
        if (parsedUser && parsedUser.id && parsedUser.role) {
          setCurrentUser(parsedUser);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save accounts to localStorage
  const saveAccounts = (newAccounts: UserAccount[]) => {
    setUserAccounts(newAccounts);
    try {
      localStorage.setItem('brutal_user_accounts', JSON.stringify(newAccounts));
    } catch {
      // ignore
    }
  };

  // Save session to localStorage
  const saveSession = (userProfile: UserProfile) => {
    setCurrentUser(userProfile);
    try {
      localStorage.setItem('brutal_current_session', JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  };

  // Strict Login (Accepts E-mail OU Username with Password Verification)
  const login = async (
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Por favor, informe seu e-mail/usuário e senha.' };
    }

    // 1. Search in userAccounts (registered and initial)
    const found = userAccounts.find(
      (acc) =>
        acc.email.toLowerCase() === cleanId ||
        acc.username.toLowerCase() === cleanId
    );

    if (found) {
      // Validate password strictly
      if (found.password && found.password !== cleanPass) {
        return { success: false, error: 'Senha incorreta. Verifique os dados digitados.' };
      }

      const userProfile: UserProfile = {
        id: found.id,
        email: found.email,
        username: found.username,
        fullName: found.fullName,
        role: found.role,
        avatarUrl: found.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        clientId: found.clientId,
        employeeId: found.employeeId,
      };

      saveSession(userProfile);
      return { success: true, role: found.role };
    }

    // 2. Check Supabase profiles if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .or(`email.eq.${cleanId},username.eq.${cleanId}`)
          .single();

        if (dbProfile) {
          if (dbProfile.initial_password && dbProfile.initial_password !== cleanPass) {
            return { success: false, error: 'Senha incorreta.' };
          }

          const userProfile: UserProfile = {
            id: dbProfile.id,
            email: dbProfile.email,
            username: dbProfile.username || dbProfile.email.split('@')[0],
            fullName: dbProfile.full_name,
            role: dbProfile.role,
            avatarUrl: dbProfile.avatar_url,
            clientId: dbProfile.client_id,
            employeeId: dbProfile.employee_id,
          };

          saveSession(userProfile);
          return { success: true, role: dbProfile.role };
        }
      } catch (err) {
        // continue
      }
    }

    // Strict rejection if user does not exist
    return {
      success: false,
      error: 'Usuário ou e-mail não encontrado. Solicite acesso ao Administrador.',
    };
  };

  // Register New User (by Supreme Admin)
  const registerUserAccount = (accountData: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount => {
    const newAccount: UserAccount = {
      ...accountData,
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newAccount, ...userAccounts];
    saveAccounts(updated);
    return newAccount;
  };

  // Change Password
  const changePassword = (newPass: string): boolean => {
    if (!currentUser || !newPass.trim()) return false;
    const updated = userAccounts.map((acc) => {
      if (acc.id === currentUser.id || acc.email === currentUser.email) {
        return { ...acc, password: newPass.trim() };
      }
      return acc;
    });
    saveAccounts(updated);
    const updatedUser = { ...currentUser, password: newPass.trim() };
    saveSession(updatedUser);
    return true;
  };

  const logout = async () => {
    try {
      localStorage.removeItem('brutal_current_session');
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut().catch(() => {});
      }
    } catch {
      // ignore
    }
    setCurrentUser(null);
    window.location.href = '/login';
  };

  const role = currentUser?.role || null;
  const isOwner = role === 'OWNER';
  const isAdmin = role === 'ADMIN' || isOwner;
  const isEmployee = role === 'EMPLOYEE';
  const isClient = role === 'CLIENT';
  const activeClientId = currentUser?.clientId || undefined;

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        role,
        isClient,
        isAdmin,
        isOwner,
        isEmployee,
        isLoading,
        activeClientId,
        login,
        logout,
        registerUserAccount,
        changePassword,
        userAccounts,
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
