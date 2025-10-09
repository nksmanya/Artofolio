export default function Footer() {
  return (
    <footer className="mt-16 border-t border-cyan-500/30 bg-gray-900/60">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-cyan-400 font-bold text-lg flex items-center gap-2"><img src="/favicon.ico" alt="Artofolio" className="h-5 w-5" /> Artofolio</h3>
          <p className="text-gray-400 text-sm mt-2">Neon brushstrokes. Pixel dreams. One canvas for all your worlds.</p>
        </div>
        <div>
          <h4 className="text-cyan-300 font-semibold">Contact</h4>
          <ul className="text-gray-300 text-sm mt-2 space-y-1">
            <li><a className="hover:text-white" href="mailto:nksmanya@gmail.com">nksmanya@gmail.com</a></li>
            <li><a className="hover:text-white" href="https://www.linkedin.com/in/nksmanya" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a className="hover:text-white" href="https://github.com/nksmanya" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a className="hover:text-white" href="https://nksmanya.vercel.app" target="_blank" rel="noreferrer">Portfolio</a></li>
            <li><a className="hover:text-white" href="https://in.pinterest.com/nksmanya/" target="_blank" rel="noreferrer">Pinterest</a></li>
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
      <div className="text-center text-gray-500 text-xs py-4">Built with ❤️ by <a className="hover:text-white" href="https://github.com/nksmanya" target="_blank" rel="noreferrer">Manya</a> © {new Date().getFullYear()} </div>
    </footer>
  );
}


