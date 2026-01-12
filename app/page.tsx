import Link from 'next/link'
import { Header } from '@/components/Header'
import { Activity, Shield, Stethoscope } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-16">
        {/* Simplified Hero */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
            Health Made <span className="text-teal-600 dark:text-teal-400">Simple.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Your personal health assistant. Connect with doctors, track your medicine, and stay healthy with just one click.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link
              href="/role-select"
              className="w-full md:w-auto px-10 py-6 bg-teal-600 hover:bg-teal-700 text-white text-2xl font-bold rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              Enter Health Portal <img src="/logo.png" className="w-8 h-8 rounded-full bg-white/20" />
            </Link>
          </div>
        </div>

        {/* High Contrast Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <BigFeatureCard
            icon={<Stethoscope className="w-12 h-12" />}
            title="Talk to a Doctor"
            description="Video calls or chat. Simple and fast."
            color="blue"
          />
          <BigFeatureCard
            icon={<Activity className="w-12 h-12" />}
            title="Check Symptoms"
            description="Not feeling well? Tell us what's wrong."
            color="teal"
          />
          <BigFeatureCard
            icon={<Shield className="w-12 h-12" />}
            title="Emergency Help"
            description="One-click connection to help."
            color="red"
          />
        </div>
      </main>
    </div>
  )
}

function BigFeatureCard({ icon, title, description, color }: any) {
  const colors = {
    blue: 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100',
    teal: 'bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-100',
    red: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100',
  }

  return (
    <div className={`p-8 rounded-3xl ${colors[color]} transition-transform hover:scale-[1.02]`}>
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-lg opacity-90">{description}</p>
    </div>
  )
}
