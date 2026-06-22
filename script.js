/**
 * ============================================
 * CYBORG NEXUS — Main JavaScript (Enhanced)
 * ============================================
 * Handles all interactive behaviors:
 * - Loading screen dismissal
 * - Particle background system with parallax
 * - Mouse glow cursor follower
 * - Hero parallax on mouse movement
 * - Animated counter statistics
 * - Progress bar animations
 * - Sticky navbar with scroll effect
 * - Active nav link highlighting (scroll spy)
 * - Mobile hamburger menu
 * - Smooth scrolling navigation
 * - Feature card 3D tilt effect
 * - Button ripple effects
 * - CTA parallax
 * ============================================
 */

"use strict";

/* ============================================
   1. DOM READY WRAPPER
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {

    /* ============================================
       2. LOADING SCREEN
       ============================================
       Fades out the loading screen after page
       assets have fully loaded, with a minimum
       display time for the animation to show.
    */
    const loadingScreen = document.getElementById("loadingScreen");

    if (loadingScreen) {
        const minDisplayTime = 1800; // ms — minimum time to show the loading screen
        const startTime = Date.now();

        function dismissLoader() {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minDisplayTime - elapsed);

            setTimeout(() => {
                loadingScreen.classList.add("hidden");
                document.body.style.overflow = ""; // Restore scrolling

                // Remove from DOM after fade transition completes
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }
                }, 800);
            }, remaining);
        }

        // Prevent scroll while loading
        document.body.style.overflow = "hidden";

        // Dismiss on window load or after a max wait
        window.addEventListener("load", dismissLoader);
        setTimeout(dismissLoader, 5000); // Safety fallback
    }


    /* ============================================
       3. MOUSE GLOW CURSOR FOLLOWER
       ============================================
       A radial glow that follows the mouse cursor
       with cyan and purple blur, blending smoothly
       into the dark cyberpunk background.
    */
    const mouseGlow = document.getElementById("mouseGlow");

    if (mouseGlow) {
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let glowVisible = false;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!glowVisible) {
                glowVisible = true;
                mouseGlow.style.opacity = "1";
            }
        });

        document.addEventListener("mouseleave", () => {
            glowVisible = false;
            mouseGlow.style.opacity = "0";
        });

        // Smooth follow with lerp (linear interpolation)
        function animateGlow() {
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;

            mouseGlow.style.left = currentX + "px";
            mouseGlow.style.top = currentY + "px";

            requestAnimationFrame(animateGlow);
        }

        animateGlow();
    }


    /* ============================================
       4. PARTICLE BACKGROUND SYSTEM
       ============================================
       Creates an interactive floating particle
       effect on the hero section canvas with
       mouse-based parallax interaction.
    */
    const canvas = document.getElementById("particles-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let mouseParticleX = 0;
        let mouseParticleY = 0;

        /**
         * Resize canvas to match its parent container.
         */
        function resizeCanvas() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        /**
         * Particle class — represents a single floating particle.
         */
        class Particle {
            constructor() {
                this.reset();
            }

            /** Initialize/reset particle with random properties */
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.baseSpeedX = (Math.random() - 0.5) * 0.8;
                this.baseSpeedY = (Math.random() - 0.5) * 0.8;
                this.speedX = this.baseSpeedX;
                this.speedY = this.baseSpeedY;
                this.opacity = Math.random() * 0.5 + 0.1;

                // Random color: cyan, purple, or pink
                const colors = [
                    "0, 245, 255",   // Cyan
                    "127, 92, 255",  // Purple
                    "255, 0, 229"    // Pink
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            /** Update particle position with parallax influence */
            update() {
                // Apply subtle mouse parallax to particles
                const dx = mouseParticleX - canvas.width / 2;
                const dy = mouseParticleY - canvas.height / 2;
                this.speedX = this.baseSpeedX + dx * 0.00005;
                this.speedY = this.baseSpeedY + dy * 0.00005;

                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around screen edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            /** Draw particle as a glowing circle */
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();

                // Subtle glow effect
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity * 0.15})`;
                ctx.fill();
            }
        }

        /**
         * Initialize particle array based on screen width.
         */
        function initParticles() {
            particles = [];
            const count = window.innerWidth < 768 ? 40 : 80;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        /**
         * Draw lines between nearby particles for a network effect.
         */
        function drawConnections() {
            const maxDistance = 150;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 245, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        /**
         * Main animation loop for particle system.
         */
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();
            requestAnimationFrame(animateParticles);
        }

        // Track mouse position for particle parallax
        canvas.parentElement.addEventListener("mousemove", (e) => {
            const rect = canvas.parentElement.getBoundingClientRect();
            mouseParticleX = e.clientX - rect.left;
            mouseParticleY = e.clientY - rect.top;
        });

        // Initialize and start particle system
        resizeCanvas();
        initParticles();
        animateParticles();

        // Handle window resize with debounce
        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                initParticles();
            }, 250);
        });
    }


    /* ============================================
       5. HERO PARALLAX ON MOUSE MOVEMENT
       ============================================
       Adds subtle parallax movement to hero
       background elements based on mouse position.
    */
    const heroBg = document.getElementById("heroBg");
    const heroSection = document.getElementById("home");

    if (heroBg && heroSection) {
        heroSection.addEventListener("mousemove", (e) => {
            const rect = heroSection.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const moveX = (mouseX - centerX) / centerX;
            const moveY = (mouseY - centerY) / centerY;

            // Parallax the gradient circles at different speeds
            const circles = heroBg.querySelectorAll(".gradient-circle");
            circles.forEach((circle, index) => {
                const speed = (index + 1) * 12;
                circle.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
            });
        });

        heroSection.addEventListener("mouseleave", () => {
            const circles = heroBg.querySelectorAll(".gradient-circle");
            circles.forEach((circle) => {
                circle.style.transform = "translate(0, 0)";
                circle.style.transition = "transform 0.6s ease-out";
                setTimeout(() => {
                    circle.style.transition = "";
                }, 600);
            });
        });
    }


    /* ============================================
       6. ANIMATED COUNTER STATISTICS
       ============================================
       When the stats section enters the viewport,
       animate numbers from 0 to their target value.
    */
    const statNumbers = document.querySelectorAll(".stat-number");
    let countersAnimated = false;

    /**
     * Animate a single counter element from 0 to target.
     * @param {HTMLElement} el - The counter element
     */
    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        const isDecimal = el.dataset.decimal === "true";
        const duration = 2000; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for smooth deceleration
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = easedProgress * target;

            if (isDecimal) {
                el.textContent = currentValue.toFixed(1) + suffix;
            } else {
                // Format large numbers with commas for readability
                const formatted = Math.floor(currentValue).toLocaleString();
                el.textContent = formatted + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Observe the stats section
    const statsSection = document.getElementById("stats");
    if (statsSection) {
        const statsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !countersAnimated) {
                        countersAnimated = true;
                        statNumbers.forEach((el, index) => {
                            // Stagger each counter slightly
                            setTimeout(() => animateCounter(el), index * 200);
                        });
                        statsObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        statsObserver.observe(statsSection);
    }


    /* ============================================
       7. PROGRESS BAR ANIMATIONS
       ============================================
       Animate progress bars when the technology
       section scrolls into view.
    */
    const barFills = document.querySelectorAll(".bar-fill");
    let barsAnimated = false;

    const techSection = document.getElementById("technology");
    if (techSection) {
        const barsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !barsAnimated) {
                        barsAnimated = true;
                        barFills.forEach((bar, index) => {
                            setTimeout(() => {
                                bar.classList.add("animate");
                            }, index * 200);
                        });
                        barsObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        barsObserver.observe(techSection);
    }


    /* ============================================
       8. STICKY NAVBAR SCROLL EFFECT
       ============================================
       Adds a 'scrolled' class to the navbar when
       the page is scrolled past 50px.
    */
    const navbar = document.getElementById("navbar");

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleNavbarScroll, { passive: true });
    handleNavbarScroll();


    /* ============================================
       9. MOBILE HAMBURGER MENU
       ============================================ */
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }


    /* ============================================
       10. SMOOTH SCROLLING FOR ANCHOR LINKS
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });


    /* ============================================
       11. ACTIVE NAV LINK HIGHLIGHTING (SCROLL SPY)
       ============================================
       Updates the 'active' class on nav links with
       enhanced neon cyan glow when the corresponding
       section is in view.
    */
    const sections = document.querySelectorAll("section[id], footer[id]");
    const allNavLinks = document.querySelectorAll(".nav-link");

    function updateActiveLink() {
        const scrollPos = window.scrollY + 200;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                allNavLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();


    /* ============================================
       12. TIMELINE GLOW ANIMATION
       ============================================ */
    const timelineDots = document.querySelectorAll(".timeline-dot");

    const timelineObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("glow");
                }
            });
        },
        { threshold: 0.5 }
    );

    timelineDots.forEach((dot) => timelineObserver.observe(dot));


    /* ============================================
       13. FEATURE CARD 3D TILT EFFECT
       ============================================ */
    const featureCards = document.querySelectorAll(".feature-card");

    featureCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
        });
    });


    /* ============================================
       14. BUTTON RIPPLE EFFECT
       ============================================
       Adds an expanding ripple on click to all
       buttons for tactile, dynamic feedback.
    */
    const rippleButtons = document.querySelectorAll(".btn-primary, .btn-secondary, .cta-btn, .join-btn");

    rippleButtons.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            // Remove existing ripples
            const existingRipple = this.querySelector(".btn-ripple");
            if (existingRipple) existingRipple.remove();

            // Create new ripple element
            const ripple = document.createElement("span");
            ripple.classList.add("btn-ripple");

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = size + "px";
            ripple.style.height = size + "px";
            ripple.style.left = x + "px";
            ripple.style.top = y + "px";

            this.appendChild(ripple);

            // Clean up ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });


    /* ============================================
       15. CTA BACKGROUND PARALLAX
       ============================================ */
    const ctaSection = document.getElementById("cta");

    if (ctaSection) {
        const ctaBg = ctaSection.querySelector(".cta-bg-animation");

        if (ctaBg) {
            window.addEventListener("scroll", () => {
                const rect = ctaSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.top < windowHeight && rect.bottom > 0) {
                    const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                    ctaBg.style.transform = `translateY(${progress * 30 - 15}px)`;
                }
            }, { passive: true });
        }
    }

});
