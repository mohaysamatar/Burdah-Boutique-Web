import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

// `params` is a Promise as of Next.js 15+ (must be awaited) but was a plain
// object before that. Awaiting it works correctly either way.

export async function GET(request, { params }) {
  const { id } = await params
  await connectDB()
  const product = await Product.findById(id)
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  return NextResponse.json(product)
}

export async function PUT(request, { params }) {
  const { id } = await params
  await connectDB()
  const body = await request.json()

  const product = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  return NextResponse.json(product)
}

export async function DELETE(request, { params }) {
  const { id } = await params
  await connectDB()
  const product = await Product.findByIdAndDelete(id)
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
