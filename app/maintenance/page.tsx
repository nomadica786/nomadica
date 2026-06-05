'use client';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Maintenance</h1>
        <p className="text-xl text-gray-600 mb-8">
          We're currently performing scheduled maintenance. We'll be back online shortly.
        </p>
        <p className="text-gray-500">
          Thank you for your patience.
        </p>
      </div>
    </div>
  );
}
