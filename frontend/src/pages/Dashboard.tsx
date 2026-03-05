import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface DocumentPackage {
  id: string;
  createdAt: string;
  wizardVersion: string;
}

export function Dashboard() {
  const [packages, setPackages] = useState<DocumentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/documents', { credentials: 'include' })
      .then((res) => {
        if (res.status === 401) {
          setPackages([]);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.packages) setPackages(data.packages);
      })
      .catch(() => setError('Failed to load documents'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document package?')) return;
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setPackages((p) => p.filter((x) => x.id !== id));
      }
    } catch {
      setError('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center text-slate-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">My Documents</h1>
      <p className="mt-2 text-slate-600">
        Your saved advance directive packages. Create a new one with the wizard.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700"
      >
        Create new documents
      </Link>

      <div className="mt-8 space-y-4">
        {packages.length === 0 ? (
          <p className="text-slate-500">No documents yet. Complete the wizard to create your first package.</p>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-medium text-slate-900">
                  Created {new Date(pkg.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-500">Version {pkg.wizardVersion}</p>
              </div>
              <div className="flex gap-2">
                {['patientenverfuegung', 'vorsorgevollmacht', 'betreuungsverfuegung'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={async () => {
                      const res = await fetch(`/api/documents/${pkg.id}/pdf/${type}`, {
                        credentials: 'include',
                      });
                      if (res.ok) {
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${type}.pdf`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }
                    }}
                    className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300"
                  >
                    {type === 'patientenverfuegung' ? 'PV' : type === 'vorsorgevollmacht' ? 'VV' : 'BV'}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleDelete(pkg.id)}
                  className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
