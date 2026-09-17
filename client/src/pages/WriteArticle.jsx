import { useAuth } from '@clerk/clerk-react'
import {
  Edit,
  MonitorSmartphoneIcon,
  PencilRuler,
  Copy,
  X,
  Download,
} from 'lucide-react'

import jsPDF from 'jspdf'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import Markdown from 'react-markdown'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const WriteArticle = () => {
  const articleLengthOptions = [
    { length: 800, text: 'Short (500–800 words)' },
    { length: 1400, text: 'Medium (1000–1400 words)' },
    { length: 1700, text: 'Long (1500+ words)' },
  ]

  const [selectedLength, setSelectedLength] = useState(articleLengthOptions[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!input.trim()) {
      toast.error('Please enter an article topic')
      return
    }

    try {
      setLoading(true)

      const prompt = `An article about ${input} in ${selectedLength.text}`
      const token = await getToken()

      const { data } = await axios.post('/api/ai/generate-article',
        { prompt, length: selectedLength.length },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (data.success) {
        setContent(data.content)
        toast.success('Article generated successfully!')
      } else {
        toast.error(data.message || 'Failed to generate article')
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard!')
  }

const removeResponse = () => {
  setContent('')
  toast.success('Article removed.')
}

const downloadPDF = () => {
  if (!content) {
    toast.error('Nothing to download.')
    return
  }

  try {
    toast.loading('Preparing PDF...', {
      id: 'pdf-download',
    })

    const pdf = new jsPDF('p', 'mm', 'a4')

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const margin = 15
    const contentWidth = pageWidth - margin * 2

    let y = 20

    // PDF title
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(18)
    pdf.setTextColor(30, 64, 175)

    pdf.text('AI Generated Article', margin, y)

    y += 10

    // Divider
    pdf.setLineWidth(0.5)
    pdf.line(margin, y, pageWidth - margin, y)

    y += 10

    // Convert Markdown into plain readable text
    const cleanText = content
      .replace(/^#{1,6}\s*/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/^\s*[-*]\s+/gm, '• ')
      .replace(/^\s*\d+\.\s+/gm, '• ')
      .replace(/>\s?/gm, '')
      .replace(/---+/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    const lines = pdf.splitTextToSize(
      cleanText,
      contentWidth
    )

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(50, 50, 50)

    const lineHeight = 5

    lines.forEach((line) => {
      if (y + lineHeight > pageHeight - 15) {
        pdf.addPage()
        y = 20
      }

      pdf.text(line, margin, y)

      y += lineHeight
    })

    // Page numbers
    const totalPages = pdf.getNumberOfPages()

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.setTextColor(120, 120, 120)

      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 8,
        {
          align: 'right',
        }
      )
    }

    pdf.save('ai-generated-article.pdf')

    toast.success('PDF downloaded successfully!', {
      id: 'pdf-download',
    })
  } catch (error) {
    console.error('PDF generation error:', error)

    toast.error('Failed to generate PDF.', {
      id: 'pdf-download',
    })
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl shadow-lg">
              <PencilRuler className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Article Generator
            </h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg">Create professional articles with AI in seconds</p>
        </div>

        {/* Main Container - Stack on mobile, grid on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Left: Config Form */}
          <form
            className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-blue-100 p-5 md:p-8 h-fit lg:sticky lg:top-12 backdrop-blur-sm order-1 lg:order-none"
            onSubmit={onSubmitHandler}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MonitorSmartphoneIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Configuration</h2>
            </div>

            {/* Article Topic */}
            <div className="mb-6 md:mb-8">
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">
                Article Topic
              </label>
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-lg md:rounded-xl outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-blue-200"
                placeholder="The future of Artificial Intelligence"
                disabled={loading}
              />
            </div>

            {/* Article Length */}
            <div className="mb-8 md:mb-8">
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-3 md:mb-4">
                Article Length
              </label>
              <div className="flex flex-col gap-2 md:gap-3">
                {articleLengthOptions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedLength(item)}
                    disabled={loading}
                    aria-pressed={selectedLength.text === item.text}
                    className={`px-3 md:px-4 py-2.5 md:py-3 rounded-lg font-medium text-xs md:text-sm transition-all duration-200 border-2 ${
                      selectedLength.text === item.text
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold px-4 md:px-6 py-2.5 md:py-3.5 rounded-lg md:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none text-sm md:text-base"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                  <span className="sm:hidden">Wait...</span>
                </>
              ) : (
                <>
                  <PencilRuler className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Generate Article</span>
                  <span className="sm:hidden">Generate</span>
                </>
              )}
            </button>
          </form>



{/* Right: Output */}
<div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-blue-100 p-5 md:p-8 min-h-[500px] md:min-h-[600px] max-h-[700px] flex flex-col backdrop-blur-sm order-2 lg:order-none">

  {/* Output Header */}
  <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 md:pb-5 border-b border-blue-100 gap-3">

    {/* Title */}
    <div className="flex items-center gap-2 md:gap-3 min-w-0">
      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
        <Edit className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
      </div>

      <h2 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
        Generated Response
      </h2>
    </div>

    {/* Action Buttons */}
    {content && (
      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">

        {/* Copy */}
        <button
          type="button"
          onClick={handleCopy}
          className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          title="Copy to clipboard"
        >
          <Copy className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Download PDF */}
        <button
          type="button"
          onClick={downloadPDF}
          className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          title="Download PDF"
        >
          <Download className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Remove Response */}
        <button
          type="button"
          onClick={removeResponse}
          className="p-2 rounded-lg bg-pink-50 text-pink-500 border border-pink-200 hover:bg-pink-100 hover:text-pink-600 hover:scale-105 transition-all duration-200"
          title="Remove generated article"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>

      </div>
    )}
  </div>

  {/* Output Content */}
  {!content ? (

    /* Empty State */
    <div className="flex-1 flex justify-center items-center">
      <div className="text-center px-4">

        <div className="p-3 md:p-4 bg-blue-50 rounded-full w-fit mx-auto mb-3 md:mb-4">
          <Edit className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
        </div>

        <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
          Enter a topic and click
          <br className="md:hidden" />
          {" "} "Generate Article" to start
        </p>

      </div>
    </div>

  ) : (

    /* Generated Article */
    <div className="flex-1 overflow-y-auto pr-1 md:pr-2 text-gray-700 leading-relaxed text-sm md:text-base">

      <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-blue-900 prose-a:text-blue-600 prose-strong:text-blue-900">

        <Markdown
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-xl md:text-2xl font-bold text-blue-900 mt-4 md:mt-6 mb-3 md:mb-4"
                {...props}
              />
            ),

            h2: ({ node, ...props }) => (
              <h2
                className="text-lg md:text-xl font-bold text-blue-800 mt-3 md:mt-5 mb-2 md:mb-3"
                {...props}
              />
            ),

            h3: ({ node, ...props }) => (
              <h3
                className="text-base md:text-lg font-bold text-blue-700 mt-3 md:mt-4 mb-2"
                {...props}
              />
            ),

            p: ({ node, ...props }) => (
              <p
                className="text-gray-700 mb-3 md:mb-4 leading-relaxed"
                {...props}
              />
            ),

            ul: ({ node, ...props }) => (
              <ul
                className="list-disc list-inside mb-3 md:mb-4 space-y-1.5 md:space-y-2"
                {...props}
              />
            ),

            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal list-inside mb-3 md:mb-4 space-y-1.5 md:space-y-2"
                {...props}
              />
            ),

            li: ({ node, ...props }) => (
              <li
                className="text-gray-700 text-sm md:text-base"
                {...props}
              />
            ),

            strong: ({ node, ...props }) => (
              <strong
                className="font-bold text-blue-900"
                {...props}
              />
            ),

            em: ({ node, ...props }) => (
              <em
                className="italic text-gray-800"
                {...props}
              />
            ),
          }}
        >
          {content}
        </Markdown>

      </div>
    </div>
  )}

</div>
        </div>
      </div>
    </div>
  )
}

export default WriteArticle
