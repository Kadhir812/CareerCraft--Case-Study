import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-icon">⚡</span>
          <span>CareerCrafter</span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} CareerCrafter. Built for job seekers &amp; employers.</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  )
}