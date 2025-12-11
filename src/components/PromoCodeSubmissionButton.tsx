'use client'
import { useState } from 'react'
import PromoCodeSubmissionForm from './PromoCodeSubmissionForm'

interface PromoCodeSubmissionButtonProps {
  offerId: string
  offerName: string
}

export default function PromoCodeSubmissionButton({ offerId, offerName }: PromoCodeSubmissionButtonProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        type="button"
        className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-150 hover:shadow-md"
        style={{
          backgroundColor: 'var(--accent-color)',
          color: 'white',
        }}
      >
        Share a code
      </button>

      {/* Submission Form Modal */}
      {showForm && (
        <PromoCodeSubmissionForm
          preselectedOfferId={offerId}
          preselectedOfferName={offerName}
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}
    </>
  )
}