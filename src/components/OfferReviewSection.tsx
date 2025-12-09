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
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
            Community reviews
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {reviewCount > 0 ? (
              <span className="flex items-center gap-2 mt-1">
                <span className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </span>
                <span>{averageRating} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
              </span>
            ) : (
              'Real feedback from users who have tried this offer.'
            )}
          </p>
        </div>

        {/* Write Review Button - pill style */}
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-[1px]"
          style={{
            backgroundColor: 'var(--accent-color)',
            color: 'white',
          }}
        >
          Write a review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div
          className="mt-6 pt-5 border-t border-dashed"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
            Leave a Review
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                Name (Optional)
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={newReview.username}
                onChange={handleInputChange}
                placeholder="Your name"
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
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`w-8 h-8 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="text" className="block text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                Review
              </label>
              <textarea
                id="text"
                name="text"
                value={newReview.text}
                onChange={handleInputChange}
                placeholder="Share your experience with this product..."
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
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all duration-150"
                style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
              >
                Submit Review
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
              className="rounded-xl border px-4 py-3 sm:px-5 sm:py-4 transition-all duration-150 hover:shadow-sm"
              style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                  >
                    {getDisplayName(review).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm flex items-center gap-2" style={{ color: 'var(--text-color)' }}>
                      {getDisplayName(review)}
                      {review.verified && (
                        <span
                          className="rounded-full px-2 py-0.5 text-xs"
                          style={{ backgroundColor: 'rgba(5,150,105,0.12)', color: 'var(--accent-color)' }}
                        >
                          Verified
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>
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
                {expanded ? 'Show Less' : `Show All ${reviewCount} Reviews`}
              </button>
            </div>
          )}
        </ul>
      )}
    </section>
  );
};

export default OfferReviewSection; 