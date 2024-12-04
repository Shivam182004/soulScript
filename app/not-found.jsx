import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold gradient-title mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
      Uh-oh! Looks like this page took a vacation or got lost in the internet jungle. <br/> Try double-checking the URL or head back to the homepage before we start a search party!
      </p>
      <Link href="/">
        <Button variant="journal">Return Home</Button>
      </Link>
    </div>
  );
}