import { Link } from 'react-router-dom'

function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipe/${recipe.slug}`}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      {recipe.image_url ? (
        <img src={recipe.image_url} alt={recipe.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-emerald-50 to-emerald-100" />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 group-hover:text-emerald-700 line-clamp-1">{recipe.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{recipe.summary || 'A delicious recipe'}</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {(recipe.tags || []).slice(0, 3).map((t) => (
            <span key={t} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard
