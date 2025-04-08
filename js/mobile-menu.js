
document.addEventListener("DOMContentLoaded", () => {
  
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuToggle && navLinks) {
    
    mobileMenuToggle.addEventListener("click", (e) => {
      
      e.stopPropagation(); 
      navLinks.classList.toggle("active");
      mobileMenuToggle.classList.toggle("active"); 
    });

    
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".navbar") &&
        navLinks.classList.contains("active")
      ) {
        navLinks.classList.remove("active");
        mobileMenuToggle.classList.remove("active"); 
      }
    });

    
    const navLinkItems = navLinks.querySelectorAll("a");
    navLinkItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileMenuToggle.classList.remove("active"); 
      });
    });

    
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileMenuToggle.classList.remove("active");
      }
    });
  }
});
