document.addEventListener('DOMContentLoaded', function() {
  initImageScroller();
  initTestimonials();
  initProductItems();
  initAnimations();
  initSmoothScrolling();
  initCart();
  initNotificationSystem();
  initNewsletterForm();
  loadUserDesigns();
});

// Notification System
function initNotificationSystem() {
  // Already initialized through structure, just provide the function to show notifications
}

function showNotification(message, type = 'info') {
  const notificationContainer = document.querySelector('.notification-container');
  
  const notification = document.createElement('div');
  notification.classList.add('notification', type);
  notification.textContent = message;
  
  notificationContainer.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto remove after 2 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}

// Cart System
function initCart() {
  // Load cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartCounter(cart.length);
  
  // Cart icon click event
  const cartIcon = document.getElementById('cart-icon');
  const cartModal = document.getElementById('cart-modal');
  const closeCartModal = cartModal.querySelector('.close-modal');
  
  cartIcon.addEventListener('click', () => {
    updateCartView();
    cartModal.style.display = 'flex';
    setTimeout(() => {
      cartModal.classList.add('show');
    }, 10);
  });
  
  closeCartModal.addEventListener('click', () => {
    cartModal.classList.remove('show');
    setTimeout(() => {
      cartModal.style.display = 'none';
    }, 300);
  });
  
  window.addEventListener('click', event => {
    if (event.target === cartModal) {
      cartModal.classList.remove('show');
      setTimeout(() => {
        cartModal.style.display = 'none';
      }, 300);
    }
  });
  
  // Checkout button
  const checkoutBtn = document.querySelector('.checkout-btn');
  checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
      // Clear cart and show thank you notification
      cart = [];
      saveCart(cart);
      updateCartCounter(0);
      updateCartView();
      showNotification('Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время.', 'success');
      
      cartModal.classList.remove('show');
      setTimeout(() => {
        cartModal.style.display = 'none';
      }, 300);
    }
  });
}

function updateCartCounter(count) {
  const cartCounter = document.querySelector('.cart-counter');
  cartCounter.textContent = count;
  
  // Hide counter if cart is empty
  if (count === 0) {
    cartCounter.style.display = 'none';
  } else {
    cartCounter.style.display = 'flex';
  }
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if product already in cart
  const existingProductIndex = cart.findIndex(item => 
    item.id === product.id && 
    JSON.stringify(item.customTexture) === JSON.stringify(product.customTexture)
  );
  
  if (existingProductIndex !== -1) {
    // Increment quantity
    cart[existingProductIndex].quantity += 1;
  } else {
    // Add new product
    product.quantity = 1;
    cart.push(product);
  }
  
  saveCart(cart);
  updateCartCounter(cart.reduce((total, item) => total + item.quantity, 0));
  showNotification('Товар добавлен в корзину', 'success');
}

