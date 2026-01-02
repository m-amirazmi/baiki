import Link from "next/link";

export default function BusinessNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-lg">Business not found</p>
      <Link
        href="http://baiki.test"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Return Home
      </Link>
    </div>
  );
}
