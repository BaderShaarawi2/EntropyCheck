import { Lock } from 'lucide-react'
import PasswordChecker from './PasswordChecker'

// The big top section: small badge, headline, short description, and the checker card.
function Hero() {
  return (
    // id="top" is the target of the logo link in the Navbar
    // text-center: center all the text inside
    // py-5: large space above and below
    // px-3: a little space on the left and right
    <section id="top" className="bg-white text-center py-5 px-3">
      {/* py-md-5 adds even more space from medium screens up */}
      <div className="container page-width py-md-5">
        {/* The small pill-shaped badge.
            d-inline-flex: only as wide as its content
            rounded-pill: fully round ends
            bg-body-tertiary: very light grey (we set this color in index.css) */}
        <div className="d-inline-flex align-items-center gap-2 rounded-pill border bg-body-tertiary px-3 py-1 small text-secondary">
          <Lock size={12} />
          Nothing you type ever leaves your device
        </div>

        {/* fw-bold: bold text. hero-title: our responsive font size from index.css. */}
        <h1 className="hero-title fw-bold mx-auto mt-4" style={{ maxWidth: '640px' }}>
          Is your password strong enough?
        </h1>

        {/* fs-5: slightly larger text. */}
        <p className="fs-5 text-secondary mx-auto mt-3" style={{ maxWidth: '580px' }}>
          Check its strength, see how long it would take to crack, and verify it hasn't
          appeared in known data breaches.
        </p>

        <PasswordChecker />
      </div>
    </section>
  )
}

export default Hero
