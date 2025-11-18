import { Helmet } from 'react-helmet'

function SEO({ title, description, image = '/cover.jpg', url = '/' }) {
  const fullTitle = title ? `${title} — Recipe Haven` : 'Recipe Haven — Easy Recipes, Tips, and Ideas'
  const desc = description || 'Discover easy, delicious recipes with step-by-step instructions and cooking tips.'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={image} />
      <link rel="canonical" href={url} />
    </Helmet>
  )
}

export default SEO
