import { ShieldAlert, ShieldCheck, TriangleAlert } from 'lucide-react'

// Shows the result of the breach check.
// "breach" is null while we are still waiting for HIBP to answer.
// Otherwise it is the object that checkBreach returned, which has a "status":
// 'breached', 'safe' or 'error'.
function BreachStatus({ breach }) {
  // 1. Still waiting for the answer: show a small spinner.
  if (breach === null) {
    return (
      <div className="status-box status-neutral d-flex align-items-center gap-3">
        {/* spinner-border is Bootstrap's built-in loading circle */}
        <div className="spinner-border spinner-border-sm" role="status"></div>
        <span className="small">Checking known data breaches...</span>
      </div>
    )
  }

  // 2. The password was found in a breach.
  if (breach.status === 'breached') {
    return (
      <div className="status-box status-danger d-flex gap-3">
        <ShieldAlert size={20} className="flex-shrink-0 mt-1" />
        <div>
          <div className="fw-semibold">Found in data breaches</div>
          {/* toLocaleString() adds thousands separators: 52372427 becomes 52,372,427 */}
          <div className="small mt-1">
            This password has appeared {breach.count.toLocaleString()} times in known
            breaches. Attackers try leaked passwords first, so don't use it anywhere.
          </div>
        </div>
      </div>
    )
  }

  // 3. The password was NOT found in any known breach.
  if (breach.status === 'safe') {
    return (
      <div className="status-box status-safe d-flex gap-3">
        <ShieldCheck size={20} className="flex-shrink-0 mt-1" />
        <div>
          <div className="fw-semibold">Not found in known breaches</div>
          <div className="small mt-1">
            This password was not in the breach database. That does not guarantee it is
            unbreakable, so check its strength above too.
          </div>
        </div>
      </div>
    )
  }

  // 4. Anything else means the check failed (for example, no internet).
  // We show a neutral message instead of "safe", because we really don't know.
  return (
    <div className="status-box status-neutral d-flex gap-3">
      <TriangleAlert size={20} className="flex-shrink-0 mt-1" />
      <div>
        <div className="fw-semibold">Couldn't check breaches</div>
        <div className="small mt-1">{breach.message}</div>
      </div>
    </div>
  )
}

export default BreachStatus
