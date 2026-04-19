import React, { useState, useEffect, useRef, useMemo } from 'react'

const PAIRS = [
  { sym: 'EUR/USD', base: 1.0842, vol: 0.0008 },
  { sym: 'GBP/USD', base: 1.2674, vol: 0.0011 },
  { sym: 'USD/JPY', base: 149.32, vol: 0.18 },
  { sym: 'AUD/USD', base: 0.6588, vol: 0.0009 },
  { sym: 'USD/CAD', base: 1.3621, vol: 0.0007 },
  { sym: 'USD/CHF', base: 0.8804, vol: 0.0006 },
]

const HANDLES = [
  { name: 'Lisa Abramowicz', user: 'lisaabramowicz1' },
  { name: 'Robin Brooks', user: 'robin_j_brooks' },
  { name: 'Jim Bianco', user: 'biancoresearch' },
  { name: 'Mohamed El-Erian', user: 'elerianm' },
  { name: 'Holger Zschaepitz', user: 'schuldensuehner' },
  { name: 'Macro Alf', user: 'macroalf' },
  { name: 'Zerohedge', user: 'zerohedge' },
  { name: 'FXMacro', user: 'fxmacroguy' },
]

const TWEET_TEMPLATES = [
  { text: 'ECB sources hint at faster cuts than markets price. Watch {pair}.', pairs: ['EUR/USD'], sentiment: -0.7 },
  { text: 'BoE inflation print hotter than expected. {pair} bid hard on the open.', pairs: ['GBP/USD'], sentiment: 0.8 },
  { text: 'BoJ intervention chatter intensifying as {pair} pushes 150 handle.', pairs: ['USD/JPY'], sentiment: -0.6 },
  { text: 'Powell pivot? Dot plot revisions could blow {pair} wider.', pairs: ['EUR/USD', 'GBP/USD'], sentiment: 0.5 },
  { text: 'RBA on hold but hawkish tone. {pair} catching a bid.', pairs: ['AUD/USD'], sentiment: 0.6 },
  { text: 'Oil rip + risk-off = {pair} downside. CAD safe haven flows.', pairs: ['USD/CAD'], sentiment: -0.5 },
  { text: 'SNB sight deposits falling — they are quietly defending {pair}.', pairs: ['USD/CHF'], sentiment: -0.4 },
  { text: 'CFTC positioning shows record euro shorts. Squeeze risk on {pair}.', pairs: ['EUR/USD'], sentiment: 0.7 },
  { text: 'UK retail sales miss massively. {pair} bid offered into the print.', pairs: ['GBP/USD'], sentiment: -0.7 },
  { text: 'Yen carry unwind accelerating. {pair} could see 145 fast.', pairs: ['USD/JPY'], sentiment: -0.8 },
  { text: 'Iron ore breakout + China stimulus = {pair} bulls in control.', pairs: ['AUD/USD'], sentiment: 0.7 },
  { text: 'Fed minutes lean dovish. Dollar smile fading — {pair} tactical long.', pairs: ['EUR/USD', 'GBP/USD', 'AUD/USD'], sentiment: 0.6 },
  { text: 'ECB hawks pushing back hard. {pair} 1.10 in play this week.', pairs: ['EUR/USD'], sentiment: 0.7 },
  { text: 'BoC done hiking per swap markets. {pair} grinds higher.', pairs: ['USD/CAD'], sentiment: 0.5 },
  { text: 'Geopolitical risk premium flooding back. CHF + JPY safe havens bid.', pairs: ['USD/CHF', 'USD/JPY'], sentiment: -0.5 },
  { text: 'NFP whisper: 280k vs 200k consensus. {pair} setting up for fireworks.', pairs: ['EUR/USD'], sentiment: -0.6 },
]

