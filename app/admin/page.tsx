import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { isMainAdmin } from "@/app/lib/authz";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!isMainAdmin(session)) {
    return (
      <div className="text-center text-gray-400">Forbidden</div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Admin</h1>
      <div className="grid gap-4">
        <Link href="/artwork/new" className="px-4 py-2 bg-cyan-600 rounded border border-cyan-400 text-sm font-bold w-max">Add New Artwork</Link>
      </div>
    </div>
  );
}


