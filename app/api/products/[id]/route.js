import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request, { params }) {
  await connectDB()
  const product = await Product.findById(params.id)
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  return NextResponse.json(product)
}

export async function PUT(request, { params }) {
  await connectDB()
  const body = await request.json()

  const product = await Product.findByIdAndUpdate(params.id, body, {
    new: true,
    runValidators: true,
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  return NextResponse.json(product)
}

export async function DELETE(request, { params }) {
  await connectDB()
  const product = await Product.findByIdAndDelete(params.id)
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
