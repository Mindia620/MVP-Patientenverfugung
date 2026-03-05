import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { IntroPage } from './wizard/IntroPage';
import { WizardPage } from './wizard/WizardPage';
import { Dashboard } from './pages/Dashboard';
import { LanguageToggle } from './components/LanguageToggle';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <div className="flex gap-6">
              <Link to="/" className="text-xl font-bold text-slate-900 hover:text-teal-600">
                Vorsorge Wizard
              </Link>
              <Link to="/dashboard" className="self-center text-sm text-slate-600 hover:text-teal-600">
                Dashboard
              </Link>
            </div>
            <LanguageToggle />
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/wizard/:step" element={<WizardPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <footer className="mt-12 border-t border-slate-200 bg-white py-6">
          <div className="mx-auto max-w-4xl px-4 text-center text-sm text-slate-500">
            Vorsorge Wizard — Kein Rechtsberatungsdienst. Bei Fragen konsultieren Sie einen Notar oder Rechtsanwalt.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
