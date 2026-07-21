// EmployeeAvatar.js
import React, { useState, useRef } from 'react';

const EmployeeAvatar = ({
  name = 'Anonymous',
  status = 'inactive',
  profileImage,
  onClick,
  onImageUpload,
  isEditing = false,
  size = 'medium',
}) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Size configurations
  const sizeConfig = {
    small: {
      avatarSize: 56,
      fontSize: 20,
      statusDotSize: 14,
      uploadIconSize: 22,
    },
    medium: {
      avatarSize: 80,
      fontSize: 28,
      statusDotSize: 16,
      uploadIconSize: 28,
    },
    large: {
      avatarSize: 110,
      fontSize: 36,
      statusDotSize: 18,
      uploadIconSize: 32,
    },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Normalize status
  const isActive = status?.toLowerCase() === 'active';

  // Fallback Initials
  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Compress image
  const compressImage = (base64String, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let compressed = canvas.toDataURL('image/jpeg', quality);
        let attempts = 0;
        const maxAttempts = 5;
        while (compressed.length > 4 * 1024 * 1024 && attempts < maxAttempts) {
          quality -= 0.1;
          compressed = canvas.toDataURL('image/jpeg', Math.max(quality, 0.2));
          attempts++;
        }

        resolve(compressed);
      };
      img.onerror = () => resolve(base64String);
    });
  };

  // Handle file selection - Modified to handle errors better
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadError(null);

    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
    ];

    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image file');
      alert('Please select a valid image file (JPEG, PNG, GIF, BMP, WEBP)');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Image size must be less than 4MB');
      alert('Image size must be less than 4MB');
      return;
    }

    setIsUploading(true);

    try {
      let base64String = await fileToBase64(file);

      if (base64String.length > 1 * 1024 * 1024) {
        base64String = await compressImage(base64String, 800, 0.8);
      }

      // Call the parent callback
      if (onImageUpload) {
        await onImageUpload(base64String);
      }

      setUploadError(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Trigger file input
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (onClick) {
      onClick();
    }
  };

  const displayImage = profileImage;

  return (
    <div style={{ display: 'inline-block' }}>
      <button
        onClick={handleAvatarClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={!onClick && !isEditing}
        style={{
          ...styles.wrapperButton,
          cursor: isEditing ? 'pointer' : onClick ? 'pointer' : 'default',
          transform:
            isHovered && (onClick || isEditing) ? 'scale(1.05)' : 'scale(1)',
          outline: isFocused ? '3px solid #3b82f6' : 'none',
          opacity: isUploading ? 0.7 : 1,
          position: 'relative',
        }}
        aria-label={`${name}, status: ${isActive ? 'Active' : 'Inactive'}`}
        title={isEditing ? 'Click to change profile photo' : ''}
      >
        <div style={styles.avatarContainer}>
          <div
            style={{
              ...styles.avatarFrame,
              width: config.avatarSize,
              height: config.avatarSize,
            }}
          >
            {displayImage && !imgError ? (
              <img
                src={displayImage}
                alt={name}
                onError={() => setImgError(true)}
                style={styles.avatarImage}
              />
            ) : (
              <span
                style={{
                  ...styles.initials,
                  fontSize: config.fontSize,
                }}
              >
                {getInitials(name)}
              </span>
            )}

            {/* Upload overlay */}
            {isEditing && isHovered && !isUploading && (
              <div style={styles.uploadOverlay}>
                <span
                  style={{
                    ...styles.uploadIcon,
                    fontSize: config.uploadIconSize,
                  }}
                >
                  📷
                </span>
                <span style={styles.uploadText}>Change Photo</span>
              </div>
            )}

            {isUploading && (
              <div style={styles.uploadOverlay}>
                <div style={styles.spinner}></div>
                <span style={styles.uploadText}>Uploading...</span>
              </div>
            )}

            {/* Status Dot */}
            <span
              style={{
                ...styles.statusDot,
                width: config.statusDotSize,
                height: config.statusDotSize,
                backgroundColor: isActive ? '#22c55e' : '#ef4444',
                boxShadow: '0 0 0 2px #ffffff',
              }}
              title={`Status: ${isActive ? 'Active' : 'Inactive'}`}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/bmp,image/webp"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {isEditing && (
            <div style={styles.editHintContainer}>
              <span style={styles.editHint}>Click to change photo</span>
            </div>
          )}
          {uploadError && <span style={styles.errorText}>{uploadError}</span>}
        </div>
      </button>
    </div>
  );
};

const styles = {
  wrapperButton: {
    background: 'none',
    border: 'none',
    padding: '0',
    borderRadius: '50%',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-block',
    textDecoration: 'none',
    position: 'relative',
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
  },
  avatarFrame: {
    position: 'relative',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  initials: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    textShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statusDot: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    borderRadius: '50%',
    border: '2px solid white',
    zIndex: 2,
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(2px)',
  },
  uploadIcon: {
    marginBottom: '4px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  uploadText: {
    color: 'white',
    fontSize: '10px',
    fontWeight: '500',
    textAlign: 'center',
    padding: '0 4px',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  },
  spinner: {
    width: '28px',
    height: '28px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    marginBottom: '8px',
    animation: 'spin 1s linear infinite',
  },
  editHintContainer: {
    marginTop: '4px',
  },
  editHint: {
    fontSize: '10px',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: '10px',
    color: '#ef4444',
    fontStyle: 'italic',
    marginTop: '4px',
  },
};

// Add spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default EmployeeAvatar;
