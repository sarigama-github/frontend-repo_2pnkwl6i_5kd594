import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import RecipeCard from './components/RecipeCard'
import RecipeForm from './components/RecipeForm'
import AdBanner from './components/AdBanner'

function useApiBase() {
  return useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
}

function Home() {
  const base = useApiBase()
  const [q, setQ] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRecipes = async () => {
    setLoading(true)
    const url = new URL(base + '/api/recipes')
    if (q) url.searchParams.set('q', q)
    const res = await fetch(url.toString())
    const data = await res.json()
    setRecipes(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  return (
    <div>
      <Navbar query={q} setQuery={setQ} onSearch={fetchRecipes} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <AdBanner className="mb-6" />
        {loading ? (
          <p className="text-gray-500">Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No recipes yet. Create the first one!</p>
            <Link to="/new" className="inline-block mt-3 text-emerald-700 underline">Add a recipe</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function NewRecipe() {
  const base = useApiBase()
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [aiTips, setAiTips] = useState([])

  const submit = async (data) => {
    setLoading(true)
    try {
      // AI live suggestions
      try {
        const aiRes = await fetch(base + '/api/ai/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: data.title, ingredients: data.ingredients }),
        })
        if (aiRes.ok) {
          const ai = await aiRes.json()
          setAiTips(ai.tips || [])
        }
      } catch {}

      const res = await fetch(base + '/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const out = await res.json()
      if (res.ok) {
        nav('/')
      } else {
        alert(out.detail || 'Failed to save')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border">
          <h1 className="text-2xl font-bold mb-4">Publish a Recipe</h1>
          <RecipeForm onSubmit={submit} loading={loading} />
        </div>
        <aside className="md:col-span-1">
          <div className="bg-white border rounded-xl p-4">
            <h2 className="font-semibold mb-2">AI suggestions</h2>
            {aiTips.length ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {aiTips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Add ingredients to get live suggestions.</p>
            )}
          </div>
          <AdBanner className="mt-6" />
        </aside>
      </main>
    </div>
  )
}

function RecipeDetail() {
  const base = useApiBase()
  const { slug } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [name, setName] = useState('')

  const load = async () => {
    const res = await fetch(base + `/api/recipes/${slug}`)
    if (res.ok) {
      const r = await res.json()
      setRecipe(r)
      const c = await fetch(base + `/api/recipes/${r.id}/comments`)
      if (c.ok) setComments(await c.json())
    }
  }

  useEffect(() => { load() }, [slug])

  const addComment = async () => {
    if (!commentText || !name) return
    const res = await fetch(base + `/api/recipes/${recipe.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipe_id: recipe.id, name, message: commentText }),
    })
    if (res.ok) {
      setCommentText('')
      setName('')
      load()
    }
  }

  if (!recipe) return <div className="p-6">Loading...</div>

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <article className="bg-white border rounded-xl overflow-hidden">
          {recipe.image_url && <img src={recipe.image_url} alt={recipe.title} className="w-full h-72 object-cover" />}
          <div className="p-6">
            <h1 className="text-3xl font-extrabold text-gray-900">{recipe.title}</h1>
            {recipe.summary && <p className="text-gray-600 mt-2">{recipe.summary}</p>}

            {recipe.ingredients?.length ? (
              <div className="mt-6">
                <h2 className="font-semibold text-xl">Ingredients</h2>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {recipe.ingredients.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {recipe.steps?.length ? (
              <div className="mt-6">
                <h2 className="font-semibold text-xl">Steps</h2>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  {recipe.steps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              </div>
            ) : null}

            <AdBanner className="my-6" />

            <section className="mt-8">
              <h3 className="font-semibold text-lg mb-2">Comments</h3>
              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-sm text-gray-700">{c.message}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="border rounded px-3 py-2 flex-1" />
                <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" className="border rounded px-3 py-2 flex-[2]" />
                <button onClick={addComment} className="bg-emerald-600 text-white px-4 rounded">Post</button>
              </div>
            </section>
          </div>
        </article>
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new" element={<NewRecipe />} />
      <Route path="/recipe/:slug" element={<RecipeDetail />} />
    </Routes>
  )
}

export default App
