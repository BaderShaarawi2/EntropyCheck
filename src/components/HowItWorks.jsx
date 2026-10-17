import { ScanSearch, Database, Fingerprint } from 'lucide-react'

// The three cards. Each one is an object in this list.
// Keeping the content in a list means we write the card layout only once below.
const steps = [
  {
    id: 'strength',
    icon: ScanSearch,
    title: 'Strength analysis',
    text: 'Your password is scored by how many guesses an attacker would need, based on its length and the kinds of characters it uses.',
  },
  {
    id: 'breach',
    icon: Database,
    title: 'Breach database',
    text: 'We check it against over 800 million passwords found in real data breaches, so a strong-looking password that has already leaked gets flagged.',
  },
  {
    id: 'privacy',
    icon: Fingerprint,
    title: 'Private by design',
    text: 'Strength runs entirely in your browser. The breach check only ever sends a tiny hash fragment, never your password.',
  },
]

function HowItWorks() {
  return (
    // border-top: line along the top edge
    // bg-body-tertiary: light grey, so this section stands out from the white hero above it
    // scroll-offset: leaves a gap above the section when a link jumps here
    <section id="how-it-works" className="scroll-offset border-top bg-body-tertiary py-5 px-3">
      <div className="container page-width py-md-4">
        <h2 className="text-center fw-semibold">How it works</h2>
        <p className="text-center text-secondary mt-2">
          Three checks, one result, built so your password stays yours.
        </p>

        {/* Bootstrap's grid system:
            "row" makes a row of columns, and each "col-*" class sets a column's width.
            The page is divided into 12 parts, so col-md-4 means 4/12 = one third.
            col-12 means full width, so on phones each card gets its own line.
            g-4 adds space between the columns. */}
        <div className="row g-4 mt-4">
          {/* .map() loops over the list and creates one card per item.
              "key" helps React keep track of each card. */}
          {steps.map((step) => {
            // Components must start with a capital letter in JSX,
            // so we store the icon in a capitalized variable first.
            const Icon = step.icon

            return (
              <div key={step.id} className="col-12 col-md-4">
                {/* h-100 makes every card as tall as the tallest one in the row */}
                <div
                  id={step.id === 'privacy' ? 'privacy' : undefined}
                  className="scroll-offset h-100 p-4 bg-white border rounded-4 shadow-sm"
                >
                  {/* The small rounded square behind each icon */}
                  <div className="icon-box d-flex align-items-center justify-content-center rounded-3">
                    <Icon size={20} />
                  </div>
                  <h3 className="fs-6 fw-semibold mt-4">{step.title}</h3>
                  <p className="small text-secondary mb-0 mt-2">{step.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
