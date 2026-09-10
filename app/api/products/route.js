import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET() {
  await connectDB()
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 })
  return NextResponse.json(products)
}

export async function POST(request) {
  await connectDB()
  const body = await request.json()

  try {
    const product = await Product.create(body)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
