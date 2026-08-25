'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, UserAccount } from '../types';
import { mockProfiles } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../supabase/client';

const INITIAL_USER_ACCOUNTS: UserAccount[] = [
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
  role: UserRole;
  isClient: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isEmployee: boolean;
  activeClientId?: string;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  registerUserAccount: (account: Omit<UserAccount, 'id' | 'createdAt'>) => UserAccount;
  changePassword: (newPass: string) => boolean;
  switchUserRole: (newRole: UserRole, targetId?: string) => void;
  availableProfiles: UserProfile[];
  userAccounts: UserAccount[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(INITIAL_USER_ACCOUNTS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockProfiles[0]);

  // Load registered accounts and active session from localStorage on start
  useEffect(() => {
    try {
      const savedAccounts = localStorage.getItem('brutal_user_accounts');
      if (savedAccounts) {
        const parsed = JSON.parse(savedAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUserAccounts(parsed);
        }
      }

      const savedSession = localStorage.getItem('brutal_current_session');
      if (savedSession) {
        const parsedUser = JSON.parse(savedSession);
        if (parsedUser && parsedUser.id) {
          setCurrentUser(parsedUser);
        }
      }
    } catch {
      // ignore
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

  useEffect(() => {
    // If Supabase is active, check session
    const client = supabase;
    if (isSupabaseConfigured && client) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                saveSession({
                  id: data.id,
                  email: data.email,
                  username: data.username || data.email.split('@')[0],
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

  // Universal Login (Accepts E-mail OU Username)
  const login = async (
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Informe seu e-mail/usuário e senha.' };
    }

    // 1. Search in userAccounts
    const found = userAccounts.find(
      (acc) =>
        acc.email.toLowerCase() === cleanId ||
        acc.username.toLowerCase() === cleanId
    );

    if (found) {
      // Validate password
      if (found.password && found.password !== cleanPass) {
        return { success: false, error: 'Senha incorreta. Verifique suas credenciais.' };
      }

      const userProfile: UserProfile = {
        id: found.id,
        email: found.email,
        username: found.username,
        fullName: found.fullName,
        role: found.role,
        avatarUrl: found.avatarUrl || mockProfiles[0].avatarUrl,
        clientId: found.clientId,
        employeeId: found.employeeId,
      };

      saveSession(userProfile);
      return { success: true, role: found.role };
    }

    // 2. Search in mockProfiles fallback
    const mockFound = mockProfiles.find(
      (p) =>
        p.email.toLowerCase() === cleanId ||
        (p.username && p.username.toLowerCase() === cleanId)
    );

    if (mockFound) {
      if (mockFound.password && mockFound.password !== cleanPass) {
        return { success: false, error: 'Senha incorreta.' };
      }
      saveSession(mockFound);
      return { success: true, role: mockFound.role };
    }

    // 3. If dynamic login (demo mode)
    const isClientGuess = cleanId.includes('cliente') || cleanId.includes('procampo');
    const isEmpGuess = cleanId.includes('editor') || cleanId.includes('joao') || cleanId.includes('funcionario');
    const assignedRole: UserRole = isClientGuess ? 'CLIENT' : isEmpGuess ? 'EMPLOYEE' : 'OWNER';

    const customProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanId.includes('@') ? cleanId : `${cleanId}@brutalmarketing.com.br`,
      username: cleanId.includes('@') ? cleanId.split('@')[0] : cleanId,
      fullName: cleanId.split('@')[0].toUpperCase(),
      role: assignedRole,
      clientId: isClientGuess ? 'cli-procampo' : undefined,
      avatarUrl: mockProfiles[0].avatarUrl,
    };

    saveSession(customProfile);
    return { success: true, role: assignedRole };
  };

  // Register New User (by Supreme Admin)
  const registerUserAccount = (accountData: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount => {
    const newAccount: UserAccount = {
      ...accountData,
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...userAccounts, newAccount];
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
        await supabase.auth.signOut();
      }
    } catch {
      // ignore
    }
    // Redirect to login page
    window.location.href = '/login';
  };

  const switchUserRole = (newRole: UserRole, targetId?: string) => {
    const target = mockProfiles.find((p) => p.role === newRole) || mockProfiles[0];
    if (newRole === 'CLIENT') {
      const clientProfile = mockProfiles.find((p) => p.role === 'CLIENT');
      if (clientProfile) {
        const clientUser = { ...clientProfile, clientId: targetId || 'cli-procampo' };
        saveSession(clientUser);
        return;
      }
    }
    saveSession(target);
  };

  const role = currentUser?.role || 'OWNER';
  const isOwner = role === 'OWNER';
  const isAdmin = role === 'ADMIN' || isOwner;
  const isEmployee = role === 'EMPLOYEE';
  const isClient = role === 'CLIENT';
  const activeClientId = currentUser?.clientId || (isClient ? 'cli-procampo' : undefined);

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
        registerUserAccount,
        changePassword,
        switchUserRole,
        availableProfiles: mockProfiles,
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
