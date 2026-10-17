import StrengthMeter from './StrengthMeter'
import BreachStatus from './BreachStatus'

// The card that appears under the password box after the user presses "Check password".
// It does no calculating itself. It only displays what it receives as props:
//   analysis - the object returned by analyzePassword (strength, entropy, crack time)
//   breach   - the object returned by checkBreach, or null while still waiting
function Results({ analysis, breach }) {
  return (
    // aria-live="polite" tells screen readers to announce changes inside this box
    <div
      className="checker-card mx-auto mt-3 p-4 text-start bg-white border rounded-4 shadow-sm"
      aria-live="polite"
    >
      <StrengthMeter entropy={analysis.entropy} strength={analysis.strength} />

      {/* Two small facts side by side. "row" and "col-6" split the width in half. */}
      <div className="row mt-4 g-3">
        <div className="col-6">
          <div className="small text-secondary">Estimated crack time</div>
          <div className="fw-semibold mt-1">{analysis.crackTime}</div>
        </div>
        <div className="col-6">
          <div className="small text-secondary">Entropy</div>
          <div className="fw-semibold mt-1">{analysis.entropy} bits</div>
        </div>
      </div>

      <p className="text-secondary mt-3 mb-0" style={{ fontSize: '0.75rem' }}>
        Estimate assumes an attacker making 10 billion guesses per second.
      </p>

      {/* A thin line to separate the strength part from the breach part */}
      <hr className="my-4" />

      <BreachStatus breach={breach} />
    </div>
  )
}

export default Results
