import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from "../supabase";

export default function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setAllowed(false)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Error reading profile role:', profileError.message)
        return setAllowed(false)
      }

      const normalizedRole = (profile?.role || '').toString().trim().toLowerCase()
      setAllowed(normalizedRole === 'admin')
    }
    check()
  }, [])

  if (allowed === null) return null
  if (!allowed) return <Navigate to="/login" />

  return children
}