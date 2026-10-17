import { ShieldCheck } from 'lucide-react'

// The bar at the top of the page: logo on the left, links on the right.
function Navbar() {
  return (
    // border-bottom: a thin line along the bottom edge
    // bg-white: white background
    <header className="border-bottom bg-white">
      {/* container: Bootstrap's centered box with side padding
          page-width: our class that limits the width
          d-flex: put the children in a row
          align-items-center: center them vertically
          justify-content-between: first item on the left, last item on the right
          py-3: padding above and below */}
      <nav className="container page-width d-flex align-items-center justify-content-between py-3">
        {/* Logo: an icon plus the site name.
            gap-2: small space between them. text-decoration-none: no underline on the link. */}
        <a href="#top" className="d-flex align-items-center gap-2 text-decoration-none">
          <ShieldCheck size={20} className="accent-text" />
          <span className="fw-semibold small text-body">EntropyCheck</span>
        </a>

        {/* Links. These "#..." links scroll to the element with that id. */}
        <div className="d-flex align-items-center gap-4 small">
          <a href="#how-it-works" className="soft-link">
            How it works
          </a>
          <a href="#privacy" className="soft-link">
            Privacy
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
