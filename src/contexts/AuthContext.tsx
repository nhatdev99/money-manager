'use client'

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState,
  ReactNode 
} from 'react'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string, 
    password: string, 
    displayName: string
  ) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth, 
      (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: firebaseUser.metadata.creationTime || '',
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (
    email: string, 
    password: string, 
    displayName: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    )
    
    await updateProfile(userCredential.user, {
      displayName,
    })
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider 
      value={{ user, loading, signIn, signUp, signOut }}
    >
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
