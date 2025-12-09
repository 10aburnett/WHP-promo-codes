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
      <section
        className="border py-6 px-6 transition-theme"
        style={{
          borderColor: 'var(--border-color)',
          backgroundColor: 'transparent',
        }}
      >
        <div className="flex flex-col gap-4 text-left">
          <div>
            <h4
              className="text-lg font-semibold mb-1"
              style={{ color: 'var(--text-color)' }}
            >
              Know a better code?
            </h4>
            <p
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Help the community by submitting a promo code for {offerName}
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            type="button"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-opacity duration-150 hover:opacity-80"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--accent-color)',
              border: '1px solid var(--accent-color)',
            }}
          >
            Submit a promo code
          </button>
        </div>
      </section>

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