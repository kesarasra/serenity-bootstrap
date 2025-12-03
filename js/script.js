// --------------------
// Home text animation
// --------------------
window.addEventListener('load', () => {
  setTimeout(() => {
    const homeText = document.getElementById('home-text');
    if (homeText) {
      homeText.classList.add('bounce-in');
    }
  }, 2500); // delay before bounce
});

// --------------------
// Bento scaling
// --------------------
const bentoSections = document.querySelectorAll('.bento-section');

function updateBentoScale() {
  const windowCenter = window.innerHeight / 2;
  bentoSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(windowCenter - sectionCenter);

    let scale = 1.4 - (distance / windowCenter) * 0.5;
    scale = Math.min(Math.max(scale, 0.9), 1.4);

    section.style.transform = `scale(${scale})`;
    section.style.transition = 'transform 0.2s ease-out';
  });
}
window.addEventListener('scroll', updateBentoScale);
window.addEventListener('resize', updateBentoScale);
updateBentoScale();

// --------------------
// Header hide/show
// --------------------
let lastScroll = 0;
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (header) {
    header.style.transform = (currentScroll > lastScroll) 
      ? 'translateY(-100%)'
      : 'translateY(0)';
  }
  lastScroll = currentScroll;
});

// --------------------
// Hamburger menu
// --------------------
const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuDropdown = document.getElementById('menuDropdown');

if (hamburgerBtn && menuDropdown) {
  hamburgerBtn.addEventListener('click', e => {
    e.stopPropagation();
    menuDropdown.classList.toggle('show');
  });
  document.body.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) menuDropdown.classList.remove('show');
  });
  const dropdown = document.querySelector('.dropdown');
  if (dropdown) {
    dropdown.addEventListener('mouseenter', () => menuDropdown.classList.add('show'));
    dropdown.addEventListener('mouseleave', () => menuDropdown.classList.remove('show'));
  }
}

document.querySelectorAll('.submenu-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.dataset.target;
    const targetToggle = document.querySelector(targetId);

    if (targetToggle) {
      targetToggle.click(); // Trigger bento toggle
    }

    // Scroll smoothly to the Services section (optional)
    document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });

    // Close the hamburger dropdown (optional)
    document.getElementById('menuDropdown').classList.remove('show');
  });
});

// --------------------
// Unified Parallax
// --------------------
(function(){
  let items = [];
  function computeInitialTops() {
    const nodes = Array.from(document.querySelectorAll('[data-parallax]'));
    items = nodes.map(el => ({
      el,
      target: el.querySelector('.frosted-card, img') || el,
      speed: Math.max(0, parseFloat(el.getAttribute('data-parallax')) || 0.01),
      initialTop: el.getBoundingClientRect().top + window.pageYOffset
    }));
  }

  function updateParallax() {
    const scrollY = window.pageYOffset || 0;
    items.forEach(item => {
      let translate = -(scrollY - item.initialTop) * item.speed;
      // Special handling for carousel captions
      if (item.el.classList.contains('carousel-caption')) {
        translate = translate * 0.3; // slower scroll inside bottom panel
      }

      translate = Math.max(Math.min(translate, 250), -250);
      item.target.style.transform = `translateY(${translate}px) scale(1.05)`;
    });
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => { updateParallax(); ticking = false; });
      ticking = true;
    }
  }

  window.addEventListener('load', () => { computeInitialTops(); updateParallax(); });
  window.addEventListener('resize', () => { computeInitialTops(); updateParallax(); });
  window.addEventListener('scroll', onScroll);

  window.__serenityParallax = { computeInitialTops, updateParallax };
})();

// --------------------
// AOS init
// --------------------
function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration:600,      // shorter fade time
      easing: 'ease-out', // snappier easing
      once: true,         // don't replay on scroll up
      offset: 120,         // triggers slightly earlier
    });
  }
}

// --------------------
// Read More / Read Less (Services page only)
// --------------------
function initReadMoreLinks() {
  const servicesSection = document.getElementById('services');
  if (!servicesSection) return;

  servicesSection.querySelectorAll('.read-more').forEach(link => {
    link.addEventListener('click', function() {
      const card = this.closest('.frosted-card');
      if (!card) return;

      card.classList.toggle('expanded');
      this.textContent = card.classList.contains('expanded') ? "Read Less" : "Read More";
    });
  });
}

