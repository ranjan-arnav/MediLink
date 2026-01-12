'use client'

import { MapPin, Phone, Navigation, Clock, Star } from 'lucide-react'

export default function HospitalsPage() {
    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
            {/* List View */}
            <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
                <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 py-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <MapPin className="h-8 w-8 text-red-500" />
                        Nearby Hospitals
                    </h1>
                    <input
                        type="text"
                        placeholder="Search hospitals..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                <HospitalCard
                    name="City General Hospital"
                    address="123 Medical Center Dr"
                    distance="0.8 miles"
                    rating={4.8}
                    openStatus="Open 24/7"
                    emergency={true}
                />
                <HospitalCard
                    name="Westside Urgent Care"
                    address="456 West Ave"
                    distance="1.2 miles"
                    rating={4.5}
                    openStatus="Closes 10 PM"
                    emergency={false}
                />
                <HospitalCard
                    name="Saint Mary's Clinic"
                    address="789 Saint Mary Blvd"
                    distance="2.5 miles"
                    rating={4.9}
                    openStatus="Open 24/7"
                    emergency={true}
                />
            </div>

            {/* Map Placeholder */}
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.4241,37.78,14.25,0,60/600x600?access_token=pk.ey')] bg-cover bg-center grayscale opacity-60 group-hover:grayscale-0 transition-all duration-500"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
                        <MapPin className="h-10 w-10 text-red-500 mx-auto mb-3 animate-bounce" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Explorable Map View</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Interactive map integration coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function HospitalCard({ name, address, distance, rating, openStatus, emergency }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col gap-3 group hover:border-blue-500 transition-colors cursor-pointer">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{address}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-yellow-600 shrink-0 fill-current" />
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">{rating}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {distance}</span>
                <span className={`flex items-center gap-1 ${openStatus.includes('24/7') ? 'text-green-600' : 'text-orange-600'
                    }`}><Clock className="w-3 h-3" /> {openStatus}</span>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                <button className="flex-1 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center gap-1">
                    <Navigation className="w-3 h-3" /> Directions
                </button>
                <button className="flex-1 py-1.5 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-400 transition-colors flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3" /> Call
                </button>
                {emergency && (
                    <div className="px-2 flex items-center justify-center bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg" title="Emergency Services Available">
                        <MapPin className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    )
}
