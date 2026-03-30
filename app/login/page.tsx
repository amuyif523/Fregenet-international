'use client'

import { useActionState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { loginAdmin } from '@/app/actions'

const initialState = { error: '' }

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: { error: string }, formData: FormData) => {
      const result = await loginAdmin(formData)
      return { error: result?.error ?? '' }
    },
    initialState
  )

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
      <form action={formAction} className="bg-white p-10 rounded-xl w-full max-w-md border border-slate-200 space-y-7">
        <div className="text-center space-y-2">
          <ShieldAlert className="w-10 h-10 text-[#1A1A1B] mx-auto mb-3" />
          <h1 className="font-headline text-3xl font-bold text-[#1A1A1B]">Fregenet Admin</h1>
          <p className="text-slate-500 text-sm">Enter your admin password to continue.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B] mb-2 block">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-white border border-slate-300 focus:border-slate-600 rounded-lg px-4 py-3 outline-none transition-all"
              placeholder="••••••••••••"
            />
          </div>
          {state?.error ? <div className="text-red-700 text-sm font-semibold bg-red-50 p-3 rounded-md border border-red-200">{state.error}</div> : null}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-[#1A1A1B] text-white font-bold uppercase text-sm tracking-wider py-4 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {pending ? 'Authenticating...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
