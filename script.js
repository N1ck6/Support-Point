document.addEventListener('DOMContentLoaded', function() {
  initCustomerCarousel();
  initTestimonials();
  initProductItems();
  initAnimations();
  initSmoothScrolling();
});

function initCustomerCarousel() {
  const customerImages = [
    'data/carousel (1).png',
    'data/carousel (2).png',
    'data/carousel (3).png',
    'data/carousel (4).png',
    'data/carousel (5).png',
    'data/carousel (6).png',
    'data/carousel (7).png',
    'data/carousel (8).png',
    'data/carousel (9).png',
    'data/carousel (10).png'
  ];

  const carouselInner = document.querySelector('.carousel-inner');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  let currentIndex = 0;

  customerImages.forEach((imgSrc, index) => {
    const item = document.createElement('div');
    item.classList.add('carousel-item');
    if (index === 0) item.classList.add('active');
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `Happy customer ${index + 1}`;
    
    item.appendChild(img);
    carouselInner.appendChild(item);
  });

  updateCarousel();

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + customerImages.length) % customerImages.length;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % customerImages.length;
    updateCarousel();
  });

  setInterval(() => {
    currentIndex = (currentIndex + 1) % customerImages.length;
    updateCarousel();
  }, 6000);

  function updateCarousel() {
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
}

