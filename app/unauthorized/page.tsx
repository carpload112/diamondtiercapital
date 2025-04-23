import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 text-center sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-red-600">Unauthorized Access</h1>
      <p className="mt-4 text-xl text-gray-600">You do not have permission to access this page.</p>
      <div className="mt-8">
        <Link href="/" className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
