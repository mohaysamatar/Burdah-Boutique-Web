import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminDashboardLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-ivory">
      <Sidebar userName={session.user?.name} />
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  )
}
