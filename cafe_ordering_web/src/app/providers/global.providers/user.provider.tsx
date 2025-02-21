'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { UserService } from '@/application/services/UserService';
import { ServiceResponse } from '@/application/services/ServiceResponse';
import { LoginCommand } from '@/application/httpRequests/user/LoginRequest';
import { SigninCommand } from '@/application/httpRequests/user/SigninRequest';
import { UserModel } from '@/domain/UserModels';

interface UserContextType {
  user?: UserModel;
  signIn: (command: SigninCommand) => Promise<ServiceResponse<UserModel>>;
  login: (command: LoginCommand) => Promise<ServiceResponse<UserModel>>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const userService = useMemo(() => new UserService(), []);
  const [user, setUser] = useState<UserModel | undefined>(undefined);

  // Sayfa yüklendiğinde servis üzerinden current user'ı al ve token geçerliyse state'i güncelle.
  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    if (currentUser && currentUser.isTokenValid()) {
      setUser(currentUser);
    }
  }, [userService]);

  const signIn = async (command: SigninCommand): Promise<ServiceResponse<UserModel>> => {
    const response = await userService.SignIn(command);
    if (response.isSuccess && response.data) {
      setUser(response.data);
      return ServiceResponse.success(response.data);
    } else {
      return ServiceResponse.failure(response.errorMessage!);
    }
  };

  const login = async (command: LoginCommand): Promise<ServiceResponse<UserModel>> => {
    const response = await userService.Login(command);
    if (response.isSuccess && response.data) {
      console.log("user-->",response.data!)
      setUser(response.data);
      return ServiceResponse.success(response.data);
    } else {
      return ServiceResponse.failure(response.errorMessage!);
    }
  };

  const logout = async (): Promise<void> => {
    await userService.Logout();
    setUser(undefined);
  };

  const value: UserContextType = {
    user,
    signIn,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
