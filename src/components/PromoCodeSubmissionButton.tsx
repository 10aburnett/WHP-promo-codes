'use client'
import { useState } from 'react'
import PromoCodeSubmissionForm from './PromoCodeSubmissionForm'

interface PromoCodeSubmissionButtonProps {
  offerId: string
  whopName: string
}

export default function PromoCodeSubmissionButton({ offerId, whopName }: PromoCodeSubmissionButtonProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <section
        className="rounded-2xl border shadow-theme-promo px-6 py-6 sm:px-7 sm:py-7 transition-theme"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex flex-col gap-4 sm:gap-5 text-left">
          <div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text-color)' }}
            >
              Know a better code?
            </h3>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Help the community by submitting a promo code for {whopName}
            </p>
          </div>

          <div className="w-full flex sm:justify-start">
            <button
              onClick={() => setShowForm(true)}
              type="button"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all duration-150"
              style={{
                backgroundColor: 'var(--background-tertiary)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
              }}
            >
              Submit a promo for this offer
            </button>
          </div>
        </div>
      </section>

      {/* Submission Form Modal */}
      {showForm && (
        <PromoCodeSubmissionForm
          preselectedOfferId={offerId}
          preselectedOfferName={whopName}
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}
    </>
  )
}