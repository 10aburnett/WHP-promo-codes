'use client';

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';

interface DealSearchResult {
  id: string;
  name: string;
  slug: string;
}

interface PromoCodeSubmissionFormProps {
  preselectedOfferId?: string; // For deal-specific submissions
  preselectedOfferName?: string; // For displaying the preselected deal name
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function PromoCodeSubmissionForm({
  preselectedOfferId,
  preselectedOfferName,
  onClose,
  onSuccess,
}: PromoCodeSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<DealSearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchController = useRef<AbortController | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    value: '',
    submitterName: '',
    submitterEmail: '',
    submitterMessage: '',
    isGeneral: !preselectedOfferId, // Default to general if no preselected course
    offerId: preselectedOfferId || '',
    customCourseName: '', // For new courses
    isNewCourse: false,
  });

  // Initialize search term with preselected course name only once
  useEffect(() => {
    if (preselectedOfferName && !searchTerm) {
      setSearchTerm(preselectedOfferName);
      setDebouncedSearchTerm(preselectedOfferName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedOfferName]);

  // Optimized debounce with shorter delay for instant feel
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Server-side search with request cancellation
  const searchWhops = useCallback(async (query: string) => {
    if (searchController.current) {
      searchController.current.abort();
    }

    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    searchController.current = controller;
    setIsSearching(true);

    try {
      const response = await fetch(
        `/api/whops/search?q=${encodeURIComponent(query)}&limit=20`,
        { signal: controller.signal }
      );

      if (response.ok && !controller.signal.aborted) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error searching courses:', error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsSearching(false);
      }
    }
  }, []);

  // Trigger search when debounced term changes
  useEffect(() => {
    if (showDropdown) {
      searchWhops(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, showDropdown, searchWhops]);

  // Get selected course name efficiently
  const selectedCourseName = useMemo(() => {
    if (formData.isNewCourse) return formData.customCourseName;
    const selectedOffer = searchResults.find((w) => w.id === formData.offerId);
    return selectedOffer?.name || '';
  }, [searchResults, formData.offerId, formData.isNewCourse, formData.customCourseName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Base validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.submitterName ||
      !formData.submitterEmail
    ) {
      alert('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.code.trim() || !formData.value.trim()) {
      alert(
        'Please provide both a promo code and discount value. If no code is required, enter "No code required" in the promo code field.'
      );
      setIsSubmitting(false);
      return;
    }

    // Course-specific validation
    if (!formData.isGeneral && !formData.offerId && !formData.isNewCourse) {
      alert(
        'Please select a course or mark it as a new course for course-specific submissions.'
      );
      setIsSubmitting(false);
      return;
    }

    if (
      !formData.isGeneral &&
      formData.isNewCourse &&
      !formData.customCourseName.trim()
    ) {
      alert('Please enter the name of the new course.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/promo-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          offerId: formData.isGeneral
            ? null
            : formData.isNewCourse
            ? null
            : formData.offerId,
          customCourseName: formData.isNewCourse
            ? formData.customCourseName
            : null,
        }),
      });

      if (response.ok) {
        setShowSuccessMessage(true);

        setTimeout(() => {
          setFormData({
            title: '',
            description: '',
            code: '',
            value: '',
            submitterName: '',
            submitterEmail: '',
            submitterMessage: '',
            isGeneral: !preselectedOfferId,
            offerId: preselectedOfferId || '',
            customCourseName: '',
            isNewCourse: false,
          });
          setSearchTerm('');
          setShowSuccessMessage(false);
          onSuccess?.();
        }, 15000);
      } else {
        throw new Error('Failed to submit promo code');
      }
    } catch (error) {
      console.error('Error submitting promo code:', error);
      alert('Failed to submit promo code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCourseSelect = useCallback((whop: DealSearchResult) => {
    setFormData((prev) => ({
      ...prev,
      offerId: whop.id,
      isNewCourse: false,
      customCourseName: '',
    }));
    setSearchTerm(whop.name);
    setShowDropdown(false);
    setSearchResults((prev) => {
      const exists = prev.find((w) => w.id === whop.id);
      return exists ? prev : [whop, ...prev];
    });
  }, []);

  const handleNewCourse = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      isNewCourse: true,
      offerId: '',
      customCourseName: searchTerm,
    }));
    setShowDropdown(false);
  }, [searchTerm]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchController.current) {
        searchController.current.abort();
      }
    };
  }, []);

  const handleCloseSuccess = () => {
    setShowSuccessMessage(false);
    onSuccess?.();
  };

  /* =====================
     SUCCESS STATE MODAL
     ===================== */
  if (showSuccessMessage) {
    return (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border shadow-theme-promo transition-theme p-8 text-center"
          style={{
            backgroundColor: 'var(--background-color)',
            borderColor: 'var(--border-color)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCloseSuccess}
            className="absolute top-4 right-4 hover:opacity-80 text-2xl font-bold"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close"
          >
            ×
          </button>
          <div className="mb-6">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(22, 163, 74, 0.12)' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: 'var(--accent-color)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--text-color)' }}
            >
              Thank You! 🎉
            </h3>
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'var(--text-color)' }}
            >
              You&apos;re awesome! Thanks for making our community better by
              sharing this promo code. Your contribution adds real value and
              helps fellow members save money.
            </p>
            <p
              className="mt-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              We&apos;ll review your submission and add it to the site once
              approved. Keep being amazing! ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =====================
     MAIN FORM MODAL
     ===================== */
  const handleOverlayClick = () => {
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-theme-promo transition-theme"
        style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-2xl font-bold"
              style={{ color: 'var(--text-color)' }}
            >
              Submit a Promo Code
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="hover:opacity-80 text-2xl font-bold"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Promo Type Selection */}
            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: 'var(--text-color)' }}
              >
                Promo Code Type
              </label>
              <div className="flex gap-4">
                <label
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'var(--text-color)' }}
                >
                  <input
                    type="radio"
                    checked={!formData.isGeneral}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, isGeneral: false }))
                    }
                  />
                  <span>Course-specific</span>
                </label>
                <label
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'var(--text-color)' }}
                >
                  <input
                    type="radio"
                    checked={formData.isGeneral}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isGeneral: true,
                        offerId: '',
                        isNewCourse: false,
                        customCourseName: '',
                      }))
                    }
                  />
                  <span>General promo</span>
                </label>
              </div>
            </div>

            {/* Course Selection (only for course-specific) */}
            {!formData.isGeneral && (
              <div className="relative">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-color)' }}
                >
                  Select Course *
                </label>

                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchTerm(value);
                      setShowDropdown(true);
                      setFormData((prev) => ({
                        ...prev,
                        offerId: '',
                        isNewCourse: false,
                        customCourseName: '',
                      }));
                    }}
                    onFocus={() => {
                      setShowDropdown(true);
                      if (searchTerm.length >= 2) {
                        searchWhops(searchTerm);
                      }
                    }}
                    placeholder="Type to search for a course..."
                    className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      backgroundColor: 'var(--background-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-color)',
                    }}
                    required={!formData.isGeneral}
                    autoComplete="off"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {isSearching ? (
                      <div
                        className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: 'var(--accent-color)' }}
                      />
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Dropdown results */}
                {showDropdown && (
                  <>
                    <div
                      className="absolute z-20 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto transition-theme border"
                      style={{
                        backgroundColor: 'var(--background-color)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      {searchTerm && searchTerm.length < 2 && (
                        <div
                          className="px-3 py-2 text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Type at least 2 characters to search...
                        </div>
                      )}

                      {isSearching && searchTerm.length >= 2 && (
                        <div className="px-3 py-2 text-sm flex items-center gap-2">
                          <div
                            className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: 'var(--accent-color)' }}
                          />
                          <span style={{ color: 'var(--text-secondary)' }}>
                            Searching courses...
                          </span>
                        </div>
                      )}

                      {!isSearching &&
                        searchTerm.length >= 2 &&
                        searchResults.length > 0 && (
                          <div>
                            {searchResults.map((whop) => (
                              <button
                                key={whop.id}
                                type="button"
                                onClick={() => handleCourseSelect(whop)}
                                className="w-full px-3 py-2 text-left text-sm transition-colors"
                                style={{ color: 'var(--text-color)' }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    'var(--background-secondary)')
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    'transparent')
                                }
                              >
                                <div className="truncate">{whop.name}</div>
                              </button>
                            ))}
                            {searchResults.length === 20 && (
                              <div className="px-3 py-1 text-xs border-t"
                                style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
                              >
                                Showing first 20 results. Be more specific to
                                narrow down.
                              </div>
                            )}
                          </div>
                        )}

                      {searchTerm && searchTerm.length > 2 && (
                        <div
                          className={
                            searchResults.length > 0 ? 'border-t' : ''
                          }
                          style={{
                            borderColor:
                              searchResults.length > 0
                                ? 'var(--border-color)'
                                : 'transparent',
                          }}
                        >
                          <button
                            type="button"
                            onClick={handleNewCourse}
                            className="w-full px-3 py-2 text-left text-sm transition-colors"
                            style={{ color: 'var(--accent-color)' }}
                          >
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                              Add &quot;{searchTerm}&quot; as new course
                            </div>
                          </button>
                        </div>
                      )}

                      {!isSearching &&
                        searchTerm.length >= 2 &&
                        searchResults.length === 0 && (
                          <div
                            className="px-3 py-2 text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            No courses found matching &quot;{searchTerm}
                            &quot;.{' '}
                            {searchTerm.length > 2 &&
                              'Use the option above to add as new course.'}
                          </div>
                        )}
                    </div>

                    {/* Click outside dropdown (but still inside modal) */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                  </>
                )}

                {(selectedCourseName || formData.isNewCourse) && (
                  <div className="mt-2 px-3 py-2 rounded-md text-sm"
                    style={{
                      backgroundColor: 'rgba(22,163,74,0.06)',
                      border: '1px solid rgba(22,163,74,0.35)',
                      color: '#166534',
                    }}
                  >
                    {formData.isNewCourse ? (
                      <span>
                        ✅ New course:{' '}
                        <strong>{formData.customCourseName}</strong>
                      </span>
                    ) : (
                      <span>
                        ✅ Selected:{' '}
                        <strong>{selectedCourseName}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-color)' }}
              >
                Promo Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. 20% Off Summer Sale, Free Month Trial"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                }}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-color)' }}
              >
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the promo code and any conditions..."
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                }}
                required
              />
            </div>

            {/* Code */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-color)' }}
              >
                Promo Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, code: e.target.value }))
                }
                placeholder='e.g. SUMMER20, FREEMONTH, or "No code required"'
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                }}
                required
              />
              <p
                className="text-xs mt-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                If no promo code is needed, enter &quot;No code required&quot;.
              </p>
            </div>

            {/* Value */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-color)' }}
              >
                Discount Value *
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, value: e.target.value }))
                }
                placeholder="e.g. 20% off, $50 off, Free trial, Free access"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                }}
                required
              />
              <p
                className="text-xs mt-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                What do users get with this promo? (discount amount, free
                trial, etc.)
              </p>
            </div>

            {/* Submitter Name */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-color)' }}
              >
                Your Name *
              </label>
              <input
                type="text"
                value={formData.submitterName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    submitterName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                }}
                required
              />
            </div>

            {/* Submitter Email */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-color)' }}
              >
                Your Email *
              </label>
              <input
                type="email"
                value={formData.submitterEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    submitterEmail: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                }}
                required
              />
            </div>

            {/* Optional Message */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-color)' }}
              >
                Additional Message
              </label>
              <textarea
                value={formData.submitterMessage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    submitterMessage: e.target.value,
                  }))
                }
                placeholder="Any additional information about this promo code..."
                rows={2}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-6">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-full border text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-secondary)',
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  color: '#ffffff',
                }}
              >
                {isSubmitting ? 'Submitting…' : 'Submit a Promo Code'}
              </button>
            </div>
          </form>

          <div
            className="mt-6 p-4 rounded-lg transition-theme"
            style={{ backgroundColor: 'var(--background-tertiary)' }}
          >
            <p
              className="text-sm"
              style={{ color: 'var(--text-color)' }}
            >
              <strong>Community Guidelines:</strong> Please only submit
              legitimate promo codes. All submissions are reviewed by our team
              before being published. Thank you for helping build the community!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
