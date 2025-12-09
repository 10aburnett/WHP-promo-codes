'use client';

import React, { useState, useEffect } from 'react';

interface Review {
  id: string;
  username?: string;
  author?: string;
  text?: string;
  content?: string;
  rating: number;
  date?: string;
  createdAt?: string;
  verified?: boolean;
}

interface OfferReviewSectionProps {
  offerId: string;
  whopName: string;
  reviews?: Review[];
}

// Helper function to normalize reviews
const normalizeReview = (review: any): Review => {
  // Format date consistently to avoid hydration mismatches
  let formattedDate = 'Recently';
  if (review.date) {
    formattedDate = review.date;
  } else if (review.createdAt) {
    // Use a consistent date format that doesn't depend on locale
    const date = new Date(review.createdAt);
    formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  return {
    id: review.id || `temp-${Date.now()}`,
    username: review.username || review.author || 'Anonymous',
    author: review.author || review.username || 'Anonymous',
    text: review.text || review.content || '',
    content: review.content || review.text || '',
    rating: review.rating || 5,
    date: formattedDate,
    verified: review.verified || false,
  };
};

// Helper function to calculate average rating
const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

// StarRow component for consistent star display
const StarRow: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'md' }) => {
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={`inline-flex items-center gap-0.5 ${textSize}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ color: star <= Math.round(rating) ? 'var(--accent-color)' : 'var(--border-color)' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const OfferReviewSection: React.FC<OfferReviewSectionProps> = ({ offerId, whopName, reviews: initialReviews = [] }) => {
  // Initialize reviews state with processed initial reviews if available
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (initialReviews && initialReviews.length > 0) {
      return initialReviews.map(normalizeReview);
    }
    return [];
  });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [newReview, setNewReview] = useState({
    username: '',
    rating: 5,
    text: '',
  });

  // Normalize and set initial reviews - ALWAYS prioritize server data
  useEffect(() => {
    const storageKey = `offer_reviews_${offerId}`;

    // ALWAYS use server data if available (including empty array)
    if (initialReviews !== undefined) {
      const normalizedReviews = initialReviews.map(normalizeReview);
      setReviews(normalizedReviews);

      // Clear localStorage when we have fresh server data to prevent stale data issues
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
      return;
    }

    // Only use localStorage as absolute fallback when no server data provided
    try {
      const savedReviews = localStorage.getItem(storageKey);
      if (savedReviews) {
        const parsedReviews = JSON.parse(savedReviews);
        setReviews(parsedReviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error loading reviews from localStorage:', error);
      setReviews([]);
    }
  }, [offerId, initialReviews]);

  const averageRating = calculateAverageRating(reviews);
  const reviewCount = reviews.length;

  // Show only 2 reviews initially, or all if expanded
  const visibleReviews = expanded ? reviews : reviews.slice(0, 2);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value,
    });
  };

  // Handle star rating selection
  const handleRatingChange = (rating: number) => {
    setNewReview({
      ...newReview,
      rating,
    });
  };

  // Handle review submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create a new review object for API submission
      const reviewData = {
        author: newReview.username || 'Anonymous',
        content: newReview.text || '',
        rating: newReview.rating || 5,
        offerId: offerId,
      };

      // Submit to API for moderation
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Create a new review object for UI display
      const userReview: Review = {
        id: `user-${Date.now()}`,
        username: newReview.username || 'Anonymous',
        author: newReview.username || 'Anonymous',
        text: newReview.text || '',
        content: newReview.text || '',
        rating: newReview.rating || 5,
        date: 'Just now',
        verified: false,
      };

      // Add the new review to the reviews list (temporary until page refresh)
      const updatedReviews = [userReview, ...reviews];
      setReviews(updatedReviews);
      setShowForm(false);

      // Note: No longer storing in localStorage since we prioritize server data

      // Clear form after submission
      setNewReview({
        username: '',
        rating: 5,
        text: '',
      });

      // Show submission confirmation
      alert('Thank you for your review! It has been submitted for moderation and will be visible after approval.');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('There was an error submitting your review. Please try again later.');
    }
  };

  // Helper to get the display name
  const getDisplayName = (review: Review) => {
    return review.username || review.author || 'Anonymous';
  };

  // Helper to get the display text
  const getDisplayText = (review: Review) => {
    return review.text || review.content || '';
  };

  return (
    <section
      className="rounded-2xl border shadow-theme-promo px-6 py-5 sm:px-8 sm:py-7 transition-theme"
      style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}
    >
      {/* Header row - two columns on desktop */}
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] sm:items-center mb-6">
        {/* Left: title + rating summary */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
            User ratings & feedback
          </h2>
          {reviewCount > 0 ? (
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold" style={{ color: 'var(--text-color)' }}>
                  {averageRating}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>/5.0</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StarRow rating={averageRating} size="md" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Based on {reviewCount} rating{reviewCount !== 1 ? 's' : ''} from the DigitalPromoCodes community.
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Be the first to share your experience with this offer.
            </p>
          )}
        </div>

        {/* Right: CTA */}
        <div className="sm:text-right">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="ml-auto inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-px"
            style={{
              borderColor: 'var(--accent-color)',
              color: 'var(--accent-color)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--background-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Add your review
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <div
          className="mt-6 pt-5 border-t border-dashed"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
            Share your experience
          </h3>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-secondary)' }}>
            Your review helps other users decide if this offer is right for them.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Rating side by side on desktop */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="username" className="block text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                  Display name (optional)
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newReview.username}
                  onChange={handleInputChange}
                  placeholder="How should we show your name?"
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition-colors"
                  style={{
                    backgroundColor: 'var(--background-color)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)'
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                  Overall rating
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="w-8 h-8 text-xl transition-transform hover:scale-110"
                        style={{ color: star <= newReview.rating ? 'var(--accent-color)' : 'var(--border-color)' }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {newReview.rating}/5
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="text" className="block text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                Your feedback
              </label>
              <textarea
                id="text"
                name="text"
                value={newReview.text}
                onChange={handleInputChange}
                placeholder="Tell us what you liked, what could be better, and anything future users should know."
                required
                rows={4}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition-colors resize-vertical"
                style={{
                  backgroundColor: 'var(--background-color)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)'
                }}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-full text-sm font-medium border hover:bg-[var(--background-color)] transition-colors"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all duration-150"
                style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
              >
                Send review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviewCount > 0 && (
        <ul className="space-y-3 sm:space-y-4 mt-5">
          {visibleReviews.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border px-4 py-4 sm:px-5 sm:py-4 flex flex-col gap-2 transition-all hover:shadow-sm"
              style={{
                backgroundColor: 'var(--background-color)',
                borderColor: 'var(--border-color)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar - rounded square */}
                  <div
                    className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm font-semibold"
                    style={{
                      borderColor: 'var(--border-color)',
                      backgroundColor: 'var(--background-secondary)',
                      color: 'var(--accent-color)',
                    }}
                  >
                    {getDisplayName(review).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-color)' }}>
                      {getDisplayName(review)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRow rating={review.rating} size="sm" />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                {review.verified && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                    style={{ backgroundColor: 'rgba(5,150,105,0.12)', color: 'var(--accent-color)' }}
                  >
                    Verified purchase
                  </span>
                )}
              </div>
              {/* Body text */}
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {getDisplayText(review)}
              </p>
            </li>
          ))}

          {reviews.length > 2 && (
            <div className="text-center pt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: 'var(--accent-color)' }}
              >
                {expanded ? 'Collapse reviews' : `View all ${reviewCount} reviews`}
              </button>
            </div>
          )}
        </ul>
      )}
    </section>
  );
};

export default OfferReviewSection;
