"use client";

import { useRouter } from "next/navigation"
import { createContext, useContext, useState, useEffect } from "react";
import { mockUsers } from "../../lib/mock-data";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/dashboard", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status == 401) {
          router.push("/login");
          setUser(null);
          return
        }

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
          router.push("/login");
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For demo: password is always "123456"
    if (password !== "123456") {
      return false;
    }

    const foundUser = mockUsers.find((u) => u.email === email && u.ativo);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    fetch("http://localhost:8080/login/logout", {
      credentials: "include",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(router.push("/login"))
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


