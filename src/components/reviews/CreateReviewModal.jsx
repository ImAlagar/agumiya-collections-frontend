// src/components/reviews/CreateReviewModal.js
import React, { useEffect, useState } from 'react';
import { reviewService } from '../../services/api/reviewService';
import { StarRating } from './StarRating';
import { useAuth } from '../../contexts/AuthProvider';
import { useTheme } from '../../contexts/ThemeContext';

export const CreateReviewModal = ({ productId, orderId, onClose, onSuccess, isOpen }) => {
  if (!isOpen) return null;

  const { user } = useAuth();
  const { theme } = useTheme();
  
  const validatedProductId = productId ? parseInt(productId) : null;
  const validatedOrderId = orderId ? parseInt(orderId) : null;
  
  const [formData, setFormData] = useState({
    productId: validatedProductId || 0,
    orderId: validatedOrderId || 0,
    rating: 0,
    title: '',
    comment: '',
  });
  
  const [imageFiles, setImageFiles] = useState([]); // Store the actual File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Store blob URLs for preview only
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add validation effect
  useEffect(() => {
    if (!validatedProductId || validatedProductId <= 0) {
      setError('Invalid product information. Please try again.');
      return;
    }
    if (!validatedOrderId || validatedOrderId <= 0) {
      setError('Invalid order information. Please try again.');
      return;
    }
    
    // Reset form data with validated IDs
    setFormData(prev => ({
      ...prev,
      productId: validatedProductId,
      orderId: validatedOrderId
    }));
    setError('');
  }, [validatedProductId, validatedOrderId]);



const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // Validation
  if (!formData.productId || formData.productId <= 0) {
    setError('Invalid product information');
    return;
  }

  if (!formData.orderId || formData.orderId <= 0) {
    setError('Invalid order information');
    return;
  }

  if (!formData.rating) {
    setError('Please select a rating');
    return;
  }

  if (!formData.comment.trim()) {
    setError('Please write a review comment');
    return;
  }

  setLoading(true);

  try {
    const reviewData = {
      productId: formData.productId,
      orderId: formData.orderId,
      rating: parseInt(formData.rating),
      title: formData.title.trim(),
      comment: formData.comment.trim(),
      images: []
    };


    const result = await reviewService.createReview(reviewData);
    
    if (result.success) {
      onSuccess();
    } else {
      // Handle specific error messages
      if (result.message?.includes('already reviewed')) {
        setError('You have already reviewed this product from this order.');
      } else if (result.message?.includes('only review products you have purchased')) {
        setError('You can only review products from your delivered orders.');
      } else {
        setError(result.message || 'Failed to create review');
      }
    }
  } catch (error) {
    setError('An unexpected error occurred: ' + error.message);
    console.error('Review submission error:', error);
  } finally {
    setLoading(false);
  }
};

// Helper function to convert file to base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        setError('Only JPEG, JPG, PNG, WebP, and GIF images are allowed');
        return false;
      }
      
      if (!isValidSize) {
        setError('Image size must be less than 5MB');
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs for display
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    // Store the actual files
    setImageFiles(prev => [...prev, ...validFiles]);
    
    // Store preview URLs separately
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setError('');
  };

  const removeImage = (index) => {
    // Revoke the blob URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl w-full max-w-md max-h-[95vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg sm:text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Write a Review
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Order Information */}
          <div className={`mb-4 p-3 rounded-lg ${
            theme === 'dark' 
              ? 'bg-blue-900/20 border border-blue-800' 
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">📦</span>
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  Reviewing for Order #{orderId}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Your review will be linked to this order
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              theme === 'dark' 
                ? 'bg-red-900/20 border border-red-800 text-red-300' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Rating Section */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Your Rating *
              </label>
              <div className="flex flex-col items-center space-y-3">
                <StarRating 
                  rating={formData.rating} 
                  onRate={(rating) => {
                    setFormData(prev => ({ ...prev, rating }));
                    setError('');
                  }}
                  size="lg"
                />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {formData.rating > 0 ? `${formData.rating}.0 stars` : 'Select your rating'}
                </span>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Review Title (Optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience in a few words..."
                className={`w-full border rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
                maxLength={100}
              />
              <div className={`text-right text-xs mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {formData.title.length}/100
              </div>
            </div>

            {/* Review Comment */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Your Review *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, comment: e.target.value }));
                  setError('');
                }}
                placeholder="Share your detailed experience with this product. What did you like? What could be improved?"
                rows={4}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm resize-none transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
                maxLength={1000}
                required
              />
              <div className={`flex justify-between text-xs mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <span>Share your honest experience</span>
                <span>{formData.comment.length}/1000</span>
              </div>
            </div>


          </form>
        </div>

        {/* Footer */}
        <div className={`p-4 sm:p-6 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                theme === 'dark' 
                  ? 'border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !formData.rating || !formData.comment.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {imageFiles.length > 0 ? 'Uploading...' : 'Submitting...'}
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};