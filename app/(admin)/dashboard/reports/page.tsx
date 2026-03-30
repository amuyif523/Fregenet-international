'use client'

import { useActionState, useState } from 'react'
import { uploadReport } from '@/app/actions/upload'
import { UploadCloud, FileType } from 'lucide-react'

// Next.js 15 uses useActionState
const initialState = { message: '', error: '' }

export default function UploadReportPage() {
  const [state, formAction, pending] = useActionState(uploadReport, initialState)
  const [fileName, setFileName] = useState('')

  return (
    <div className="max-w-3xl space-y-12">
      <div>
        <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B] mb-2">Upload Annual Report</h1>
        <p className="text-secondary">Publish a new PDF report to the public Institutional Accountability page.</p>
      </div>

      <form action={formAction} className="bg-surface-container-lowest p-8 rounded-xl editorial-shadow space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Report Title</label>
            <input 
              name="title" 
              required 
              placeholder="e.g. 2026 Audit Report"
              className="w-full bg-surface border border-outline-variant/30 focus:border-primary rounded-lg px-4 py-3 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Fiscal Year</label>
            <input 
              name="year" 
              type="number" 
              required 
              min="2000"
              max="2100"
              defaultValue={new Date().getFullYear()}
              className="w-full bg-surface border border-outline-variant/30 focus:border-primary rounded-lg px-4 py-3 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">PDF Document</label>
          <div className="relative border-2 border-dashed border-outline-variant/50 hover:border-primary transition-colors rounded-xl p-12 text-center group cursor-pointer bg-surface">
            <input 
              type="file" 
              name="file" 
              accept=".pdf" 
              required 
              onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {fileName ? (
              <div className="flex flex-col items-center gap-4">
                <FileType className="w-12 h-12 text-primary" />
                <span className="font-bold text-[#1A1A1B]">{fileName}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <UploadCloud className="w-12 h-12 text-secondary group-hover:text-primary transition-colors" />
                <span className="text-secondary font-medium">Drag & drop your PDF here, or browse</span>
                <span className="text-xs text-outline-variant">Only .pdf files are supported</span>
              </div>
            )}
          </div>
        </div>
        
        {state?.error && <div className="text-error bg-error-container/20 p-4 rounded-lg text-sm font-bold">{state.error}</div>}
        {state?.message && <div className="text-[#34A853] bg-[#e6f4ea] p-4 rounded-lg text-sm font-bold">{state.message}</div>}

        <div className="pt-4 border-t border-outline-variant/30">
          <button 
            type="submit" 
            disabled={pending}
            className="bg-primary text-white font-bold uppercase text-sm tracking-wider px-8 py-4 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {pending ? 'Uploading...' : 'Publish Report'}
          </button>
        </div>
      </form>
    </div>
  )
}