function initTestimonials() {
  const testimonials = [
    {
      content: "Since discovering Gentle Threads, I finally feel comfortable and confident in my clothing. No more itchy skin or reactions!",
      author: "Sarah M.",
      rating: 5
    },
    {
      content: "These are the only shirts I can wear without discomfort. The quality is amazing and they look so stylish too!",
      author: "Michael T.",
      rating: 5
    },
    {
      content: "As someone with severe HIA, finding Gentle Threads has been life-changing. I can finally focus on my day instead of my discomfort.",
      author: "Jennifer L.",
      rating: 5
    },
    {
      content: "The fabrics are incredibly soft and breathable. I've recommended these to everyone in my HIA support group!",
      author: "David K.",
      rating: 5
    },
    {
      content: "Not only are these clothes perfect for my sensitive skin, but they're also stylish enough for work meetings. Thank you!",
      author: "Emma R.",
      rating: 5
    }
  ];

  const testimonialContainer = document.querySelector('.testimonial-container');
  const dotsContainer = document.querySelector('.carousel-dots');
  let currentTestimonial = 0;

  testimonials.forEach((testimonial, index) => {
    const slide = document.createElement('div');
    slide.classList.add('testimonial-slide');
    if (index === 0) slide.classList.add('active');

    const content = document.createElement('p');
    content.classList.add('testimonial-content');
    content.textContent = testimonial.content;

    const author = document.createElement('p');
    author.classList.add('testimonial-author');
    author.textContent = testimonial.author;

    const rating = document.createElement('div');
    rating.classList.add('testimonial-rating');
    rating.innerHTML = '★'.repeat(testimonial.rating);

    slide.appendChild(content);
    slide.appendChild(author);
    slide.appendChild(rating);
    testimonialContainer.appendChild(slide);

    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentTestimonial = index;
      updateTestimonial();
    });
    dotsContainer.appendChild(dot);
  });

  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
  }, 5000);

  function updateTestimonial() {
    const slides = document.querySelectorAll('.testimonial-slide');
    slides.forEach((slide, index) => {
      if (index === currentTestimonial) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      if (index === currentTestimonial) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

function initProductItems() {
  const products = [
    {
      id: 1,
      name: "Organic Cotton T-Shirt",
      price: "$34.99",
      image: "data/item (1).jpg",
      shortDesc: "Ultra-soft organic cotton, perfect for sensitive skin.",
      fullDesc: "Our signature organic cotton t-shirt is specifically designed for people with Histamine Intolerance. Made from 100% GOTS-certified organic cotton, it's free from harmful chemicals and dyes that could trigger reactions.",
      features: [
        "100% organic cotton",
        "No chemical treatments",
        "Hypoallergenic dyes",
        "Tagless design to prevent irritation",
        "Available in sizes XS-XXL"
      ]
    },
    {
      id: 2,
      name: "Bamboo Blend Long-Sleeve",
      price: "$42.99",
      image: "data/item (2).jpg",
      shortDesc: "Cooling bamboo blend that's gentle on sensitive skin.",
      fullDesc: "Experience the luxurious comfort of our bamboo-blend long sleeve shirt. Bamboo fabric is naturally anti-bacterial and temperature regulating, making it ideal for those with skin sensitivities.",
      features: [
        "70% bamboo, 30% organic cotton",
        "Naturally antibacterial",
        "Moisture-wicking properties",
        "Temperature regulating",
        "Extended cuffs for comfort"
      ]
    },
    {
      id: 3,
      name: "Linen Button-Up Shirt",
      price: "$49.99",
      image: "data/item (3).jpg",
      shortDesc: "Breathable linen shirt for everyday comfort.",
      fullDesc: "Our linen button-up offers unparalleled breathability and comfort. Made from pure European flax, this shirt is processed without harsh chemicals, making it perfect for those with histamine sensitivity.",
      features: [
        "100% natural linen",
        "Eco-friendly processing",
        "Coconut shell buttons",
        "Relaxed fit for comfort",
        "Pre-washed for softness"
      ]
    },
    {
      id: 4,
      name: "Modal Lounge Tee",
      price: "$39.99",
      image: "data/item (4).jpg",
      shortDesc: "Ultra-soft modal fabric for all-day comfort.",
      fullDesc: "Our Modal Lounge Tee is crafted from beechwood trees using an eco-friendly process. The result is an incredibly soft, lightweight fabric that feels amazing against sensitive skin.",
      features: [
        "100% modal fabric",
        "Silky-soft texture",
        "Highly breathable",
        "Biodegradable material",
        "Minimal seams for comfort"
      ]
    },
    {
      id: 5,
      name: "Hemp Blend Casual Shirt",
      price: "$45.99",
      image: "data/item (5).jpg",
      shortDesc: "Durable hemp blend that gets softer with each wash.",
      fullDesc: "Our hemp blend shirt combines sustainability with comfort. Hemp requires no pesticides to grow and becomes softer with each wash, making this shirt a long-lasting addition to your wardrobe.",
      features: [
        "55% hemp, 45% organic cotton",
        "Pesticide-free production",
        "Naturally UV resistant",
        "Durable construction",
        "Gets softer over time"
      ]
    }
  ];

  const itemsGrid = document.querySelector('.items-grid');
  const modal = document.getElementById('item-modal');
  const closeModal = document.querySelector('.close-modal');
  const modalBody = document.querySelector('.modal-body');

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('item-card');
    card.setAttribute('data-id', product.id);
    
    card.innerHTML = `
      <div class="item-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="item-info">
        <h3 class="item-title">${product.name}</h3>
        <p class="item-price">${product.price}</p>
        <p class="item-description">${product.shortDesc}</p>
      </div>
    `;
    
    card.addEventListener('click', () => showProductModal(product));
    itemsGrid.appendChild(card);
  });

  closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  });

  window.addEventListener('click', event => {
    if (event.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  });

  function showProductModal(product) {
    modalBody.innerHTML = `
      <div class="modal-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="modal-details">
        <h3 class="modal-title">${product.name}</h3>
        <p class="modal-price">${product.price}</p>
        <p class="modal-description">${product.fullDesc}</p>
        
        <div class="product-features">
          <h4>Features:</h4>
          <ul>
            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <button class="btn modal-btn">Add to Cart</button>
      </div>
    `;
    
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }
}

function initAnimations() {
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }

  const sections = document.querySelectorAll('section');
  const itemCards = document.querySelectorAll('.item-card');
  
  window.addEventListener('scroll', () => {
    sections.forEach(section => {
      if (isInViewport(section) && !section.classList.contains('animated')) {
        section.classList.add('slide-up', 'animated');
      }
    });
    
    itemCards.forEach((card, index) => {
      if (isInViewport(card) && !card.classList.contains('animated')) {
        setTimeout(() => {
          card.classList.add('fade-in', 'animated');
        }, index * 100);
      }
    });
  });
  
  window.dispatchEvent(new Event('scroll'));
}

function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: 'smooth'
      });
    });
  });
}