const NEWS_TEMPLATES = [
  { source: 'Reuters', title: 'ECB\'s Lagarde signals patience on rate cuts amid sticky services inflation', pairs: ['EUR/USD'], sentiment: 0.6 },
  { source: 'Bloomberg', title: 'BoJ\'s Ueda hints intervention "in scope" if disorderly moves continue', pairs: ['USD/JPY'], sentiment: -0.7 },
  { source: 'FT', title: 'UK wage growth slows sharply, opening door to August BoE cut', pairs: ['GBP/USD'], sentiment: -0.65 },
  { source: 'WSJ', title: 'Fed officials split on timing of first cut, minutes show', pairs: ['EUR/USD', 'GBP/USD'], sentiment: 0.4 },
  { source: 'Reuters', title: 'China announces 1 trillion yuan stimulus package targeting property sector', pairs: ['AUD/USD'], sentiment: 0.7 },
  { source: 'Bloomberg', title: 'Oil surges 4% on OPEC+ extension; CAD outperforms G10', pairs: ['USD/CAD'], sentiment: -0.6 },
  { source: 'Reuters', title: 'SNB intervention data confirms aggressive franc selling in Q1', pairs: ['USD/CHF'], sentiment: 0.5 },
  { source: 'Bloomberg', title: 'US ISM services prints 54.2 vs 51.8 expected; dollar broadly bid', pairs: ['EUR/USD', 'GBP/USD', 'AUD/USD'], sentiment: -0.6 },
  { source: 'FT', title: 'Eurozone PMI surprises to upside as Germany manufacturing turns corner', pairs: ['EUR/USD'], sentiment: 0.7 },
  { source: 'Reuters', title: 'Japan FinMin: "Excessive moves observed, will respond appropriately"', pairs: ['USD/JPY'], sentiment: -0.8 },
  { source: 'Bloomberg', title: 'Aussie jobs data smashes estimates, RBA cut bets pushed to Q4', pairs: ['AUD/USD'], sentiment: 0.75 },
  { source: 'WSJ', title: 'Treasury yields tumble as core PCE undershoots; dollar on back foot', pairs: ['EUR/USD', 'GBP/USD'], sentiment: 0.6 },
]

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function timeAgo(ms) {
  const s = Math.floor((Date.now() - ms) / 1000)
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s/60)}m`
  return `${Math.floor(s/3600)}h`
}

function generateTweet() {
  const t = rand(TWEET_TEMPLATES)
  const pair = rand(t.pairs)
  const handle = rand(HANDLES)
  return {
    id: Math.random().toString(36).slice(2),
    ts: Date.now(),
    handle: handle.name,
    user: handle.user,
    text: t.text.replace('{pair}', pair),
    pairs: [pair],
    sentiment: t.sentiment + (Math.random() - 0.5) * 0.2,
  }
}

function generateNews() {
  const n = rand(NEWS_TEMPLATES)
  return {
    id: Math.random().toString(36).slice(2),
    ts: Date.now(),
    source: n.source,
    title: n.title,
    pairs: n.pairs,
    sentiment: n.sentiment + (Math.random() - 0.5) * 0.15,
  }
}

function sentimentTag(s) {
  if (s > 0.3) return { cls: 'bull', label: `▲ Bullish ${(s*100).toFixed(0)}` }
  if (s < -0.3) return { cls: 'bear', label: `▼ Bearish ${(s*100).toFixed(0)}` }
  return { cls: 'neutral', label: `• Neutral ${(s*100).toFixed(0)}` }
}

function generateInsight(pair, sentiment, sourceCount) {
  const abs = Math.abs(sentiment)
  const conf = Math.min(99, Math.round(40 + abs * 50 + sourceCount * 2))
  if (abs < 0.25) {
    return {
      pair, kind: 'warn', conf,
      body: `Mixed signals across ${sourceCount} sources. Sentiment is choppy with no clear directional bias. Range-bound conditions likely.`,
      action: '◇ Wait for confirmation — fade extremes',
    }
  }
  if (sentiment > 0) {
    return {
      pair, kind: 'bull', conf,
      body: `${sourceCount} sources turning constructive on ${pair}. Positioning data + macro flow favoring upside continuation in next 4–8h.`,
      action: '▲ Bias LONG — momentum trade setup forming',
    }
  }
  return {
    pair, kind: 'bear', conf,
    body: `${sourceCount} sources flagging downside catalysts on ${pair}. Risk reversal skew + flow data confirm bearish lean. Watch session lows.`,
    action: '▼ Bias SHORT — sell rallies into resistance',
  }
}

export default function App() {
  const [tweets, setTweets] = useState([])
  const [news, setNews] = useState([])
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(PAIRS.map(p => [p.sym, { price: p.base, prev: p.base, sentiment: 0 }]))
  )
  const [filter, setFilter] = useState('ALL')
  const tickRef = useRef(0)

  // Stream tweets
  useEffect(() => {
    const seedTweets = Array.from({ length: 6 }, () => {
      const t = generateTweet()
      t.ts = Date.now() - Math.random() * 180000
      return t
    })
    setTweets(seedTweets)
    const seedNews = Array.from({ length: 4 }, () => {
      const n = generateNews()
      n.ts = Date.now() - Math.random() * 300000
      return n
    })
    setNews(seedNews)

    const tweetInt = setInterval(() => {
      setTweets(prev => [generateTweet(), ...prev].slice(0, 40))
    }, 2200)

    const newsInt = setInterval(() => {
      setNews(prev => [generateNews(), ...prev].slice(0, 25))
    }, 5500)

    return () => { clearInterval(tweetInt); clearInterval(newsInt) }
  }, [])

  // Update prices based on sentiment from recent feeds
  useEffect(() => {
    const int = setInterval(() => {
      tickRef.current++
      setPrices(prev => {
        const next = { ...prev }
        for (const p of PAIRS) {
          const drift = (Math.random() - 0.5) * p.vol * 0.6
          const sentDrift = (next[p.sym].sentiment || 0) * p.vol * 0.4
          const newPrice = next[p.sym].price + drift + sentDrift
          next[p.sym] = { ...next[p.sym], prev: next[p.sym].price, price: newPrice }
        }
        return next
      })
    }, 900)
    return () => clearInterval(int)
  }, [])

  // Recompute sentiment per pair from rolling feeds
  useEffect(() => {
    setPrices(prev => {
      const next = { ...prev }
      for (const p of PAIRS) {
        const recent = [
          ...tweets.filter(t => t.pairs.includes(p.sym)).slice(0, 8),
          ...news.filter(n => n.pairs.includes(p.sym)).slice(0, 5).map(n => ({ ...n, sentiment: n.sentiment * 1.4 })),
        ]
        if (!recent.length) continue
        const avg = recent.reduce((a, x) => a + x.sentiment, 0) / recent.length
        next[p.sym] = { ...next[p.sym], sentiment: avg, sources: recent.length }
      }
      return next
    })
  }, [tweets, news])

  const insights = useMemo(() => {
    return PAIRS
      .map(p => {
        const s = prices[p.sym].sentiment || 0
        const c = prices[p.sym].sources || 0
        if (c < 2) return null
        return generateInsight(p.sym, s, c)
      })
      .filter(Boolean)
      .sort((a, b) => b.conf - a.conf)
      .slice(0, 5)
  }, [prices])

  const filteredTweets = filter === 'ALL' ? tweets : tweets.filter(t => t.pairs.includes(filter))
  const filteredNews = filter === 'ALL' ? news : news.filter(n => n.pairs.includes(filter))

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo" />
          <div>
            <div className="brand-title">FX PULSE</div>
            <div className="brand-sub">Live market sentiment • social + news fusion</div>
          </div>
        </div>
        <div className="live">
          <span className="dot" />
          LIVE • {tweets.length + news.length} signals tracked
        </div>
      </header>

      <div className="pairs">
        {PAIRS.map(p => {
          const px = prices[p.sym]
          const delta = px.price - p.base
          const pct = (delta / p.base) * 100
          const up = pct >= 0
          const sent = px.sentiment || 0
          const barWidth = Math.min(50, Math.abs(sent) * 50)
          return (
            <div className="pair" key={p.sym} onClick={() => setFilter(filter === p.sym ? 'ALL' : p.sym)} style={{ cursor: 'pointer', borderColor: filter === p.sym ? 'var(--accent)' : undefined }}>
              <div className="pair-row">
                <span className="pair-name">{p.sym}</span>
                <span className="pair-price">{px.price.toFixed(p.sym.includes('JPY') ? 2 : 4)}</span>
              </div>
              <div className="pair-meta">
                <span className={`delta ${up ? 'up' : 'down'}`}>{up ? '+' : ''}{pct.toFixed(2)}%</span>
                <span>{(px.sources || 0)} signals</span>
              </div>
              <div className="bar-wrap">
                <div className="bar-mid" />
                <div className={`bar ${sent >= 0 ? 'up' : 'down'}`} style={{ width: `${barWidth}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="controls" style={{ marginBottom: 14 }}>
        <button className={`btn ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>All Pairs</button>
        {PAIRS.map(p => (
          <button key={p.sym} className={`btn ${filter === p.sym ? 'active' : ''}`} onClick={() => setFilter(p.sym)}>{p.sym}</button>
        ))}
      </div>

      <div className="grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="panel-icon">𝕏</span> <span className="panel-title">Social Stream</span>
            </div>
            <span className="panel-count">{filteredTweets.length} tweets</span>
          </div>
          <div className="feed">
            {filteredTweets.map(t => {
              const tag = sentimentTag(t.sentiment)
              return (
                <div className="tweet" key={t.id}>
                  <div className="tweet-head">
                    <div className="avatar">{t.handle.split(' ').map(s => s[0]).join('').slice(0,2)}</div>
                    <span className="handle">{t.handle}</span>
                    <span className="username">@{t.user}</span>
                    <span className="time">{timeAgo(t.ts)}</span>
                  </div>
                  <div className="tweet-text">{t.text}</div>
                  <div className="tweet-tags">
                    {t.pairs.map(p => <span key={p} className="tag">{p}</span>)}
                    <span className={`tag ${tag.cls}`}>{tag.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div><span className="panel-icon">📰</span> <span className="panel-title">News Wire</span></div>
            <span className="panel-count">{filteredNews.length} stories</span>
          </div>
          <div className="feed">
            {filteredNews.map(n => {
              const tag = sentimentTag(n.sentiment)
              return (
                <div className="news" key={n.id}>
                  <div className="news-source">{n.source} • {timeAgo(n.ts)} ago</div>
                  <div className="news-title">{n.title}</div>
                  <div className="news-meta">
                    {n.pairs.map(p => <span key={p} className="tag">{p}</span>)}
                    <span className={`tag ${tag.cls}`}>{tag.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="panel col-insights">
          <div className="panel-head">
            <div><span className="panel-icon">⚡</span> <span className="panel-title">Actionable Insights</span></div>
            <span className="panel-count">AI synthesis</span>
          </div>
          <div className="feed">
            {insights.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 13 }}>Aggregating signals…</div>}
            {insights.map((i, idx) => (
              <div className={`insight ${i.kind}`} key={`${i.pair}-${idx}`}>
                <div className="insight-head">
                  <span className="insight-pair">{i.pair}</span>
                  <span className="insight-conf">Confidence {i.conf}%</span>
                </div>
                <div className="insight-body">{i.body}</div>
                <div className={`insight-action ${i.kind}`}>{i.action}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="footer">Simulated demo • feeds + prices + sentiment are synthetic</div>
    </div>
  )
}
