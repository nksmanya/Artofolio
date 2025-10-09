export default function Footer() {
  return (
    <footer className="mt-16 border-t border-cyan-500/30 bg-gray-900/60">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-cyan-400 font-bold text-lg">Artopolio</h3>
          <p className="text-gray-400 text-sm mt-2">A cyberpunk portfolio for drawings and paintings.</p>
        </div>
        <div>
          <h4 className="text-cyan-300 font-semibold">Contact</h4>
          <ul className="text-gray-300 text-sm mt-2 space-y-1">
            <li><a className="hover:text-white" href="mailto:manya@example.com">manya@example.com</a></li>
            <li><a className="hover:text-white" href="https://www.linkedin.com/in/your-linkedin" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a className="hover:text-white" href="https://github.com/your-github" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a className="hover:text-white" href="https://your-portfolio.com" target="_blank" rel="noreferrer">Portfolio</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-cyan-300 font-semibold">Links</h4>
          <ul className="text-gray-300 text-sm mt-2 space-y-1">
            <li><a className="hover:text-white" href="#featured">Featured</a></li>
            <li><a className="hover:text-white" href="#latest">Latest</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs py-4">© {new Date().getFullYear()} Manya — All rights reserved.</div>
    </footer>
  );
}


