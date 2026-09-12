require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

async function main() {
  const [, , name, email, password] = process.argv

  if (!name || !email || !password) {
    console.log('Usage: npm run create-admin -- "Full Name" email@example.com yourpassword')
    process.exit(1)
  }

  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI is missing — check your .env.local file.')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI)

  const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: String,
  })
  const User = mongoose.models.User || mongoose.model('User', UserSchema)

  const existing = await User.findOne({ email })
  if (existing) {
    console.log(`A user with email ${email} already exists.`)
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await User.create({ name, email, passwordHash, role: 'admin' })

  console.log(`Admin user created: ${email}`)
  console.log('You can now sign in at /admin/login')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
