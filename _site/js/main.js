// Main JavaScript for animations and interactions
document.addEventListener("DOMContentLoaded", () => {
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")
      }
    })
  }, observerOptions)

  // Observe all cards and sections
  document.querySelectorAll(".card, .section").forEach((el) => {
    observer.observe(el)
  })

  // Mobile menu toggle
  const mobileToggle = document.querySelector(".mobile-menu-toggle")
  const navTabs = document.querySelector(".nav-tabs")

  if (mobileToggle && navTabs) {
    mobileToggle.addEventListener("click", () => {
      navTabs.classList.toggle("mobile-open")
      mobileToggle.classList.toggle("active")
    })
  }

  // Add hover sound effect (optional)
  document.querySelectorAll(".card, .nav-tab").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      // Subtle hover feedback
      element.style.transition = "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
    })
  })
})

// Page transition effects
function initPageTransitions() {
  // Add page transition class
  document.body.classList.add("page-transition")

  // Handle internal link clicks
  document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.hostname === window.location.hostname) {
        e.preventDefault()
        const href = this.href

        document.body.classList.add("page-leaving")

        setTimeout(() => {
          window.location.href = href
        }, 300)
      }
    })
  })
}

// Initialize page transitions
initPageTransitions()
