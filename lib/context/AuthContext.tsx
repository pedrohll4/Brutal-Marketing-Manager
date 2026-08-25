'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, UserAccount } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase/client';

// ── Admin hardcoded (never stored in Supabase auth - only in profiles table) ──
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
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ── Boot: restore session from localStorage ──
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('brutal_current_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.id && parsed?.role) setCurrentUser(parsed);
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const saveSession = (userProfile: UserProfile) => {
    setCurrentUser(userProfile);
    try { localStorage.setItem('brutal_current_session', JSON.stringify(userProfile)); } catch {}
  };

  const saveAccounts = (accounts: UserAccount[]) => {
    setUserAccounts(accounts);
    try { localStorage.setItem('brutal_user_accounts', JSON.stringify(accounts)); } catch {}
  };

  // ── LOGIN: hardcoded Admin first, then Supabase profiles ──
  const login = async (
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Por favor, informe seu e-mail/usuário e senha.' };
    }

    // 1. Check hardcoded admin accounts (always available)
    const hardcoded = INITIAL_USER_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === cleanId || acc.username.toLowerCase() === cleanId
    );
    if (hardcoded) {
      if (hardcoded.password !== cleanPass) {
        return { success: false, error: 'Senha incorreta. Verifique os dados digitados.' };
      }
      const profile: UserProfile = {
        id: hardcoded.id,
        email: hardcoded.email,
        username: hardcoded.username,
        fullName: hardcoded.fullName,
        role: hardcoded.role,
        avatarUrl: hardcoded.avatarUrl,
        clientId: hardcoded.clientId,
        employeeId: hardcoded.employeeId,
      };
      saveSession(profile);
      return { success: true, role: hardcoded.role };
    }

    // 2. Check locally registered accounts (fallback for offline or unsynced)
    const localAccounts = (() => {
      try {
        const saved = localStorage.getItem('brutal_user_accounts');
        return saved ? (JSON.parse(saved) as UserAccount[]) : [];
      } catch { return []; }
    })();

    const localFound = localAccounts.find(
      (acc) => acc.email.toLowerCase() === cleanId || (acc.username || '').toLowerCase() === cleanId
    );
    if (localFound) {
      if (localFound.password && localFound.password !== cleanPass) {
        return { success: false, error: 'Senha incorreta.' };
      }
      const profile: UserProfile = {
        id: localFound.id,
        email: localFound.email,
        username: localFound.username,
        fullName: localFound.fullName,
        role: localFound.role,
        avatarUrl: localFound.avatarUrl,
        clientId: localFound.clientId,
        employeeId: localFound.employeeId,
      };
      saveSession(profile);
      return { success: true, role: localFound.role };
    }

    // 3. Check Supabase profiles table (primary source for clients and employees)
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .or(`email.eq.${cleanId},username.eq.${cleanId}`)
          .maybeSingle();

        if (dbProfile) {
          if (dbProfile.initial_password && dbProfile.initial_password !== cleanPass) {
            return { success: false, error: 'Senha incorreta.' };
          }
          const profile: UserProfile = {
            id: dbProfile.id,
            email: dbProfile.email,
            username: dbProfile.username || dbProfile.email.split('@')[0],
            fullName: dbProfile.full_name,
            role: dbProfile.role as UserRole,
            avatarUrl: dbProfile.avatar_url,
            clientId: dbProfile.client_id,
            employeeId: dbProfile.employee_id,
          };
          saveSession(profile);
          return { success: true, role: dbProfile.role };
        }
      } catch {}
    }

    return {
      success: false,
      error: 'Usuário não encontrado. Solicite acesso ao Administrador.',
    };
  };

  // ── Register new user (by Admin — also syncs to Supabase) ──
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

  // ── Change password ──
  const changePassword = (newPass: string): boolean => {
    if (!currentUser || !newPass.trim()) return false;
    const updated = userAccounts.map((acc) =>
      acc.id === currentUser.id ? { ...acc, password: newPass.trim() } : acc
    );
    saveAccounts(updated);
    // Also update in Supabase profiles
    if (isSupabaseConfigured && supabase && currentUser.email) {
      Promise.resolve(
        supabase
          .from('profiles')
          .update({ initial_password: newPass.trim() })
          .eq('email', currentUser.email)
      ).catch(() => {});
    }
    return true;
  };

  const logout = async () => {
    try {
      localStorage.removeItem('brutal_current_session');
      if (isSupabaseConfigured && supabase) await supabase.auth.signOut().catch(() => {});
    } catch {}
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
