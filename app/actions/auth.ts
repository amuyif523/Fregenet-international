'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const password = formData.get('password')
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (!adminPassword) {
    return { error: 'Server misconfiguration: ADMIN_PASSWORD is not set' }
  }
  
  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('fregenet_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 day
    })
  } else {
    return { error: 'Invalid password' }
  }
  
  // Redirect must be outside the try/catch or conditional block that returns
  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('fregenet_session')
  redirect('/login')
}
