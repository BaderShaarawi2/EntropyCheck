import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { analyzePassword } from '../utils/passwordStrength'
import { checkBreach } from '../utils/breachCheck'
import Results from './Results'

// The password card and the results under it.
// This is the one component that holds the app's state and connects everything.
function PasswordChecker() {
  // What the user has typed so far.
  const [password, setPassword] = useState('')
  // true = show the password as plain text, false = show dots.
  const [showPassword, setShowPassword] = useState(false)
  // The strength result from Step 3. null means "no result to show yet".
  const [analysis, setAnalysis] = useState(null)
  // The breach result from Step 4. null means "not received yet".
  const [breach, setBreach] = useState(null)
  // true while we are waiting for the breach check to finish.
  const [isChecking, setIsChecking] = useState(false)

  // The button should only be usable once something has been typed,
  // and not while a check is already running.
  const isEmpty = password.length === 0

  // Runs when the user types in the input.
  function handlePasswordChange(event) {
    setPassword(event.target.value)
    // The old results belong to the old text, so we hide them.
    // This way the results on screen always match what is in the input.
    setAnalysis(null)
    setBreach(null)
  }

  // Runs when the user presses the button (or presses Enter in the input).
  // It is "async" because the breach check has to wait for the internet.
  async function handleSubmit(event) {
    // A form normally reloads the whole page when submitted. This stops that.
    event.preventDefault()

    // Do nothing if the input is empty or a check is already running.
    if (isEmpty || isChecking) {
      return
    }

    setIsChecking(true)
    setBreach(null)

    // Strength is calculated on our device, so the answer is instant.
    setAnalysis(analyzePassword(password))

    // The breach check needs the internet, so we wait for it with "await".
    // Meanwhile the page already shows the strength and a "Checking..." message.
    const breachResult = await checkBreach(password)
    setBreach(breachResult)
    setIsChecking(false)
  }

  return (
    <>
      {/* checker-card: our class that limits the width
          mx-auto: center the card horizontally
          mt-5: space above
          p-4: padding inside
          text-start: left-aligned text (the hero section centers text by default)
          bg-white border rounded-4 shadow-sm: white box, thin outline, round corners, soft shadow */}
      <div className="checker-card mx-auto mt-5 p-4 text-start bg-white border rounded-4 shadow-sm">
        {/* Using a <form> means pressing Enter in the input also submits it. */}
        <form onSubmit={handleSubmit}>
          {/* form-label: Bootstrap's style for labels. fw-medium: medium font weight. */}
          <label htmlFor="password" className="form-label small fw-medium">
            Password
          </label>

          {/* d-flex flex-column: stack input and button on phones.
              flex-sm-row: from small screens and up, put them side by side.
              gap-3: space between them. */}
          <div className="d-flex flex-column flex-sm-row gap-3">
            {/* position-relative lets us place the eye button inside the input.
                flex-grow-1 makes this box take all the space the button doesn't need. */}
            <div className="position-relative flex-grow-1">
              <input
                id="password"
                // Switch between a hidden and visible password based on state
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                // readOnly: while a check is running, the text can't be changed,
                // so the result can never belong to a different password.
                readOnly={isChecking}
                // We don't want the browser to offer to save or autofill this field.
                autoComplete="off"
                placeholder="Enter a password to check"
                // form-control: Bootstrap's standard text input style
                // pe-5: extra padding on the right (end) so text never goes under the eye icon
                className="form-control pe-5"
              />

              {/* The eye button.
                  position-absolute top-0 end-0: stick to the top-right corner of the input box
                  h-100: as tall as the input
                  border-0 bg-transparent: no border and no background, so only the icon shows */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="position-absolute top-0 end-0 h-100 border-0 bg-transparent px-3 text-secondary"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* type="submit" makes this button submit the form, which calls handleSubmit.
                disabled: the browser stops clicks while this is true.
                fw-semibold text-nowrap: bold text that never wraps onto two lines. */}
            <button
              type="submit"
              disabled={isEmpty || isChecking}
              className="btn btn-primary px-4 fw-semibold text-nowrap"
            >
              {isChecking ? 'Checking...' : 'Check password'}
            </button>
          </div>
        </form>

        {/* mb-0: remove the default space below the paragraph.
            text-secondary: soft grey-blue text. */}
        <p className="mt-3 mb-0 text-secondary" style={{ fontSize: '0.75rem' }}>
          Strength is analyzed locally in your browser. Breach checks use k-anonymity: only
          a 5-character fragment of the password's hash is ever sent, never the password
          itself.
        </p>
      </div>

      {/* Only show the results card once we have a strength result.
          "&&" means: if the left side is true, show the right side. */}
      {analysis && <Results analysis={analysis} breach={breach} />}
    </>
  )
}

export default PasswordChecker
