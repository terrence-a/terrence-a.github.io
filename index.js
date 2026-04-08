/**
 * Windows 95/98/XP Low-Bit Theme JavaScript
 * Adds retro interactivity and window controls
 */

document.addEventListener('DOMContentLoaded', function () {
  const isLargeDesktop = () => window.innerWidth >= 1200;

  // Add click sound effect simulation to buttons
  const buttons = document.querySelectorAll('.btn, .main-nav a');

  buttons.forEach(btn => {
    btn.addEventListener('mousedown', function () {
      this.style.transform = 'translate(1px, 1px)';
    });

    btn.addEventListener('mouseup', function () {
      this.style.transform = 'translate(0, 0)';
    });

    btn.addEventListener('mouseleave', function () {
      this.style.transform = 'translate(0, 0)';
    });
  });

  // ===== REFRESH BUTTON - Restore closed windows =====
  const refreshBtn = document.getElementById('refreshWindows');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      // Swap icon to refr1 on click
      const icon = refreshBtn.querySelector('.btn-icon');
      if (icon) {
        icon.src = './static/refr1.png';
        // Swap back after a short delay
        setTimeout(() => {
          icon.src = './static/refr0.png';
        }, 400);
      }

      // Restore all closed windows
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        card.style.display = '';
        card.style.opacity = '1';
        card.style.transition = 'opacity 0.15s';
      });
    });
  }

  // ===== DRAGGABLE WINDOWS (Large Desktop Only) =====
  const cards = document.querySelectorAll('.card');
  let activeCard = null;
  let offsetX = 0, offsetY = 0;
  let highestZIndex = 100;
  let isDragging = false;

  function initDraggableCards() {
    if (!isLargeDesktop()) {
      // Reset cards to normal flow on smaller screens
      cards.forEach(card => {
        card.style.position = '';
        card.style.left = '';
        card.style.top = '';
        card.style.width = '';
        card.style.zIndex = '';
        card.classList.remove('draggable');
      });
      const mainContainer = document.querySelector('main.container');
      if (mainContainer) {
        mainContainer.style.minHeight = '';
        mainContainer.style.position = '';
      }
      return;
    }

    const mainContainer = document.querySelector('main.container');
    const mainRect = mainContainer.getBoundingClientRect();
    const containerWidth = mainRect.width;

    // Set main container to relative for absolute positioning context
    mainContainer.style.position = 'relative';
    mainContainer.style.minHeight = '950px';

    // Predefined cascading layout positions (spaced out horizontally and vertically)
    // Order in HTML: About, Experience, Skills, Projects
    const layouts = [
      { left: -40, top: 0, width: 560, zIndex: 101 },           // About - pushed top left
      { left: 410, top: 155, width: 640, zIndex: 103 },         // Experience - pushed right, moved down
      { left: 410, top: 520, width: 640, zIndex: 104 },         // Skills - pushed right, down
      { left: -40, top: 380, width: 400, zIndex: 102 }          // Projects - pushed left, down
    ];

    // Make cards draggable on large desktop with predefined positions
    cards.forEach((card, index) => {
      if (!card.classList.contains('draggable')) {
        card.classList.add('draggable');
        card.style.position = 'absolute';

        const layout = layouts[index] || { left: 30 * index, top: 30 * index, width: 500, zIndex: 100 + index };

        card.style.left = layout.left + 'px';
        card.style.top = layout.top + 'px';
        card.style.width = layout.width + 'px';
        card.style.zIndex = layout.zIndex;
        card.style.margin = '0';

        highestZIndex = Math.max(highestZIndex, 100 + index);

        // Add grab cursor to header
        const header = card.querySelector('h2');
        if (header) {
          header.style.cursor = 'grab';
        }
      }
    });
  }

  function onMouseDown(e) {
    if (!isLargeDesktop()) return;

    // Check if we clicked on an h2 inside a card
    const header = e.target.closest('h2');
    if (!header) return;

    const card = header.closest('.card');
    if (!card || !card.classList.contains('draggable')) return;

    // Don't drag if clicking close button (right 30px of header)
    const rect = header.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX > rect.width - 30) return;

    activeCard = card;
    isDragging = true;

    // Bring to front
    highestZIndex++;
    activeCard.style.zIndex = highestZIndex;

    // Calculate offset from card's top-left corner
    const cardRect = activeCard.getBoundingClientRect();
    offsetX = e.clientX - cardRect.left;
    offsetY = e.clientY - cardRect.top;

    activeCard.style.cursor = 'grabbing';
    header.style.cursor = 'grabbing';

    e.preventDefault();
    e.stopPropagation();
  }

  function onMouseMove(e) {
    if (!isDragging || !activeCard || !isLargeDesktop()) return;

    const mainContainer = document.querySelector('main.container');
    const mainRect = mainContainer.getBoundingClientRect();

    const newX = e.clientX - mainRect.left - offsetX;
    const newY = e.clientY - mainRect.top - offsetY;

    activeCard.style.left = newX + 'px';
    activeCard.style.top = newY + 'px';

    e.preventDefault();
  }

  function onMouseUp(e) {
    if (activeCard && isDragging) {
      activeCard.style.cursor = '';
      const header = activeCard.querySelector('h2');
      if (header) header.style.cursor = 'grab';
    }
    activeCard = null;
    isDragging = false;
  }

  // Event listeners for dragging
  document.addEventListener('mousedown', onMouseDown, true);
  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('mouseup', onMouseUp, true);

  // Initialize and handle resize
  window.addEventListener('resize', () => {
    // Reset and reinitialize on resize
    cards.forEach(card => {
      card.classList.remove('draggable');
      card.style.position = '';
      card.style.left = '';
      card.style.top = '';
      card.style.width = '';
      card.style.zIndex = '';
      card.style.margin = '';
    });
    setTimeout(initDraggableCards, 50);
  });

  // Delay initialization to ensure layout is complete
  setTimeout(initDraggableCards, 200);

  // Add window close button functionality (visual only)
  const cardHeaders = document.querySelectorAll('.card h2');

  cardHeaders.forEach(header => {
    header.addEventListener('click', function (e) {
      // Only close if clicking close button (right 30px)
      const rect = header.getBoundingClientRect();
      const clickX = e.clientX - rect.left;

      if (clickX > rect.width - 30) {
        const card = header.closest('.card');
        card.style.transition = 'opacity 0.15s';
        card.style.opacity = '0';

        setTimeout(() => {
          card.style.display = 'none';
        }, 150);
      }
    });
  });

  // Blinking cursor effect for title (simulates old terminals)
  const titleElement = document.querySelector('.site-title');
  if (titleElement) {
    const originalText = titleElement.textContent;
    let showCursor = true;

    setInterval(() => {
      showCursor = !showCursor;
      titleElement.textContent = originalText + (showCursor ? '_' : '\u00A0');
    }, 530);
  }

  // Add startup message to console (Easter egg)
  console.log('%c═══════════════════════════════════════════', 'color: #000080');
  console.log('%c  Welcome to terrence_amponsah.exe v1.0    ', 'color: #000080; font-weight: bold');
  console.log('%c  © 2025 Terrence Amponsah                 ', 'color: #808080');
  console.log('%c═══════════════════════════════════════════', 'color: #000080');
  console.log('%c  System loaded successfully.              ', 'color: #008000');
});

// Remove unused canvas reference
const canvas = document.getElementById('backgroundCanvas');
if (canvas) {
  canvas.style.display = 'none';
}
