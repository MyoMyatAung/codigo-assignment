import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
    username: string
}

interface AuthState {
    isAuthenticated: boolean
    user: User | null
    login: (username: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Restore auth state on app load
    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            setUser({ username: token });
            setIsAuthenticated(true);
            setIsLoading(false);
        } else {
            setIsLoading(false)
        }
    }, [])

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        )
    }

    const login = async (username: string) => {
        // Replace with your authentication logic
        setUser({ username })
        setIsAuthenticated(true)
        // Store token for persistence
        localStorage.setItem('auth-token', username)
    }

    const logout = () => {
        console.log('Logout')
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('auth-token')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}