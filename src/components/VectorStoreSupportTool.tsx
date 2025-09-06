import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as Icons from 'lucide-react'
import { solutionsSeed } from '../data/solutions'
import { MAX_FILE_SIZE_MB, ALLOWED_TYPES, clientTicket } from '../constants/constants'
import { classNames, categoryBadgeColor, confidencePillColor } from '../lib/ui'

export default function VectorStoreSupportTool() {
  // Solutions & feedback
  const [solutions] = useState(solutionsSeed)
  const [feedback, setFeedback] = useState<Record<number, boolean>>({})

  // Response panel
  const [generatedResponse, setGeneratedResponse] = useState('')
  const [showResponsePanel, setShowResponsePanel] = useState(false)

  // Tags
  const [tags, setTags] = useState<string[]>(['vector-store', 'upload-error', 'file-processing'])
  const [showTagInput, setShowTagInput] = useState(false)
  const [newTag, setNewTag] = useState('')
  const tagInputRef = useRef<HTMLInputElement | null>(null)

  // Search
  const [searchQuery, setSearchQuery] = useState('')

  // Attachments
  const [attachments, setAttachments] = useState<string[]>([...clientTicket.attachments])
  const [attachError, setAttachError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const attachmentInputRef = useRef<HTMLInputElement | null>(null)

  // Focus new tag input when shown
  useEffect(() => {
    if (showTagInput) {
      const t = setTimeout(() => tagInputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [showTagInput])

  // Allow closing the response panel with Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowResponsePanel(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Counts
  const helpfulCount = useMemo(() => Object.values(feedback).filter(v => v === true).length, [feedback])
  const unhelpfulCount = useMemo(() => Object.values(feedback).filter(v => v === false).length, [feedback])

  // Filtered solutions
  const filteredSolutions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return solutions
    return solutions.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    )
  }, [solutions, searchQuery])

  // Feedback handlers
  const handleFeedback = (id: number, isHelpful: boolean) => {
    setFeedback(prev => ({ ...prev, [id]: isHelpful }))
  }

  // Tag handlers
  const handleAddTag = () => {
    const t = newTag.trim()
    if (!t) return
    if (tags.includes(t)) { setNewTag(''); setShowTagInput(false); return }
    setTags(prev => [...prev, t]); setNewTag(''); setShowTagInput(false)
  }
  const onTagKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') handleAddTag()
    if (e.key === 'Escape') { setNewTag(''); setShowTagInput(false) }
  }
  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t))

  // Attachments
  const validateFiles = (files: File[]) => {
    for (const f of files) {
      const tooBig = f.size > MAX_FILE_SIZE_MB * 1024 * 1024
      const badType = !ALLOWED_TYPES.includes(f.type || '')
      if (tooBig) return `File ${f.name} exceeds ${MAX_FILE_SIZE_MB}MB.`
      if (badType) return `File type not allowed for ${f.name}.`
    }
    return ''
  }

  // Replace this with your real backend call
  const uploadFiles = async (files: File[]) => {
    // const form = new FormData()
    // files.forEach(f => form.append('files', f))
    // await fetch(`/api/tickets/${clientTicket.id}/attachments`, { method: 'POST', body: form })
    return new Promise(res => setTimeout(res, 400))
  }

  const handleFiles = async (files: File[]) => {
    setAttachError('')
    const err = validateFiles(files)
    if (err) { setAttachError(err); return }
    try {
      setIsUploading(true)
      await uploadFiles(files)
      setAttachments(prev => [...prev, ...files.map(f => f.name)])
    } catch (e) {
      console.error(e)
      setAttachError('Upload failed. Please try again or contact support.')
    } finally {
      setIsUploading(false)
    }
  }

  const openAttachmentPicker = () => attachmentInputRef.current?.click()
  const onAttachmentChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    handleFiles(files)
    e.target.value = '' // allow re-selecting same file
  }
  const removeAttachment = (name: string) => {
    setAttachments(prev => prev.filter(n => n !== name))
    // Optional: await fetch(`/api/tickets/${clientTicket.id}/attachments/${encodeURIComponent(name)}`, { method: 'DELETE' })
  }
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => { e.preventDefault(); setIsDragging(false) }
  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault(); setIsDragging(false)
    const files = Array.from(e.dataTransfer.files || [])
    if (!files.length) return
    handleFiles(files)
  }

  // Response generator (warm tone)
  const generateCustomerResponse = () => {
    const helpful = solutions.filter(s => feedback[s.id] === true)
    const chosen = helpful.length ? helpful : solutions.slice(0, 3)
    const bullets = chosen.map(s => `• ${s.title}: ${s.steps[0]}`).join('\n')
    const response =
`Hi there,

Thanks so much for reaching out — I know upload errors can be frustrating, and I’m here to help get this sorted quickly.

I reviewed your ticket (${clientTicket.id}) and pulled together the first steps that most often resolve this:

${bullets}

If you’re still stuck after trying these, could you share:
• the file name and size
• roughly when the last attempt failed
• any request IDs or a screenshot of the error

That extra detail helps me dig in faster and, if needed, escalate right away. Either way, I’ve got you — we’ll get this working.

Warmly,
Support`
    setGeneratedResponse(response)
    setShowResponsePanel(true)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedResponse)
      alert('Response copied to clipboard')
    } catch (e) {
      console.error(e)
      alert('Copy failed. Please select the text and copy manually.')
    }
  }

  // Map icon key string → lucide-react icon component
  const IconFor = (key?: string) => {
    const Fallback = Icons.FileText
    if (!key) return Fallback
    const I = (Icons as any)[key]
    return I ?? Fallback
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Support Ticket Analysis</h1>
          <p className="text-sm text-gray-600">
            Quickly triage vector-store issues, pick solutions, and draft a ready-to-send reply.
          </p>
        </div>
        <button
          onClick={generateCustomerResponse}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Icons.MessageCircle className="w-5 h-5" />
          Generate Response
        </button>
      </div>

      {/* Ticket Panel + Response Panel */}
      <div className={classNames('grid gap-6 transition-all', showResponsePanel ? 'lg:grid-cols-3' : 'lg:grid-cols-1')}>
        {/* Ticket card */}
        <div className={classNames('bg-white rounded-2xl border border-gray-200 p-5', showResponsePanel ? 'lg:col-span-2' : 'lg:col-span-1')}>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ticket information</h2>

          {/* Ticket details */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-gray-500">Ticket ID</p>
              <p className="font-medium text-gray-900">{clientTicket.id}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 sm:col-span-2 lg:col-span-2">
              <p className="text-gray-500">Question</p>
              <p className="font-medium text-gray-900">{clientTicket.question}</p>
            </div>

            {/* Attachments with drop zone */}
            <div className="p-3 rounded-xl bg-gray-50 lg:col-span-2">
              <p className="text-gray-500">Attachments</p>
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={classNames(
                  'mt-2 border-2 border-dashed rounded-xl p-4',
                  isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {attachments.map((name) => (
                    <span
                      key={name}
                      className="group inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs"
                    >
                      {name}
                      <button
                        onClick={() => removeAttachment(name)}
                        className="opacity-60 hover:opacity-100 transition-opacity"
                        title="Remove attachment"
                      >
                        <Icons.X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}

                  <input
                    ref={attachmentInputRef}
                    type="file"
                    multiple
                    onChange={onAttachmentChange}
                    className="hidden"
                  />
                  <button
                    onClick={openAttachmentPicker}
                    disabled={isUploading}
                    className={classNames(
                      'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border',
                      isUploading
                        ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    <Icons.Upload className="w-4 h-4" /> {isUploading ? 'Uploading…' : 'Add attachment'}
                  </button>
                </div>
                {attachError && <p className="text-xs text-red-600 mt-2">{attachError}</p>}
                <p className="text-[11px] text-gray-500 mt-2">
                  Drag & drop files here, or click "Add attachment" (max {MAX_FILE_SIZE_MB}MB; allowed: png, jpg, gif, mp4, txt, json, pdf)
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 lg:col-span-2">
              <p className="text-gray-500">Detected Issue</p>
              <p className="font-medium text-gray-900">{clientTicket.detectedIssue}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="group inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                >
                  {t}
                  <button
                    onClick={() => removeTag(t)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${t}`}
                  >
                    <Icons.X className="w-4 h-4" />
                  </button>
                </span>
              ))}

              {!showTagInput ? (
                <button
                  onClick={() => setShowTagInput(true)}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                >
                  <Icons.Plus className="w-4 h-4" /> Add tag
                </button>
              ) : (
                <input
                  ref={tagInputRef}
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={onTagKeyDown}
                  onBlur={() => setShowTagInput(false)}
                  placeholder="Type and press Enter"
                  className="px-3 py-1 rounded-full border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </div>
        </div>

        {/* Response Panel */}
        {showResponsePanel && (
          <aside className="bg-white rounded-2xl border border-gray-200 p-5 h-fit lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Generated response</h3>
              <button
                onClick={() => setShowResponsePanel(false)}
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg px-2 py-1 hover:bg-gray-100"
                aria-label="Close response panel"
                title="Close"
              >
                <Icons.X className="w-4 h-4" /> Close
              </button>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 whitespace-pre-wrap max-h-[420px] overflow-auto">
              {generatedResponse || "Click 'Generate Response' to draft a reply."}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-gray-800 px-3 py-2 border border-gray-200 hover:bg-gray-50"
              >
                <Icons.Copy className="w-4 h-4" /> Copy
              </button>
              <button
                onClick={() => alert('Pretend-sent! (wire to your ticketing system)')}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-3 py-2 hover:bg-blue-700"
              >
                <Icons.Send className="w-4 h-4" /> Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Tip: The response prefers solutions you’ve marked as helpful.</p>
          </aside>
        )}
      </div>

      {/* Search Bar under ticket card and above solutions */}
      <div className="mt-6 mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search solutions..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {filteredSolutions.map((s) => {
          const state = feedback[s.id]
          const helpfulActive = state === true
          const unhelpfulActive = state === false
          const Icon = IconFor(s.icon)

          return (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="shrink-0"><Icon className="w-5 h-5" /></div>
                  <h3 className="text-base font-semibold text-gray-900">{s.title}</h3>
                </div>
                <span className={classNames('px-2.5 py-1 text-xs rounded-full', confidencePillColor(s.confidence))}>
                  {s.confidence}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className={classNames('text-xs px-2.5 py-1 rounded-full', categoryBadgeColor(s.category))}>
                  {s.category}
                </span>
                <a href={s.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-700 hover:underline">
                  Source: {s.source}
                </a>
              </div>

              <p className="mt-3 text-sm text-gray-700">{s.description}</p>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900 mb-1">Steps to Resolve</p>
                <ol className="list-decimal pl-5 text-sm text-gray-800 space-y-1">
                  {s.steps.map((step, idx) => (<li key={idx}>{step}</li>))}
                </ol>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => handleFeedback(s.id, true)}
                  className={classNames(
                    'inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-sm',
                    helpfulActive
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : 'bg-white text-gray-800 border-gray-200 hover:bg-green-50 hover:text-green-700'
                  )}
                >
                  <Icons.CheckCircle className="w-4 h-4" /> Helpful
                </button>
                <button
                  onClick={() => handleFeedback(s.id, false)}
                  className={classNames(
                    'inline-flex items-center gap-2 rounded-xl px-3 py-2 border text-sm',
                    unhelpfulActive
                      ? 'bg-orange-100 text-orange-700 border-orange-300'
                      : 'bg-white text-gray-800 border-gray-200 hover:bg-orange-50 hover:text-orange-700'
                  )}
                >
                  <Icons.X className="w-4 h-4" /> Not helpful
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Feedback Summary */}
      <div className="mt-6">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-white border border-gray-200 px-4 py-3 shadow-sm">
          <span className="text-sm text-gray-700">
            Feedback — Helpful: <span className="font-semibold">{helpfulCount}</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-700">
            Not helpful: <span className="font-semibold">{unhelpfulCount}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
