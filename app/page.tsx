export const dynamic = 'force-dynamic';
import Link from 'next/link';

export default function Home(){
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-2xl font-bold mb-2">WTAC Workforce Calculator</h1>
        <p className="text-gray-600">Quickly estimate staffing needs (FTE) from a list of tasks, occurrences, and time per occurrence. Save projects and export to PDF/Excel.</p>
        <div className="mt-4 flex gap-3">
          <Link className="btn btn-primary" href="/projects">Open my projects</Link>
          <Link className="btn btn-ghost" href="/register">Create account</Link>
        </div>
      </section>
      <section className="card">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <ol className="list-decimal ml-6 space-y-1 text-gray-700">
          <li>Register and sign in.</li>
          <li>Create a project and set period, hours per FTE, utilization, and current staff.</li>
          <li>Add tasks manually or import a CSV.</li>
          <li>See results in real-time and export a report.</li>
        </ol>
      </section>
    </div>
  );
}
