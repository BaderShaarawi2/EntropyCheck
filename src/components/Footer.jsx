import { ShieldCheck } from 'lucide-react'

// The bottom strip of the page.
function Footer() {
  return (
    <footer className="border-top bg-white">
      {/* On phones the two items stack (flex-column).
          From "sm" up they sit in a row (flex-sm-row). */}
      <div className="container page-width d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 py-4">
        <div className="d-flex align-items-center gap-2">
          <ShieldCheck size={20} className="accent-text" />
          <span className="fw-semibold small">EntropyCheck</span>
        </div>
        <p className="mb-0 small text-secondary text-center">
          Breach data via Have I Been Pwned. No passwords are stored, logged, or
          transmitted.
        </p>
      </div>
    </footer>
  )
}

export default Footer
