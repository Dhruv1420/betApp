import { useState, useEffect } from 'react'
import { XIcon } from 'lucide-react'

export default function TermsPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasAcceptedTerms = localStorage.getItem('acceptedTerms')
    if (!hasAcceptedTerms) {
      setIsOpen(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('acceptedTerms', 'true')
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <XIcon size={24} />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
          <p className="text-gray-600 mb-4">
            Please read and accept our Terms and Conditions to continue using our service.
          </p>
          <div className="overflow-y-auto max-h-[50vh] pr-2">
            <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
            <p className="mb-4">
              By accessing and using this betting site, you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
            <h3 className="text-lg font-semibold mb-2">2. Use License</h3>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            <h3 className="text-lg font-semibold mb-2">3. Disclaimer</h3>
            <p className="mb-4">
              The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <h3 className="text-lg font-semibold mb-2">4. Limitations</h3>
            <p className="mb-4">
              In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
            </p>
            <h3 className="text-lg font-semibold mb-2">5. Revisions and Errata</h3>
            <p className="mb-4">
              The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete or current. We may make changes to the materials contained on its website at any time without notice.
            </p>
          </div>
        </div>
        <div className="bg-gray-100 px-6 py-4 rounded-b-lg flex justify-between">
          <button
            onClick={handleClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
          >
            Close
          </button>
          <button
            onClick={handleAccept}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}