// Password strength logic.
// This file has NO React in it. It is only math and plain JavaScript functions,
// so it is easy to read and easy to test on its own.

// How many guesses per second we assume an attacker can make.
// 10 billion per second is a realistic "fast offline attack" using powerful graphics cards
// against a stolen password database. Change this number to see how crack times change.
const GUESSES_PER_SECOND = 10_000_000_000

// Time units in seconds, so the crack time code below is easy to read.
const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const YEAR = 365 * DAY

// STEP A: work out the "pool size".
// The pool size is how many different characters the attacker has to consider
// for EACH position in the password. We add up one group for every
// kind of character the password uses.
export function getPoolSize(password) {
  let poolSize = 0

  // /[a-z]/.test(password) is true if the password contains at least one lowercase letter.
  if (/[a-z]/.test(password)) {
    poolSize += 26 // letters a to z
  }
  if (/[A-Z]/.test(password)) {
    poolSize += 26 // letters A to Z
  }
  if (/[0-9]/.test(password)) {
    poolSize += 10 // digits 0 to 9
  }
  // Symbols and the space character on a normal keyboard, such as ! @ # $ % and so on.
  if (/[ !-/:-@[-`{-~]/.test(password)) {
    poolSize += 33
  }
  // Anything else: accented letters, emoji, other alphabets.
  // We use a rough estimate of 100 extra possible characters for these.
  if (/[^\x20-\x7E]/.test(password)) {
    poolSize += 100
  }

  return poolSize
}

// STEP B: work out the entropy, measured in "bits".
// Formula:  entropy = length x log2(poolSize)
// Think of each bit as one coin flip. Every extra bit DOUBLES the number of guesses needed.
export function calculateEntropy(password) {
  // Array.from splits the text into real characters, so an emoji counts as 1 character
  // (a plain password.length would count it as 2).
  const length = Array.from(password).length
  const poolSize = getPoolSize(password)

  // An empty password has no entropy. Also avoids doing log2(0), which is not a number.
  if (length === 0) {
    return 0
  }

  return length * Math.log2(poolSize)
}

// STEP C: estimate how long it takes to crack, in seconds.
// With "entropy" bits there are 2^entropy possible passwords.
// On average an attacker finds the password halfway through, so we divide by 2.
export function estimateCrackSeconds(entropy) {
  if (entropy === 0) {
    return 0
  }

  const totalPossibilities = Math.pow(2, entropy)
  return totalPossibilities / 2 / GUESSES_PER_SECOND
}

// STEP D: turn a number of seconds into friendly text like "3 hours".
export function formatCrackTime(seconds) {
  if (seconds < 1) {
    return 'Instantly'
  }
  if (seconds < MINUTE) {
    return `${Math.round(seconds)} seconds`
  }
  if (seconds < HOUR) {
    return `${Math.round(seconds / MINUTE)} minutes`
  }
  if (seconds < DAY) {
    return `${Math.round(seconds / HOUR)} hours`
  }
  if (seconds < YEAR) {
    return `${Math.round(seconds / DAY)} days`
  }

  // From here on we count in years.
  const years = seconds / YEAR

  if (years < 1000) {
    return `${Math.round(years)} years`
  }
  if (years < 1_000_000) {
    return 'Thousands of years'
  }
  if (years < 1_000_000_000) {
    return 'Millions of years'
  }
  return 'Billions of years or more'
}

// STEP E: pick a strength label based on the entropy.
// "level" is a simple word we can use later to choose colors (red, amber, green).
export function getStrength(entropy) {
  if (entropy < 45) {
    return { level: 'weak', label: 'Weak' }
  }
  if (entropy < 70) {
    return { level: 'medium', label: 'Medium' }
  }
  return { level: 'strong', label: 'Strong' }
}

// This is the one function the rest of the app will call.
// It runs all the steps above and returns everything in a single object.
export function analyzePassword(password) {
  const entropy = calculateEntropy(password)
  const seconds = estimateCrackSeconds(entropy)

  return {
    length: Array.from(password).length,
    poolSize: getPoolSize(password),
    entropy: Math.round(entropy), // whole number of bits
    crackTime: formatCrackTime(seconds),
    strength: getStrength(entropy),
  }
}
