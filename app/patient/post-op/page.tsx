import { Heart, AlertCircle, Phone } from 'lucide-react'

export default function PostOpPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-600" />
            Post-Op Follow-up
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Daily recovery check-in after surgery
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No active post-operative follow-ups. Check back after your surgery.
        </p>
      </div>

      <div className="fixed bottom-8 right-8">
        <button className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
          <Phone className="w-6 h-6" />
        </button>
      </div>
    </div>

  )
}
