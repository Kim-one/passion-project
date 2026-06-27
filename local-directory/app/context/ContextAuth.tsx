'use client';
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});

// Automatically grab XSRF-TOKEN cookie and attach it to every request
api.interceptors.request.use((config) => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (token) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
});
interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const isLoggingOut = React.useRef(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (isLoggingOut.current) {
                setLoading(false);
                return;
            }
            try {
                // Fix 1: use relative path, not full URL (baseURL already set)
                const response = await api.get('/api/user');
                const data = response.data;

                // Fix 2: check what your Laravel actually returns —
                // if it's snake_case, use data.first_name instead
                setUser({
                    name: data.name,
                    email: data.email,
                });
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const logout = async () => {
        isLoggingOut.current = true;
        try {
            await api.get('/sanctum/csrf-cookie');
            await api.post('/logout');
            console.log('logged out successfully');
        } catch (error: any) {
            console.error("Logout error:", error.response?.status, error.response?.data);
        } finally {
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};


// 'use client';
// import React, {createContext, useContext, useState, useEffect} from "react";
// import axios from "axios";
//
// const api = axios.create({
//     baseURL: 'http://localhost:8000',
//     withCredentials: true,
//     headers: {
//         'X-Requested-With': 'XMLHttpRequest',
//         'Accept': 'application/json',
//     }
// });
//
// interface User {
//     name: string;
//     email: string;
// }
//
// interface AuthContextType {
//     user: User | null;
//     setUser: (user: User | null) => void;
//     logout: () => void;
//     loading: boolean;
// }
//
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
//
// export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         const checkAuth = async () =>{
//             try{
//                 const response = await api.get('http://localhost:8000/api/user');
//                 const data = response.data;
//
//                 setUser({
//                     name: `${data.firstName}`,
//                     email: data.email,
//                 })
//                 // setUser(response.data);
//             }catch (error){
//                 setUser(null);
//             }finally {
//                 setLoading(false);
//             }
//         };
//         checkAuth();
//     }, []);
//
//     const logout = async () => {
//         try {
//             // If hitting a route in routes/web.php, it's just '/logout'
//             await api.post('/logout');
//         } catch (error) {
//             console.error("Logout error", error);
//         } finally {
//             // Always clear state and redirect, even if backend call fails
//             setUser(null);
//             window.location.href = '/';
//         }
//     };
//
//     return (
//         <AuthContext.Provider value={{user, setUser, logout, loading}}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };
//
// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within a AuthProvider');
//     }
//     return context;
// };