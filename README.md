# EntropyCheck

A password strength and breach checker. It estimates how long a password would take to crack, and checks whether it has appeared in known data breaches, without the password ever leaving your browser.

<!-- After deploying, add the live link here, for example: **Live demo:** https://your-link -->

## Features

- **Entropy-based strength score.** Calculated from the password's length and the types of characters it uses, not just a list of rules.
- **Estimated crack time.** Shown in plain language, from "Instantly" to "Billions of years or more".
- **Breach check.** Looks the password up in the [Have I Been Pwned](https://haveibeenpwned.com/Passwords) database of leaked passwords.
- **Privacy by design.** Strength is calculated locally. The breach check uses k-anonymity, so only a small fragment of a hash is ever sent.
- **Clear status feedback.** Green for strong or safe, amber for medium, red for weak or breached.

## How the breach check stays private

The full password and the full hash are never sent anywhere. The check works like this:

1. The password is hashed with SHA-1 **in the browser** (using the built-in `crypto.subtle` API).
2. Only the **first 5 characters** of the hash are sent to `https://api.pwnedpasswords.com/range/{prefix}`.
3. The service replies with every leaked hash that starts with those 5 characters, which is hundreds of entries, so it cannot tell which one is yours.
4. The rest of the hash is compared against that list **locally**, on your device.

The request also uses the `Add-Padding` header, which hides the true size of the reply for extra privacy.

## How strength is calculated

```
entropy (bits) = length x log2(pool size)
crack time     = 2^entropy / 2 / guesses per second
```

- **Pool size** is the number of possible characters per position, based on which types are used (lowercase 26, uppercase 26, digits 10, symbols 33, other characters 100).
- The crack time assumes an attacker making **10 billion guesses per second**, a fast offline attack.
- Strength levels: under 45 bits is Weak, 45 to 69 is Medium, and 70 or more is Strong.

### Limitations

Entropy assumes characters were chosen randomly. Human-made patterns such as `Password1` can score well but are guessed quickly in practice, which is why the breach check exists. Repeated characters (for example `aaaaaaaaaa`) are also over-rated. The crack time is an estimate, not a guarantee.

## Tech stack

- [React](https://react.dev/) (function components and hooks)
- [Vite](https://vite.dev/) for development and builds
- [Bootstrap 5](https://getbootstrap.com/) plus a small custom stylesheet
- [Lucide](https://lucide.dev/) icons
- Plain JavaScript and the Fetch API (no other HTTP libraries)

## Project structure

```
src/
  main.jsx                     App entry point, loads the styles
  App.jsx                      Page layout (order of the sections)
  index.css                    Custom styles on top of Bootstrap
  components/                  Interface (React components)
    Navbar.jsx
    Hero.jsx
    PasswordChecker.jsx        Input, button, and all the state
    Results.jsx
    StrengthMeter.jsx
    BreachStatus.jsx
    HowItWorks.jsx
    Footer.jsx
  utils/                       Logic (plain JavaScript, no React)
    passwordStrength.js        Entropy, crack time, strength level
    breachCheck.js             SHA-1 hashing and the Have I Been Pwned request
```

The interface and the logic are kept separate: the files in `utils` know nothing about React, and `PasswordChecker.jsx` is the only component that uses them.

## Run it locally

You need [Node.js](https://nodejs.org/) installed.

```bash
git clone https://github.com/BaderShaarawi2/EntropyCheck.git
cd EntropyCheck
npm install
npm run dev
```

Then open the address shown in the terminal (usually `http://localhost:5173`).

Other commands:

```bash
npm run build     # create a production build in the dist folder
npm run lint      # check the code for problems
```

## Credits

Breach data is provided by [Have I Been Pwned](https://haveibeenpwned.com/) (Pwned Passwords). No passwords are stored, logged, or transmitted by this app.
