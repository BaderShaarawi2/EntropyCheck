// Breach check logic using the Have I Been Pwned (HIBP) "Pwned Passwords" API.
// Like passwordStrength.js, this file has NO React in it. It is plain JavaScript.
//
// The k-Anonymity idea, step by step:
//   1. Hash the password with SHA-1 in the browser (the password itself stays here).
//   2. Send ONLY the first 5 characters of the hash to HIBP.
//   3. HIBP replies with a list of every leaked hash that starts with those 5 characters.
//   4. We search that list ON OUR OWN DEVICE for the rest of our hash.
// The full password and the full hash are NEVER sent over the network.

// The web address of the API. We add the 5-character prefix to the end of it.
const API_URL = 'https://api.pwnedpasswords.com/range/'

// STEP 1: turn a password into a SHA-1 hash, written as 40 uppercase hex characters.
// This function is "async" because the browser's hashing tool works in the background
// and gives its answer later. We use "await" to wait for that answer.
export async function sha1Hash(password) {
  // The hashing tool works with bytes (numbers), not with text,
  // so TextEncoder converts the text into bytes first.
  const bytes = new TextEncoder().encode(password)

  // crypto.subtle.digest is built into the browser. Nothing is downloaded or sent anywhere.
  // It returns the hash as raw bytes.
  const hashBuffer = await crypto.subtle.digest('SHA-1', bytes)

  // Turn the raw bytes into a normal text string:
  // 1. Array.from(new Uint8Array(...)) gives us a list of numbers (0 to 255)
  // 2. .toString(16) writes each number in hexadecimal (like "5b" or "a0")
  // 3. .padStart(2, '0') makes sure every number takes exactly 2 characters ("a" becomes "0a")
  // 4. .join('') glues them together, and .toUpperCase() matches the format HIBP uses
  const hashBytes = Array.from(new Uint8Array(hashBuffer))
  const hexParts = hashBytes.map((byte) => byte.toString(16).padStart(2, '0'))
  return hexParts.join('').toUpperCase()
}

// STEP 2: look for our hash ending inside the list that HIBP sent back.
// HIBP's reply is plain text, one line per leaked hash, in this format:
//     0018A45C4D1DEF81644B54AB7F969B88D65:10
// The part before ":" is the hash ending (the first 5 characters are removed).
// The number after ":" is how many times that password appeared in breaches.
function findCountInResponse(responseText, suffix) {
  // Split the text into separate lines. \r?\n works for both Windows and Linux line endings.
  const lines = responseText.split(/\r?\n/)

  for (const line of lines) {
    // Split "ENDING:COUNT" into two pieces at the ":" character.
    const [lineSuffix, lineCount] = line.split(':')

    if (lineSuffix === suffix) {
      return Number(lineCount)
    }
  }

  // We went through every line and did not find a match.
  return 0
}

// The one function the rest of the app will call.
// It always returns an object with a "status" so the page knows what to show:
//   { status: 'breached', count: 123 }  - the password was found in breaches
//   { status: 'safe' }                  - not found in any known breach
//   { status: 'error', message: '...' } - something went wrong (e.g. no internet)
export async function checkBreach(password) {
  // try/catch lets us handle problems (like no internet) without crashing the page.
  // If anything inside "try" fails, JavaScript jumps to "catch".
  try {
    // Hash the password, then split the hash into two parts.
    const hash = await sha1Hash(password)
    const prefix = hash.slice(0, 5) // first 5 characters: the ONLY part we send
    const suffix = hash.slice(5) // remaining 35 characters: stays on our device

    // THE FETCH CALL. fetch(url, options) asks a web address for data.
    // It returns a "Response" object, and we "await" it because the internet takes time.
    const response = await fetch(API_URL + prefix, {
      // "Add-Padding" asks HIBP to add fake extra lines to the answer.
      // This hides the true size of the answer, which makes the request even more private.
      headers: { 'Add-Padding': 'true' },
    })

    // fetch only throws an error when the connection itself fails.
    // A reply like "503 Service Unavailable" still arrives as a normal response,
    // so we check response.ok (true for successful replies) ourselves.
    if (!response.ok) {
      return { status: 'error', message: `Breach service returned an error (${response.status}).` }
    }

    // .text() reads the body of the reply as plain text.
    const responseText = await response.text()
    const count = findCountInResponse(responseText, suffix)

    // The fake padding lines have a count of 0, so a real match is always more than 0.
    if (count > 0) {
      return { status: 'breached', count }
    }
    return { status: 'safe' }
  } catch {
    // This runs if fetch fails completely (no internet, blocked connection, and so on).
    // We don't need the details of the error, so we write "catch" without a variable.
    return { status: 'error', message: 'Could not reach the breach service. Check your internet connection.' }
  }
}
