import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured — add CLOUDINARY_* values to .env.local' },
        { status: 500 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'burdah-boutique' }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
        .end(buffer)
    })

    return NextResponse.json({ url: uploadResult.secure_url })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}
