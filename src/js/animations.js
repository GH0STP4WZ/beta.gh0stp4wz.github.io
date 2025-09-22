// Advanced animation controller
class AnimationController {
  constructor() {
    this.init()
  }

  init() {
    this.createParticles()
    this.initScrollAnimations()
    this.initHoverEffects()
    this.initPageTransitions()
  }

  // Create floating particles
  createParticles() {
    const particlesContainer = document.createElement("div")
    particlesContainer.className = "particles-bg"
    document.body.appendChild(particlesContainer)

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = Math.random() * 100 + "%"
      particle.style.animationDelay = Math.random() * 20 + "s"
      particle.style.animationDuration = Math.random() * 10 + 15 + "s"
      particlesContainer.appendChild(particle)
    }
  }

  // Initialize scroll-triggered animations
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")

          // Add staggered animation for grid items
          if (entry.target.classList.contains("friends-grid")) {
            const cards = entry.target.querySelectorAll(".friend-card")
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.style.opacity = "1"
                card.style.transform = "translateY(0)"
              }, index * 100)
            })
          }
        }
      })
    }, observerOptions)

    // Observe elements for animation
    document.querySelectorAll(".card, .section, .friends-grid").forEach((el) => {
      observer.observe(el)
    })
  }

  // Initialize hover effects
  initHoverEffects() {
    // Add ripple effect to cards
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("mouseenter", (e) => {
        this.createRipple(e, card)
      })
    })

    // Add magnetic effect to navigation tabs
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("mousemove", (e) => {
        const rect = tab.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        tab.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
      })

      tab.addEventListener("mouseleave", () => {
        tab.style.transform = "translate(0, 0)"
      })
    })
  }

  // Create ripple effect
  createRipple(event, element) {
    const ripple = document.createElement("div")
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(243, 139, 168, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `

    element.style.position = "relative"
    element.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  // Initialize page transitions
  initPageTransitions() {
    // Create transition overlay
    const overlay = document.createElement("div")
    overlay.className = "screen-transition"
    overlay.innerHTML = '<div class="transition-loader"></div>'
    document.body.appendChild(overlay)

    // Handle internal navigation
    document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        if (link.hostname === window.location.hostname && !link.target) {
          e.preventDefault()
          this.transitionToPage(link.href)
        }
      })
    })
  }

  // Smooth page transition
  transitionToPage(url) {
    const overlay = document.querySelector(".screen-transition")
    overlay.classList.add("active")

    setTimeout(() => {
      window.location.href = url
    }, 300)
  }

  // Add typing animation to text
  typeText(element, text, speed = 50) {
    element.textContent = ""
    element.classList.add("typing-animation")

    let i = 0
    const timer = setInterval(() => {
      element.textContent += text.charAt(i)
      i++
      if (i > text.length) {
        clearInterval(timer)
        element.classList.remove("typing-animation")
      }
    }, speed)
  }
}

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AnimationController()
})

// Add CSS for ripple animation
const style = document.createElement("style")
style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)