// --------------------
// Carousel caption animations
// --------------------
function initCarouselCaptions() {
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    const bsCarousel = bootstrap.Carousel.getInstance(carousel) || new bootstrap.Carousel(carousel, { interval: 5000 });

    const firstSlide = carousel.querySelector('.carousel-item.active');
    if (firstSlide) animateCaptions(firstSlide);

    carousel.addEventListener('slid.bs.carousel', (e) => {
      animateCaptions(e.relatedTarget);
    });
  });

  function animateCaptions(slide) {
    const captions = slide.querySelectorAll('.carousel-caption.frosted-card');
    captions.forEach((cap, i) => {
      cap.style.opacity = 0;
      cap.style.transform = 'translateY(20px)';
      cap.style.transition = `opacity 0.6s ease ${(i*0.15)}s, transform 0.6s ease ${(i*0.15)}s`;
      requestAnimationFrame(() => {
        cap.style.opacity = 1;
        cap.style.transform = 'translateY(0)';
      });
    });
  }
}

// --------------------
// Dynamic page loader (with all effects)
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  const pages = [
    { id: "about", url: "about.html" },
    { id: "counselors", url: "counselors.html" },
    { id: "services", url: "services.html" },
    { id: "media", url: "media.html" },
    { id: "contact", url: "contact.html" }
  ];

  const container = document.getElementById("page-content");

  const loadPage = (page) => {
    return fetch(page.url)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const sections = doc.querySelectorAll("section");
        sections.forEach(sec => {
          container.appendChild(sec);
        });

        // Refresh effects
        if (typeof AOS !== "undefined") AOS.refreshHard();
        if (window.__serenityParallax) {
          window.__serenityParallax.computeInitialTops();
          window.__serenityParallax.updateParallax();
        }
        if (window.bootstrap) {
          document.querySelectorAll('.carousel').forEach(el => {
            try {
              new bootstrap.Carousel(el, { interval: 5000 });
            } catch (err) {
              console.warn("Skipping broken carousel config:", el, err);
            }
          });
          initCarouselCaptions();
        }
      });
  };

  // Sequentially load pages
  pages.reduce((p, page) => p.then(() => loadPage(page)), Promise.resolve())
       .then(() => {
           initAOS();               // <-- AOS with services settings
           initReadMoreLinks();     // <-- Read More / Read Less
           initCounselorBioNavigation(); // Counselor profile prev/next
           initMediaSection();      // Media section videos
           if (document.getElementById('services')) initServicesBento();  // <-- initialize services bento grid
       });
});

// ----------------------------
// Counselor Profile Navigation
// ----------------------------
function initCounselorBioNavigation() {
  const profiles = document.querySelectorAll('.counselor-profile-page');
  if (!profiles.length) return;

  let currentIndex = 0;

  function showProfile(index) {
    profiles.forEach(profile => profile.classList.remove('active'));
    profiles[index].classList.add('active');
  }

  const prevBtn = document.getElementById('prevCounselor');
  const nextBtn = document.getElementById('nextCounselor');

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + profiles.length) % profiles.length;
      showProfile(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % profiles.length;
      showProfile(currentIndex);
    });
  }

  showProfile(currentIndex);
}

// ----------------------------
// Services Bento UI Grid Display
// ----------------------------
function initServicesBento() {
  const buttons = document.querySelectorAll('#services .bento-section');
  const grids = document.querySelectorAll('#services-grid, #training-grid, #activities-grid');

  if (!buttons.length) return; // fragment not loaded

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active buttons
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Hide all grids
      grids.forEach(grid => grid.style.display = 'none');

      // Show selected grid
      const targetId = button.dataset.target;
      const targetGrid = document.getElementById(targetId);
      if (targetGrid) targetGrid.style.display = '';
    });
  });
}



