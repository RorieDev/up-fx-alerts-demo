import React, {useState} from 'react'
import mock from './mock/universal.json'

export default function App(){
  const [site, setSite] = useState(null)
  const [alertText, setAlertText] = useState('')
  const [sent, setSent] = useState(false)

  function simulateIngest(){
    // load mock extracted data (simulates scraping + NER + sentiment)
    setSite(mock)
    setAlertText(`Trending: ${mock.hero_heading} — Impact: ${mock.sample_alert}`)
    setSent(false)
  }

  function sendWhatsApp(){
    // simulated send; in a real demo we'd call a backend API to Twilio
    setSent(true)
    alert('Simulated WhatsApp sent:\n' + alertText)
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 font-sans">
      <div className="max-w-md mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <img src={mock.logo} alt="UP logo" className="h-10" />
          <div>
            <div className="text-sm opacity-80">Universal Partners — Demo</div>
            <div className="text-xs opacity-60">iPhone-optimized PWA • FX Alerts</div>
          </div>
        </header>

        <main className="bg-white/5 rounded-2xl p-5 shadow-lg">
          <h1 className="text-2xl font-semibold mb-2">Tailored for your every move</h1>
          <p className="text-sm opacity-80 mb-4">Demo: ingest the Universal Partners site and simulate an FX-moving alert.</p>

          <button onClick={simulateIngest} className="w-full bg-[#0056d6] py-3 rounded-lg font-medium mb-3">Simulate Ingest</button>

          {site && (
            <section className="space-y-3">
              <div className="bg-white/3 p-3 rounded">
                <div className="text-sm opacity-80">Hero</div>
                <div className="font-semibold">{site.hero_heading}</div>
                <div className="text-xs opacity-70 mt-1">{site.hero_subheading}</div>
              </div>

              <div className="bg-white/3 p-3 rounded">
                <div className="text-sm opacity-80">Detected entities</div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {site.entities.map(e=> (
                    <span key={e} className="px-2 py-1 bg-white/6 rounded">{e}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={sendWhatsApp} className="flex-1 bg-[#00a86b] py-2 rounded">Send WhatsApp</button>
                <button onClick={()=>{navigator.share ? navigator.share({title:'UP Alert', text: alertText}) : alert('Share API not available')}} className="flex-1 bg-white/6 py-2 rounded">Share</button>
              </div>

              {sent && <div className="text-xs text-green-300">WhatsApp message simulated and queued.</div>}
            </section>
          )}

        </main>

        <footer className="text-xs opacity-60 text-center mt-4">Demo only — simulated ingest & messaging</footer>
      </div>
    </div>
  )
}
