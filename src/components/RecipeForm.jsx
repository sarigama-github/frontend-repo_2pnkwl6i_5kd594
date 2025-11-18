import { useState } from 'react'

function RecipeForm({ onSubmit, loading }) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [tags, setTags] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const data = {
          title,
          summary,
          ingredients: ingredients.split('\n').filter(Boolean),
          steps: steps.split('\n').filter(Boolean),
          image_url: imageUrl || undefined,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        }
        onSubmit?.(data)
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Summary</label>
        <input value={summary} onChange={(e) => setSummary(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ingredients (one per line)</label>
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 h-40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Steps (one per line)</label>
          <textarea value={steps} onChange={(e) => setSteps(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 h-40" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
        </div>
      </div>
      <button disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
        {loading ? 'Saving...' : 'Publish Recipe'}
      </button>
    </form>
  )
}

export default RecipeForm
