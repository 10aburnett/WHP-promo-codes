'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SeoSettings, DEFAULT_SEO_SETTINGS } from '@/types/seo'
import { parseContentWithSeo, serializeContentWithSeo } from '@/lib/seo-parser'
import { SeoPanel } from '@/components/admin/SeoPanel'

type SeoTabType = 'basic' | 'social' | 'schema' | 'advanced' | 'toc'

// Custom Editor Component with HTML/WYSIWYG Toggle
function CustomEditor({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'wysiwyg' | 'html'>('wysiwyg')
  const [localHtml, setLocalHtml] = useState(value)

  // Sync external value changes
  useEffect(() => {
    setLocalHtml(value)
    if (mode === 'wysiwyg' && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value, mode])

  // Handle WYSIWYG input
  const handleWysiwygInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setLocalHtml(newContent)
      onChange(newContent)
    }
  }

  // Handle HTML textarea input
  const handleHtmlInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setLocalHtml(newContent)
    onChange(newContent)
  }

  // Switch modes and sync content
  const switchMode = (newMode: 'wysiwyg' | 'html') => {
    if (newMode === 'wysiwyg' && editorRef.current) {
      // Switching to WYSIWYG - update the contenteditable
      editorRef.current.innerHTML = localHtml
    }
    setMode(newMode)
  }

  // Toolbar actions for WYSIWYG mode
  const execCommand = (command: string, cmdValue?: string) => {
    document.execCommand(command, false, cmdValue)
    editorRef.current?.focus()
    handleWysiwygInput()
  }

  const insertHeading = (level: number) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString() || 'Heading'
      const heading = document.createElement(`h${level}`)
      heading.textContent = selectedText
      range.deleteContents()
      range.insertNode(heading)
      handleWysiwygInput()
    }
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Mode Toggle + Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
        {/* Left: Mode Toggle */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => switchMode('wysiwyg')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              mode === 'wysiwyg'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            WYSIWYG
          </button>
          <button
            type="button"
            onClick={() => switchMode('html')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              mode === 'html'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            HTML
          </button>
        </div>

        {/* Right: Formatting Toolbar (only in WYSIWYG mode) */}
        {mode === 'wysiwyg' && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => execCommand('bold')}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => execCommand('italic')}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              title="Italic"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => execCommand('underline')}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              title="Underline"
            >
              <u>U</u>
            </button>
            <span className="w-px h-4 mx-1 bg-gray-300" />
            <button
              type="button"
              onClick={() => insertHeading(2)}
              className="px-1.5 py-1 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 text-xs"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertHeading(3)}
              className="px-1.5 py-1 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 text-xs"
              title="Heading 3"
            >
              H3
            </button>
            <span className="w-px h-4 mx-1 bg-gray-300" />
            <button
              type="button"
              onClick={() => execCommand('insertUnorderedList')}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              title="Bullet List"
            >
              •
            </button>
            <button
              type="button"
              onClick={() => execCommand('insertOrderedList')}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              title="Numbered List"
            >
              1.
            </button>
            <span className="w-px h-4 mx-1 bg-gray-300" />
            <button
              type="button"
              onClick={insertLink}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              title="Insert Link"
            >
              🔗
            </button>
          </div>
        )}
      </div>

      {/* Editor Area */}
      {mode === 'wysiwyg' ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleWysiwygInput}
          className="min-h-[400px] p-4 focus:outline-none prose prose-lg max-w-none"
          style={{
            backgroundColor: '#ffffff',
            color: '#000000',
          }}
          suppressContentEditableWarning
        />
      ) : (
        <textarea
          value={localHtml}
          onChange={handleHtmlInput}
          className="w-full min-h-[400px] p-4 font-mono text-sm resize-y focus:outline-none bg-white text-gray-900"
          style={{ border: 'none' }}
          placeholder="<p>Enter your HTML content here...</p>"
          spellCheck={false}
        />
      )}
    </div>
  )
}

interface EditBlogPostPageProps {
  params: {
    id: string
  }
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '', // This is the CLEAN content without SEO block
    published: false,
    authorName: ''
  })

  // SEO state - managed separately from content
  const [seoSettings, setSeoSettings] = useState<SeoSettings>(DEFAULT_SEO_SETTINGS)
  const [seoExpanded, setSeoExpanded] = useState(true)
  const [seoTab, setSeoTab] = useState<SeoTabType>('basic')

  // Helper to update single SEO field
  const updateSeoField = <K extends keyof SeoSettings>(field: K, value: SeoSettings[K]) => {
    setSeoSettings(prev => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    fetchPost()
  }, [])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${params.id}`, { cache: 'no-store' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const json = await response.json()
      console.log('API Response:', json) // Debug log

      // Normalize response - handle {ok: true, post: {...}} or other shapes
      const post = json.post || json.data?.post || json.data || json.item || json
      if (!post || typeof post !== 'object') {
        throw new Error('Invalid API response shape')
      }

      // Never JSON.parse HTML content - use as string directly
      const rawContent = typeof post.content === 'string'
        ? post.content
        : (typeof post.content_text === 'string' ? post.content_text : '')

      // Parse SEO settings from content
      const { seoSettings: parsedSeo, content: cleanContent } = parseContentWithSeo(rawContent)
      setSeoSettings(parsedSeo)

      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: cleanContent, // Use the CLEAN content without SEO block
        published: post.published || false,
        authorName: post.authorName || ''
      })
    } catch (error) {
      console.error('Error fetching post:', error)
      alert(`Failed to load post: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Only auto-generate slug if current slug matches the generated slug from current title
      ...(prev.slug === generateSlug(prev.title) ? { slug: generateSlug(title) } : {})
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Serialize SEO settings into content before saving
      const finalContent = serializeContentWithSeo(seoSettings, formData.content)

      const response = await fetch(`/api/admin/blog/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          content: finalContent // Content WITH SEO block
        })
      })

      if (response.ok) {
        router.push('/admin/blog')
      } else {
        throw new Error('Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading post...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Blog Post</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-200 hover:text-white border border-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: /blog/{formData.slug}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Name
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Will Smith, Alex Burnett, etc."
            />
            <p className="text-xs text-gray-500 mt-1">
              The name that will appear as &quot;By [Author Name]&quot; on the blog post
            </p>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description for the blog listing page..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <CustomEditor
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use the toolbar above to format your text. What you see is exactly what will appear on the frontend.
            </p>
          </div>

          {/* SEO Settings Panel */}
          <SeoPanel
            seoSettings={seoSettings}
            onUpdate={updateSeoField}
            post={{
              title: formData.title,
              excerpt: formData.excerpt,
              slug: formData.slug,
              authorName: formData.authorName,
            }}
            expanded={seoExpanded}
            onToggleExpanded={() => setSeoExpanded(!seoExpanded)}
            activeTab={seoTab}
            onTabChange={setSeoTab}
            content={formData.content}
          />

          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
              Published
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-200 hover:text-white hover:border-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}