function updateCartView() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotal = document.querySelector('.cart-total');
  
  // Clear current items
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <p>Ваша корзина пуста</p>
        <a href="#items" class="btn primary-btn">Перейти к покупкам</a>
      </div>
    `;
    cartTotal.textContent = 'Итого: 0Р';
    return;
  }
  
  let totalPrice = 0;
  
  cart.forEach(item => {
    const priceValue = parseInt(item.price.replace(/\D/g, ''));
    const itemTotal = priceValue * item.quantity;
    totalPrice += itemTotal;
    
    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('cart-item');
    
    // Determine image source
    let imgSrc = item.image;
    if (item.customTexture) {
      // For custom items, use the angle view with applied texture
      imgSrc = item.customTexture.previewImage || item.image;
    }
    
    cartItemElement.innerHTML = `
      <div class="cart-item-image">
        <img src="${imgSrc}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <p class="cart-item-price">${item.price}</p>
        ${item.customTexture ? '<p class="cart-item-custom">Персонализированный дизайн</p>' : ''}
      </div>
      <div class="cart-item-actions">
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease" data-index="${cart.indexOf(item)}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn increase" data-index="${cart.indexOf(item)}">+</button>
        </div>
        <button class="remove-btn" data-index="${cart.indexOf(item)}">Удалить</button>
      </div>
    `;
    
    cartItemsContainer.appendChild(cartItemElement);
  });
  
  // Update total price
  cartTotal.textContent = `Итого: ${totalPrice}Р`;
  
  // Add event listeners to quantity and remove buttons
  document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      decreaseQuantity(index);
    });
  });
  
  document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      increaseQuantity(index);
    });
  });
  
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      removeFromCart(index);
    });
  });
}

function decreaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
    saveCart(cart);
    updateCartView();
    updateCartCounter(cart.reduce((total, item) => total + item.quantity, 0));
  } else {
    removeFromCart(index);
  }
}

function increaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart[index].quantity += 1;
  saveCart(cart);
  updateCartView();
  updateCartCounter(cart.reduce((total, item) => total + item.quantity, 0));
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  saveCart(cart);
  updateCartView();
  updateCartCounter(cart.reduce((total, item) => total + item.quantity, 0));
  showNotification('Товар удален из корзины', 'info');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Newsletter form
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');
  
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    if (email) {
      // Here you would normally send the email to your backend
      // But for this demo, we'll just clear the form and show a notification
      emailInput.value = '';
      showNotification('Спасибо за подписку!', 'success');
    }
  });
}

// Horizontal Image Scroller (replacing carousel)
function initImageScroller() {
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

  const scrollerContainer = document.querySelector('.image-scroller');
  
  // Create double set of images for infinite scrolling effect
  const allImages = [...customerImages, ...customerImages];
  
  allImages.forEach(imgSrc => {
    const item = document.createElement('div');
    item.classList.add('scroller-item');
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = "Счастливый клиент";
    
    item.appendChild(img);
    scrollerContainer.appendChild(item);
  });
  
  // Set initial position and width
  const scrollerWidth = customerImages.length * 265; // 250px width + 15px margin
  scrollerContainer.style.width = `${scrollerWidth * 2}px`; // Double for the duplicate set
  
  // Animate the scroller
  let position = 0;
  const speed = 0.5; // pixels per frame
  
  function animateScroller() {
    position -= speed;
    
    // Reset position when first set of images has scrolled past
    if (position <= -scrollerWidth) {
      position = 0;
    }
    
    scrollerContainer.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animateScroller);
  }
  
  animateScroller();
}

function initTestimonials() {
  const testimonials = [
    {
      content: "С тех пор, как я открыла для себя Точку Опоры, я наконец-то чувствую себя комфортно и уверенно в своей одежде. Больше никакой зудящей кожи или аллергических реакций!",
      author: "Алиса С.",
      rating: 5
    },
    {
      content: "Это единственные рубашки, которые я могу носить без дискомфорта. Качество потрясающее, и они выглядят очень стильно!",
      author: "Михаил Т.",
      rating: 5
    },
    {
      content: "Для меня, человека с тяжёлой формой синдрома Гийена-Барре, знакомство с Точкой Опоры изменило жизнь. Я наконец-то могу сосредоточиться на своём сне, а не на дискомфорте.",
      author: "Марина Л.",
      rating: 5
    },
    {
      content: "Ткань невероятно мягкая и дышащая. Я уже порекомендовала этот сайт всем моим друзьям в нашей группе для поддержки людей с ОВЗ!",
      author: "Антон Б.",
      rating: 5
    },
    {
      content: "Эта одежда не только идеально подходит для моей чувствительной кожи, но и достаточно стильная для рабочих встреч. Спасибо!",
      author: "Настя Ю.",
      rating: 5
    },
    {
      content: "Заказываю уже третий раз и каждый раз восхищаюсь качеством! Одежда не вызывает раздражения даже после целого дня ношения.",
      author: "Дмитрий К.",
      rating: 5
    },
    {
      content: "Как мама ребенка с аутизмом, я очень требовательна к тканям. Ваши вещи - единственные, которые он соглашается носить без капризов!",
      author: "Елена В.",
      rating: 5
    },
    {
      content: "Наконец-то нашла одежду, которая не выглядит медицинской, но при этом учитывает все мои потребности. Это просто чудо!",
      author: "Ольга П.",
      rating: 5
    },
    {
      content: "После инсульта сложно подобрать удобную одежду. Ваши вещи с магнитными застежками - настоящее спасение!",
      author: "Сергей М.",
      rating: 5
    },
    {
      content: "Заказывала платье для свадьбы - выглядело потрясающе и было невероятно удобным! Никаких компромиссов между красотой и комфортом.",
      author: "Ангелина Р.",
      rating: 5
    },
    {
      content: "Как стилист с 10-летним стажем, я рекомендую Точку Опоры всем клиентам с особенными потребностями. Качество на уровне люксовых брендов!",
      author: "Артем Ж.",
      rating: 5
    },
    {
      content: "Ваш 3D-конфигуратор - гениальное решение! Впервые смогла создать идеально подходящую мне вещь без примерок.",
      author: "Виктория Ч.",
      rating: 5
    },
    {
      content: "После операции долго не мог найти подходящую одежду. Ваши вещи помогли вернуть уверенность в себе!",
      author: "Игорь С.",
      rating: 5
    },
    {
      content: "Купила бабушке с артритом блузку - теперь она может одеваться самостоятельно. Слезы радости бесценны!",
      author: "Арина Д.",
      rating: 5
    },
    {
      content: "Работаю врачом и ценю гигиеничность ваших тканей. Теперь рекомендую пациентам с дерматитами!",
      author: "Глеб Н.",
      rating: 5
    },
    {
      content: "Ваш сервис достоин отдельной благодарности! Помогли подобрать размер и оформили срочную доставку перед важным мероприятием.",
      author: "Элина Т.",
      rating: 5
    },
    {
      content: "Как спортсмен с протезом, оценил специальные модели - не натирают и отводят влагу лучше специализированных брендов!",
      author: "Роман З.",
      rating: 5
    },
    {
      content: "Для моего ребенка с ДЦП нашли идеальные брюки - мягкие, с регулируемой талией. Теперь заказываем только у вас!",
      author: "Светлана У.",
      rating: 5
    },
    {
      content: "После мастэктомии сложно подобрать красивое бельё. Ваши варианты вернули мне женственность и уверенность!",
      author: "Юлия К.",
      rating: 5
    },
    {
      content: "Как организатор доступной среды, включаю ваш магазин в список must-have для подопечных. Сочетание цены и качества идеально!",
      author: "Павел Ш.",
      rating: 5
    },
    {
      content: "Впервые за 15 лет нашла пижаму, которая не вызывает ночного зуда. Благодарю за внимание к деталям!",
      author: "Лариса Г.",
      rating: 5
    },
    {
      content: "Ваш сайт - образец доступности! Все продумано для людей с разными формами инвалидности. Браво команде!",
      author: "Максим В.",
      rating: 5
    },
    {
      content: "Заказал 5 вещей - все идеально сели по фигуре, несмотря на нестандартные пропорции из-за сколиоза.",
      author: "Артур П.",
      rating: 5
    },
    {
      content: "Как эксперт по инклюзивному дизайну, ставлю вашему проекту высший балл. Вы задаете новые стандарты в индустрии!",
      author: "Мария Л.",
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
      name: "Кофта из органического хлопка",
      price: "3499Р",
      image: "data/item (1).jpg",
      image2: "data/item1 (1).jpg",
      shortDesc: "Сверхмягкий органический хлопок, идеально подходит для чувствительной кожи.",
      fullDesc: "Эта кофта из органического хлопка создана с заботой о людях с гистаминовой непереносимостью. Изготовлена из 100% органического хлопка, сертифицированного по стандарту GOTS, что гарантирует отсутствие химикатов и минимизирует возможные реакции.",
      features: [
        "100% органический хлопок",
        "Без вредных химикатов и красителей",
        "Гипоаллергенные красители",
        "Бесшовный дизайн для комфорта",
        "Доступна в размерах M-XXL"
      ]
    },
    {
      id: 2,
      name: "Лонгслив из бамбуковой ткани",
      price: "4299Р",
      image: "data/item (2).jpg",
      image2: "data/item1 (2).jpg",
      shortDesc: "Охлаждающая бамбуковая ткань, нежная для чувствительной кожи.",
      fullDesc: "Насладитесь максимальным комфортом с нашим лонгсливом из бамбуковой ткани. Натуральные свойства бамбука обеспечивают антибактериальный эффект и терморегуляцию, что делает его идеальным для людей с чувствительной кожей.",
      features: [
        "70% бамбук, 30% органический хлопок",
        "Натуральная антибактериальная ткань",
        "Влагоотводящие свойства",
        "Терморегуляция",
        "Удлиненные манжеты для дополнительного комфорта"
      ]
    },
    {
      id: 3,
      name: "Рубашка из льна",
      price: "4999Р",
      image: "data/item (3).jpg",
      image2: "data/item1 (3).jpg",
      shortDesc: "Дышащая льняная рубашка для повседневного комфорта.",
      fullDesc: "Наша льняная рубашка обеспечивает непревзойденную воздухопроницаемость и комфорт. Изготовлена из чистого европейского льна с экологически чистой обработкой, что делает ее безопасной и удобной для людей с чувствительностью к гистамину.",
      features: [
        "100% натуральный лен",
        "Обработана без агрессивных химикатов",
        "Экологичные пуговицы из кокосовой скорлупы",
        "Свободный крой для комфорта в течение всего дня",
        "Предварительно выстирана для мягкости"
      ]
    },
    {
      id: 4,
      name: "Блузка из модала",
      price: "3999Р",
      image: "data/item (4).jpg",
      image2: "data/item1 (4).jpg",
      shortDesc: "Сверхмягкая ткань из модала для комфорта в течение всего дня.",
      fullDesc: "Блузка из модала изготовлена из волокон буковой древесины с использованием экологичного процесса. Результат — невероятно мягкая, легкая ткань, которая нежно соприкасается с чувствительной кожей.",
      features: [
        "100% модал",
        "Шелковистая текстура",
        "Высокая воздухопроницаемость",
        "Биоразлагаемый материал",
        "Минимальное количество швов для комфорта"
      ]
    },
    {
      id: 5,
      name: "Повседневная рубашка из льна",
      price: "4599Р",
      image: "data/item (5).jpg",
      image2: "data/item1 (5).jpg",
      shortDesc: "Прочная ткань из льна, которая становится мягче с каждой стиркой.",
      fullDesc: "Наша повседневная рубашка из льна сочетает устойчивость и комфорт. Лен выращивается без пестицидов и становится мягче с каждой стиркой, что делает ее долговечным выбором для вашего гардероба.",
      features: [
        "55% лен, 45% органический хлопок",
        "Производство без пестицидов",
        "Естественная защита от УФ-излучения",
        "Прочная конструкция для долговечности",
        "Становится мягче со временем"
      ]
    },
    {
      id: 6,
      name: "Создайте свой собственный дизайн",
      price: "5999Р",
      image: "data/item (5).jpg", // Using a placeholder image initially
      shortDesc: "Разработайте свою уникальную одежду с помощью нашего 3D конфигуратора.",
      fullDesc: "Наш уникальный 3D конфигуратор позволяет вам создать индивидуальный дизайн одежды. Загрузите свое изображение или фотографию, и мы применим ее в качестве текстуры к вашей одежде. Создайте что-то уникальное, что отражает вашу индивидуальность.",
      features: [
        "Полностью настраиваемый дизайн",
        "Высококачественная печать вашего изображения",
        "Гипоаллергенные чернила и ткани",
        "Сохраняйте свои дизайны для будущих заказов",
        "Доступны различные стили и фасоны"
      ],
      is3DCustomizable: true
    }
  ];

  const itemsGrid = document.querySelector('.items-grid');
  const modal = document.getElementById('item-modal');
  const closeModal = document.querySelector('#item-modal .close-modal');
  const modalBody = document.querySelector('#item-modal .modal-body');

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
    // Create modal content based on product type
    if (product.is3DCustomizable) {
      show3DCustomizableProduct(product);
    } else {
      showRegularProduct(product);
    }
    
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }

  function showRegularProduct(product) {
    const hasSecondImage = !!product.image2;
    
    modalBody.innerHTML = `
      <div class="modal-image">
        <div class="image-gallery">
          <img src="${product.image}" alt="${product.name}" id="product-gallery-img">
          ${hasSecondImage ? `
            <div class="gallery-controls">
              <div class="gallery-arrow gallery-prev">&lt;</div>
              <div class="gallery-arrow gallery-next">&gt;</div>
            </div>
          ` : ''}
        </div>
        <div class="threed-container" id="threed-view-container">
          <!-- 3D view will be inserted here by JavaScript -->
        </div>
      </div>
      <div class="modal-details">
        <h3 class="modal-title">${product.name}</h3>
        <p class="modal-price">${product.price}</p>
        <p class="modal-description">${product.fullDesc}</p>
        
        <div class="product-features">
          <h4>Особенности:</h4>
          <ul>
            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <button class="btn modal-btn add-to-cart">В корзину</button>
        <button class="btn modal-btn view-3d">3D вид</button>
      </div>
    `;
    
    // Set up gallery navigation if second image exists
    if (hasSecondImage) {
      const galleryImg = document.getElementById('product-gallery-img');
      const prevArrow = document.querySelector('.gallery-prev');
      const nextArrow = document.querySelector('.gallery-next');
      
      let currentImageIndex = 0;
      const productImages = [product.image, product.image2];
      
      prevArrow.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
        galleryImg.src = productImages[currentImageIndex];
      });
      
      nextArrow.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % productImages.length;
        galleryImg.src = productImages[currentImageIndex];
      });
    }
    
    // Set up 3D view button
    const view3DBtn = document.querySelector('.view-3d');
    const imageGallery = document.querySelector('.image-gallery');
    const threedContainer = document.getElementById('threed-view-container');
    
    view3DBtn.addEventListener('click', () => {
      if (view3DBtn.classList.contains('active')) {
        // Switch back to image gallery
        view3DBtn.classList.remove('active');
        threedContainer.classList.remove('show');
        imageGallery.style.display = 'block';
      } else {
        // Switch to 3D view
        view3DBtn.classList.add('active');
        imageGallery.style.display = 'none';
        threedContainer.classList.add('show');
        
        // Initialize 3D viewer if not already initialized
        if (!threedContainer.hasChildNodes()) {
          init3DViewer(threedContainer, product, false);
        }
      }
    });
    
    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
      addToCart(product);
    });
  }

  function show3DCustomizableProduct(product) {
    modalBody.innerHTML = `
      <div class="modal-image">
        <div class="threed-container show" id="threed-view-container">
          <!-- 3D view will be inserted here by JavaScript -->
        </div>
        <div class="drop-zone" id="texture-drop-zone">
          <p>Перетащите изображение сюда или нажмите для выбора файла</p>
          <input type="file" id="texture-upload" accept="image/*" style="display: none;">
        </div>
      </div>
      <div class="modal-details">
        <h3 class="modal-title">${product.name}</h3>
        <p class="modal-price">${product.price}</p>
        <p class="modal-description">${product.fullDesc}</p>
        
        <div class="product-features">
          <h4>Особенности:</h4>
          <ul>
            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <button class="btn modal-btn add-to-cart">В корзину</button>
        <button class="btn modal-btn save-design">Сохранить дизайн</button>
      </div>
    `;
    
    // Initialize 3D viewer
    const threedContainer = document.getElementById('threed-view-container');
    const uploadedTexture = init3DViewer(threedContainer, product, true);
    
    // Set up file drop zone
    const dropZone = document.getElementById('texture-drop-zone');
    const fileInput = document.getElementById('texture-upload');
    
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('active');
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('active');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('active');
      
      if (e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    });
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });
    
    function handleFileUpload(file) {
      // Check file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        showNotification('Файл слишком большой. Максимальный размер 20МБ.', 'error');
        return;
      }
      
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        showNotification('Пожалуйста, загрузите файл изображения.', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          // Apply texture to 3D model
          uploadedTexture.image = img;
          uploadedTexture.needsUpdate = true;
          
          // Store texture data in product for cart
          product.customTexture = {
            dataUrl: e.target.result,
            previewImage: e.target.result // Using the same image for preview
          };
          
          showNotification('Текстура успешно применена!', 'success');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    
    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
      if (!product.customTexture) {
        showNotification('Пожалуйста, загрузите изображение перед добавлением в корзину.', 'error');
        return;
      }
      addToCart(product);
    });
    
    // Save design button
    const saveDesignBtn = document.querySelector('.save-design');
    saveDesignBtn.addEventListener('click', () => {
      if (!product.customTexture) {
        showNotification('Пожалуйста, загрузите изображение перед сохранением дизайна.', 'error');
        return;
      }
      
      // Generate unique ID for the design
      const designId = Date.now();
      const designName = `Дизайн #${designId}`;
      
      // Create new product object based on the custom design
      const customProduct = {
        id: `custom-${designId}`,
        name: designName,
        price: product.price,
        image: product.customTexture.previewImage,
        shortDesc: "Ваш персональный дизайн",
        fullDesc: "Персонализированная одежда с вашим собственным дизайном.",
        features: product.features,
        customTexture: product.customTexture,
        is3DCustomizable: true
      };
      
      // Save to localStorage
      saveUserDesign(customProduct);
      
      showNotification('Ваш дизайн сохранен!', 'success');
    });
  }
  
  // Initialize 3D Model Viewer
  function init3DViewer(container, product, isCustomizable) {
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Set up lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);
    
    // Create a simple coat geometry (using a box for simplicity)
    // In a real application, you would load a proper 3D model of a coat
    const geometry = new THREE.BoxGeometry(3, 4, 1);
    
    // Create base texture and material
    const texture = new THREE.Texture();
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.7,
      metalness: 0.0
    });
    
    // Create coat mesh
    const coat = new THREE.Mesh(geometry, material);
    scene.add(coat);
    
    // Set up orbit controls for rotation
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.5;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.minPolarAngle = Math.PI / 2.5;
    
    // Limit rotation to horizontal only
    controls.minAzimuthAngle = -Math.PI / 3;
    controls.maxAzimuthAngle = Math.PI / 3;
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (container.clientWidth > 0 && container.clientHeight > 0) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    });
    
    // Load default texture if this is customizable
    if (isCustomizable) {
      // Default solid color texture
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#b6c9d6';
      ctx.fillRect(0, 0, 512, 512);
      
      const defaultImage = new Image();
      defaultImage.onload = function() {
        texture.image = defaultImage;
        texture.needsUpdate = true;
      };
      defaultImage.src = canvas.toDataURL();
    } else {
      // Load product texture
      const productImage = new Image();
      productImage.onload = function() {
        texture.image = productImage;
        texture.needsUpdate = true;
      };
      productImage.src = product.image;
    }
    
    return texture;
  }
}

