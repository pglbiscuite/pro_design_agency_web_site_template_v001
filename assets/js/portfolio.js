// Enhanced Lightbox with Navigation (alt-first)
document.addEventListener('DOMContentLoaded', function() {
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn    = document.querySelector('.close-lightbox');
    const prevBtn     = document.querySelector('.lightbox-prev');
    const nextBtn     = document.querySelector('.lightbox-next');
    const galleryImages = document.querySelectorAll('.gallery-image');
  
    let currentImageIndex = 0;
    let currentImages = [];
  
    // Helper: prefer data-alt if present
    function getDisplaySrc(imgEl) {
      // Use attribute so we don't accidentally get absolute URL mismatch issues
      return imgEl.getAttribute('data-alt') || imgEl.getAttribute('src');
    }
  
    function initLightbox() {
      // Capture visible images list initially
      updateCurrentImages();
  
      // Attach click on all gallery images
      galleryImages.forEach((img) => {
        img.addEventListener('click', function () {
          // ensure currentImages is fresh (multi-gallery pages)
          updateCurrentImages();
          currentImageIndex = currentImages.indexOf(this);
          openLightbox(this); // pass the element, not just src
        });
      });
  
      // Close lightbox (X)
      closeBtn.addEventListener('click', closeLightbox);
  
      // Close when clicking the backdrop
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
      });
  
      // Prev / Next
      prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showPreviousImage();
      });
  
      nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showNextImage();
      });
  
      // Keyboard nav
      document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
          if (e.key === 'Escape') {
            closeLightbox();
          } else if (e.key === 'ArrowLeft') {
            showPreviousImage();
          } else if (e.key === 'ArrowRight') {
            showNextImage();
          }
        }
      });
    }
  
    // Build the active gallery list (keeps your multi-gallery behavior)
    function updateCurrentImages() {
      currentImages = Array.from(galleryImages).filter(img => {
        const gallery = img.closest('.cs-gallery');
        return gallery && !gallery.classList.contains('cs-hidden');
      });
    }
  
    // Open lightbox for a given image element (alt-first)
    function openLightbox(imgEl) {
      updateCurrentImages();
      lightboxImg.src = getDisplaySrc(imgEl);
      lightbox.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  
    function closeLightbox() {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  
    function showPreviousImage() {
      if (currentImages.length === 0) return;
      currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
      lightboxImg.src = getDisplaySrc(currentImages[currentImageIndex]);
    }
  
    function showNextImage() {
      if (currentImages.length === 0) return;
      currentImageIndex = (currentImageIndex + 1) % currentImages.length;
      lightboxImg.src = getDisplaySrc(currentImages[currentImageIndex]);
    }
  
    // Init
    initLightbox();
  
    // If you use filters that toggle .cs-hidden, refresh the list after changes
    const filterButtons = document.querySelectorAll('.cs-button[data-filter]');
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        setTimeout(() => {
          updateCurrentImages();
        }, 100);
      });
    });
  });
  