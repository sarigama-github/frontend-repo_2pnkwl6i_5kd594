import { Link, useLocation } from 'react-router-dom'
import { Search, Plus, BookOpen } from 'lucide-react'

function Navbar({ query, setQuery, onSearch }) {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-emerald-700">
          <BookOpen className="w-6 h-6" />
          Recipe Haven
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSearch?.()
          }}
          className="ml-auto flex items-center gap-2 w-full max-w-md"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery?.(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>
          <Link
            to="/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            New
          </Link>
        </form>
      </div>

      {/* Active route indicator */}
      <div className="max-w-6xl mx-auto px-4 pb-2 text-sm text-gray-500">
        {location.pathname === '/' ? 'Discover and search recipes' : null}
        {location.pathname.startsWith('/new') ? 'Create a new recipe' : null}
      </div>
    </header>
  )
}

export default Navbar
