import Link from "next/link";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function WriteLayout({ children }) {
  return (
    <div className="px-4 py-8">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-orange-600 hover:text-orange-700 cursor-pointer"
        >
          ← Back to Dashboard
        </Link>
      </div>
      <Suspense fallback={<BarLoader color="orange" width={"100%"} />}>
        {children}
      </Suspense>
    </div>
  );
}