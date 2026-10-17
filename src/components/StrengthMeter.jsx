// Shows the strength label (Weak / Medium / Strong) and a colored bar.
// It receives the strength result from analyzePassword as "props".
function StrengthMeter({ entropy, strength }) {
  // Turn the entropy (bits) into a bar width from 0 to 100 percent.
  // We treat 100 bits as "completely full". Math.min stops it going past 100,
  // and Math.max keeps a small sliver visible so the bar never looks empty.
  const percent = Math.max(5, Math.min(entropy, 100))

  return (
    <div>
      {/* Label on the left, the label of the strength on the right.
          The class "text-weak", "text-medium" or "text-strong" picks the color
          (see index.css): red, amber or green. */}
      <div className="d-flex justify-content-between align-items-baseline">
        <span className="small fw-medium">Strength</span>
        <span className={`fw-semibold text-${strength.level}`}>{strength.label}</span>
      </div>

      {/* Bootstrap's progress bar: "progress" is the grey track,
          "progress-bar" is the colored part inside it.
          The width of the colored part comes from the percent we calculated above. */}
      <div
        className="progress mt-2"
        style={{ height: '8px' }}
        role="progressbar"
        aria-label="Password strength"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`progress-bar bar-${strength.level}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  )
}

export default StrengthMeter
