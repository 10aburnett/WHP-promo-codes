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
  preselectedOfferId?: string;
  preselectedOfferName?: string;
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
    isGeneral: !preselectedOfferId,
    offerId: preselectedOfferId || '',
    customCourseName: '',
    isNewCourse: false,
  });

  useEffect(() => {
    if (preselectedOfferName && !searchTerm) {
      setSearchTerm(preselectedOfferName);
      setDebouncedSearchTerm(preselectedOfferName);
    }
  }, [preselectedOfferName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 100);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
        console.error('Error searching products:', error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsSearching(false);
      }
    }
  }, []);

  useEffect(() => {
    if (showDropdown) {
      searchWhops(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, showDropdown, searchWhops]);

  const selectedProductName = useMemo(() => {
    if (formData.isNewCourse) return formData.customCourseName;
    const selectedOffer = searchResults.find((w) => w.id === formData.offerId);
    return selectedOffer?.name || '';
  }, [searchResults, formData.offerId, formData.isNewCourse, formData.customCourseName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.title || !formData.description || !formData.submitterName || !formData.submitterEmail) {
      alert('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.code.trim() || !formData.value.trim()) {
      alert('Please provide both a promo code and discount value.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.isGeneral && !formData.offerId && !formData.isNewCourse) {
      alert('Please select a product or mark it as new.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.isGeneral && formData.isNewCourse && !formData.customCourseName.trim()) {
      alert('Please enter the product name.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/promo-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          offerId: formData.isGeneral ? null : formData.isNewCourse ? null : formData.offerId,
          customCourseName: formData.isNewCourse ? formData.customCourseName : null,
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
        }, 10000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductSelect = useCallback((whop: DealSearchResult) => {
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

  const handleNewProduct = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      isNewCourse: true,
      offerId: '',
      customCourseName: searchTerm,
    }));
    setShowDropdown(false);
  }, [searchTerm]);

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

  // Success Modal
  if (showSuccessMessage) {
    return (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative w-full max-w-sm p-8 text-center shadow-lg"
          style={{ backgroundColor: 'var(--background-color)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCloseSuccess}
            className="absolute top-3 right-3 p-1 hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-6">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: 'var(--accent-color)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
              Thanks for the tip
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              We've received your code and will check it before adding it to the catalogue.
            </p>
          </div>

          <button
            onClick={handleCloseSuccess}
            className="px-6 py-2 text-sm font-medium rounded-full"
            style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Main Form Modal
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
      role="dialog"
      aria-modal="true"
      onClick={() => onClose?.()}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-lg"
        style={{ backgroundColor: 'var(--background-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent top border */}
        <div className="h-1" style={{ backgroundColor: 'var(--accent-color)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
              Suggest a promo code
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Found a deal? Let others know about it.
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Promo Type Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isGeneral: false }))}
                className={`flex-1 py-2 text-sm font-medium border transition-colors ${!formData.isGeneral ? '' : ''}`}
                style={{
                  backgroundColor: !formData.isGeneral ? 'var(--accent-color)' : 'transparent',
                  color: !formData.isGeneral ? 'white' : 'var(--text-secondary)',
                  borderColor: !formData.isGeneral ? 'var(--accent-color)' : 'var(--border-color)'
                }}
              >
                For a specific product
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isGeneral: true, offerId: '', isNewCourse: false, customCourseName: '' }))}
                className="flex-1 py-2 text-sm font-medium border transition-colors"
                style={{
                  backgroundColor: formData.isGeneral ? 'var(--accent-color)' : 'transparent',
                  color: formData.isGeneral ? 'white' : 'var(--text-secondary)',
                  borderColor: formData.isGeneral ? 'var(--accent-color)' : 'var(--border-color)'
                }}
              >
                General code
              </button>
            </div>

            {/* Product Search */}
            {!formData.isGeneral && (
              <div className="relative">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Choose product
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                      setFormData((prev) => ({ ...prev, offerId: '', isNewCourse: false, customCourseName: '' }));
                    }}
                    onFocus={() => {
                      setShowDropdown(true);
                      if (searchTerm.length >= 2) searchWhops(searchTerm);
                    }}
                    placeholder="Start typing to search..."
                    className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0 transition-colors"
                    style={{
                      borderBottomColor: 'var(--border-color)',
                      color: 'var(--text-color)',
                      backgroundColor: 'transparent'
                    }}
                    autoComplete="off"
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent-color)' }} />
                    ) : (
                      <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Dropdown */}
                {showDropdown && (
                  <>
                    <div
                      className="absolute z-20 w-full mt-1 max-h-48 overflow-y-auto shadow-md"
                      style={{ backgroundColor: 'var(--background-color)', border: '1px solid var(--border-color)' }}
                    >
                      {searchTerm.length < 2 && (
                        <div className="px-3 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                          Enter 2 or more letters...
                        </div>
                      )}

                      {!isSearching && searchTerm.length >= 2 && searchResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleProductSelect(item)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--background-secondary)] transition-colors"
                          style={{ color: 'var(--text-color)' }}
                        >
                          {item.name}
                        </button>
                      ))}

                      {searchTerm.length > 2 && (
                        <button
                          type="button"
                          onClick={handleNewProduct}
                          className="w-full px-3 py-2 text-left text-sm border-t transition-colors"
                          style={{ color: 'var(--accent-color)', borderColor: 'var(--border-color)' }}
                        >
                          + List "{searchTerm}" as a new product
                        </button>
                      )}
                    </div>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                  </>
                )}

                {(selectedProductName || formData.isNewCourse) && (
                  <div className="mt-2 text-xs" style={{ color: 'var(--accent-color)' }}>
                    Selected: {formData.isNewCourse ? formData.customCourseName : selectedProductName}
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Deal headline
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. 20% off annual plan"
                className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0"
                style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                required
              />
            </div>

            {/* Code + Value row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="SUMMER20"
                  className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0"
                  style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Value
                </label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                  placeholder="20% off"
                  className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0"
                  style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Briefly explain the offer and any restrictions..."
                rows={2}
                className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0 resize-none"
                style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                required
              />
            </div>

            {/* Name + Email row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Your name
                </label>
                <input
                  type="text"
                  value={formData.submitterName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, submitterName: e.target.value }))}
                  className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0"
                  style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Your email
                </label>
                <input
                  type="email"
                  value={formData.submitterEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, submitterEmail: e.target.value }))}
                  className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0"
                  style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                  required
                />
              </div>
            </div>

            {/* Optional Message */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Anything else? (optional)
              </label>
              <textarea
                value={formData.submitterMessage}
                onChange={(e) => setFormData((prev) => ({ ...prev, submitterMessage: e.target.value }))}
                rows={2}
                className="w-full border-0 border-b-2 px-0 py-2 text-sm focus:outline-none focus:ring-0 resize-none"
                style={{ borderBottomColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-medium border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium rounded-full disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            We review each submission before making it public.
          </p>
        </div>
      </div>
    </div>
  );
}
