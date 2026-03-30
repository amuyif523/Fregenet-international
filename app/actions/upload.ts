'use server'

import { prisma } from '@/lib/prisma'
import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/navigation'
import { randomUUID } from 'crypto'

export async function uploadReport(prevState: any, formData: FormData) {
  try {
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const year = parseInt(formData.get('year') as string, 10)

    if (!file || !title || isNaN(year)) {
      return { error: 'Invalid input data' }
    }

    if (file.type !== 'application/pdf') {
      return { error: 'Only PDF files are allowed' }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Ensure public/reports directory exists
    const reportsDir = path.join(process.cwd(), 'public', 'reports')
    await fs.mkdir(reportsDir, { recursive: true })
    
    // Create a safe unique filename
    const safeTitle = title.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const fileName = `${year}-${safeTitle}-${randomUUID().slice(0, 8)}.pdf`
    const filePath = path.join(reportsDir, fileName)
    
    await fs.writeFile(filePath, buffer)
    const fileUrl = `/reports/${fileName}`

    await prisma.report.create({
      data: {
        title,
        year,
        fileUrl,
      }
    })

    revalidatePath('/transparency')
    
    return { message: 'Report published successfully!' }
  } catch (error) {
    console.error('Upload Error:', error)
    return { error: 'Failed to upload report to the server.' }
  }
}