// ------------------------------
// Media Section (Video Cards)
// ------------------------------
function initMediaSection() {
  const videoCards = Array.from(document.querySelectorAll('#page-content .video-card[data-video-id]'));
  if (!videoCards.length) return;

  const PREVIEW_MS = 5000; // 10s preview
  let cycleTimer = null;
  let cycling = false;
  let currentIndex = 0;

  const buildThumbnailHtml = (videoId) => `
    <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg"
         alt="YouTube preview"
         style="width:100%; height:180px; object-fit:cover;">
    <div class="play-button">▶</div>
  `;

  function restoreCard(idx) {
    const card = videoCards[idx];
    if (!card) return;
    const vid = card.getAttribute('data-video-id');
    if (!vid) return;  // <-- skip non-YouTube cards
    card.innerHTML = buildThumbnailHtml(vid);
    card.classList.remove('playing');
  }

  function playCard(idx) {
    const card = videoCards[idx];
    if (!card) return;
    const vid = card.getAttribute('data-video-id');
    if (!vid) return;  // <-- skip non-YouTube cards
    card.innerHTML = `
      <iframe width="100%" height="180"
        src="https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1"
        title="YouTube video preview" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>`;
    card.classList.add('playing');
  }

  function step() {
    playCard(currentIndex);
    cycleTimer = setTimeout(() => {
      restoreCard(currentIndex);
      currentIndex = (currentIndex + 1) % videoCards.length;
      step();
    }, PREVIEW_MS);
  }

  function startCyclingFrom(idx) {
    if (cycling) return;
    cycling = true;
    videoCards.forEach((_, i) => restoreCard(i));
    currentIndex = idx % videoCards.length;
    step();
  }

  function stopCycling() {
    cycling = false;
    if (cycleTimer) { clearTimeout(cycleTimer); cycleTimer = null; }
  }

  // Click: unmuted playback & stop cycling
  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const vid = card.getAttribute('data-video-id');
      stopCycling();
      card.innerHTML = `
        <iframe width="100%" height="180"
          src="https://www.youtube.com/embed/${vid}?autoplay=1&mute=0"
          title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>`;
      card.classList.add('playing');
    });
  });

  // IntersectionObserver to start cycle when first visible
  const observer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const idx = videoCards.indexOf(entry.target);
        if (idx !== -1) {
          obs.disconnect();
          startCyclingFrom(idx);
          break;
        }
      }
    }
  }, { threshold: 0.5 });

  videoCards.forEach(c => observer.observe(c));

  // Pause cycle on tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (cycleTimer) { clearTimeout(cycleTimer); cycleTimer = null; }
    } else if (cycling && !cycleTimer) {
      cycleTimer = setTimeout(() => {
        restoreCard(currentIndex);
        currentIndex = currentIndex % videoCards.length;
        step();
      }, 500);
    }
  });

  //
  // initContactSection()
  // - call this after you inject/append the contact fragment into the DOM
  // - it auto-runs if #contact is already present
  // - supports EmailJS when the form has data-emailjs-service & data-emailjs-template set
  //   otherwise falls back to Formspree using the form action attribute.
  //

  function initContactSection() {
  const form = document.getElementById('contact-form');
  const alertEl = document.getElementById('contact-alert');
  if (!form) return;

  function showAlert(type, message) {
  alertEl.className = 'alert'; // reset classes
  alertEl.classList.add(type === 'success' ? 'alert-success' : 'alert-danger', 'show');
  alertEl.textContent = message;
  // auto-hide after 6s
  setTimeout(() => {
  alertEl.classList.remove('show');
  alertEl.textContent = '';
  }, 6000);
  }

  form.addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  const formData = new FormData(form);

  // EMAILJS config pulled from data attributes (set them on the <form> tag)
  const emailjsService = form.getAttribute('data-emailjs-service') || form.dataset.emailjsService;
  const emailjsTemplate = form.getAttribute('data-emailjs-template') || form.dataset.emailjsTemplate;

  // If EmailJS is available and configured, use it
  if (window.emailjs && emailjsService && emailjsTemplate && typeof emailjs.sendForm === 'function') {
    emailjs.sendForm(emailjsService, emailjsTemplate, form)
      .then(() => {
        showAlert('success', 'Thanks — your message has been sent!');
        form.reset();
      })
      .catch((err) => {
        console.error('EmailJS error', err);
        showAlert('error', 'Oops — there was a problem sending your message.');
      })
      .finally(() => { if (submitBtn) submitBtn.disabled = false; });
    return;
  }

  // Fallback: POST to form.action (Formspree)
  const action = form.action || '';
  const method = (form.method || 'POST').toUpperCase();
  if (!action) {
    showAlert('error', 'No form action configured.');
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  fetch(action, {
    method,
    headers: { 'Accept': 'application/json' },
    body: formData
  })
  .then(response => {
    if (response.ok) return response.json().catch(() => ({}));
    return response.json().then(err => Promise.reject(err));
  })
  .then(() => {
    showAlert('success', 'Thanks — your message has been sent!');
    form.reset();
  })
  .catch(err => {
    console.error('Form submit error', err);
    showAlert('error', 'Oops — there was a problem sending your message.');
  })
  .finally(() => {
    if (submitBtn) submitBtn.disabled = false;
  });

  });
  }

  // expose so dynamic loader can call after injection
  window.initContactSection = initContactSection;

  // auto-init if the contact fragment is already in the DOM
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
  if (document.getElementById('contact')) initContactSection();
  } else {
  document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('contact')) initContactSection();
  });
  }

  let scrollTimer;

  window.addEventListener('scroll', () => {
    document.body.classList.add('scrolling');

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      document.body.classList.remove('scrolling');
    }, 2500); // 2.5 second after scroll stops
  });

// ----------------------------
// FreeTranslate public API
// GOES BELOW...
// ----------------------------


/* ADD more script here...*/

}