// User Design Storage and Display
function saveUserDesign(designProduct) {
  let designs = JSON.parse(localStorage.getItem('userDesigns')) || [];
  designs.push(designProduct);
  localStorage.setItem('userDesigns', JSON.stringify(designs));
  
  // Refresh the user designs display
  loadUserDesigns();
}

function loadUserDesigns() {
  const designs = JSON.parse(localStorage.getItem('userDesigns')) || [];
  const designsGrid = document.querySelector('.user-designs-grid');
  
  // Clear the grid
  designsGrid.innerHTML = '';
  
  // Hide the section if no designs
  const userDesignsSection = document.querySelector('.user-designs');
  userDesignsSection.style.display = designs.length > 0 ? 'block' : 'none';
  
  if (designs.length === 0) return;
  
  // Add each design to the grid
  designs.forEach(design => {
    const card = document.createElement('div');
    card.classList.add('design-card');
    
    card.innerHTML = `
      <div class="design-image">
        <img src="${design.image}" alt="${design.name}">
      </div>
      <div class="design-info">
        <h3 class="design-title">${design.name}</h3>
        <p class="design-price">${design.price}</p>
      </div>
    `;
    
    card.addEventListener('click', () => {
      const modal = document.getElementById('item-modal');
      const modalBody = document.querySelector('#item-modal .modal-body');
      
      modalBody.innerHTML = `
        <div class="modal-image">
          <div class="threed-container show" id="threed-view-container">
            <!-- 3D view will be inserted here by JavaScript -->
          </div>
        </div>
        <div class="modal-details">
          <h3 class="modal-title">${design.name}</h3>
          <p class="modal-price">${design.price}</p>
          <p class="modal-description">${design.fullDesc}</p>
          
          <div class="product-features">
            <h4>Особенности:</h4>
            <ul>
              ${design.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
          
          <button class="btn modal-btn add-saved-to-cart">В корзину</button>
        </div>
      `;
      
      // Initialize 3D viewer with saved texture
      const threedContainer = document.getElementById('threed-view-container');
      init3DViewer(threedContainer, design, false);
      
      // Add to cart functionality
      const addToCartBtn = document.querySelector('.add-saved-to-cart');
      addToCartBtn.addEventListener('click', () => {
        addToCart(design);
        
        modal.classList.remove('show');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      });
      
      modal.style.display = 'flex';
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
    });
    
    designsGrid.appendChild(card);
  });
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