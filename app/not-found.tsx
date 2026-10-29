import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090b10] text-gray-100 flex flex-col items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center max-w-md w-full">
        <h2 className="text-4xl font-black text-cyan-400 mb-2">404</h2>
        <p className="text-lg font-bold text-white mb-2">Page Not Found</p>
        <p className="text-xs text-gray-400 mb-6">The page or photo you are looking for does not exist.</p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs inline-block transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

