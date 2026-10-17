import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'

// App only decides the ORDER of the page sections.
// Each section lives in its own file inside src/components.
function App() {
  return (
    // min-vh-100: at least as tall as the browser window
    // bg-white: white background
    <div className="min-vh-100 bg-white">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}

export default App
