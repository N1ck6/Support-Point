document.addEventListener('DOMContentLoaded', function() {
  initImageScroller();
  initTestimonials();
  initProductItems();
  initAnimations();
  initSmoothScrolling();
  initCart();
  initNewsletterForm();
  loadUserDesigns();
});

function showNotification(message, type = 'info') {
  const notificationContainer = document.querySelector('.notification-container');
  
  const notification = document.createElement('div');
  notification.classList.add('notification', type);
  notification.textContent = message;
  
  notificationContainer.appendChild(notification);
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}

function initCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartCounter(cart.length);
  
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
  
  const checkoutBtn = document.querySelector('.checkout-btn');
  checkoutBtn.addEventListener('click', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length > 0) {
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
  
  if (count === 0) {
    cartCounter.style.display = 'none';
  } else {
    cartCounter.style.display = 'flex';
  }
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const existingProductIndex = cart.findIndex(item => 
    item.id === product.id && 
    JSON.stringify(item.customTexture) === JSON.stringify(product.customTexture)
  );
  
  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
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
  const checkoutBtn = document.querySelector('.checkout-btn');
  
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <p>Ваша корзина пуста</p>
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
    
    let imgSrc = item.image;
    if (item.customTexture) {
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
  cartTotal.textContent = `Итого: ${totalPrice}Р`;
  
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

function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');
  
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    if (email) {
      emailInput.value = '';
      showNotification('Спасибо за подписку!', 'success');
    }
  });
}

function initImageScroller() {
  const customerImages = [
    'data/carousel (1).jpg',
    'data/carousel (2).jpg',
    'data/carousel (3).jpg',
    'data/carousel (4).jpg',
    'data/carousel (5).jpg',
    'data/carousel (6).jpg',
    'data/carousel (7).jpg',
    'data/carousel (8).jpg',
    'data/carousel (9).jpg',
    'data/carousel (10).jpg'
  ];

  const scrollerContainer = document.querySelector('.image-scroller');
  const allImages = [...customerImages, ...customerImages];
  allImages.forEach(imgSrc => {
    const item = document.createElement('div');
    item.classList.add('scroller-item');
    const img = document.createElement('img');
    img.src = imgSrc;
    item.appendChild(img);
    scrollerContainer.appendChild(item);
  });
  
  const scrollerWidth = customerImages.length * 265;
  scrollerContainer.style.width = `${scrollerWidth * 2}px`;
  
  let position = 0;
  const speed = 0.5;
  
  function animateScroller() {
    position -= speed;
    
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
  const light_top = [
    {
      id: 1,
      name: "Кофта из органического хлопка",
      price: "3 150Р",
      image: "data/item (1).jpg",
      image2: "data/item1 (1).jpg",
      texture: "data/texture item (1).jpg",
      model: "data/Shirt.gltf",
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
      price: "2 520Р",
      image: "data/item (2).jpg",
      image2: "data/item1 (2).jpg",
      texture: "data/texture item (2).jpg",
      model: "data/coat.gltf",
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
      price: "4 050Р",
      image: "data/item (3).jpg",
      image2: "data/item1 (3).jpg",
      texture: "data/texture item (3).jpg",
      model: "data/coat.gltf",
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
      price: "2 700Р",
      image: "data/item (4).jpg",
      image2: "data/item1 (4).jpg",
      texture: "data/texture item (4).jpg",
      model: "data/Shirt.gltf",
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
      price: "3 150Р",
      image: "data/item (5).jpg",
      image2: "data/item1 (5).jpg",
      texture: "data/texture item (5).jpg",
      model: "data/coat.gltf",
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
      price: "4 500Р",
      image: "data/custom_clothes.png",
      texture: "data/texture basic.jpg",
      model: "data/coat.gltf",
      shortDesc: "Разработайте свою уникальную одежду с помощью нашего 3D конфигуратора.",
      fullDesc: "Наш уникальный 3D конфигуратор позволяет вам создать индивидуальный дизайн одежды. Загрузите свое изображение, и мы применим его в качестве текстуры к вашей одежде. Сразу после покупки свяжемся с вами и уточним все необходимые детали.",
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
  
  const warm_top = [
    {
    id: 1,
    name: "Парка с магнитными застежками",
    price: "6 300Р",
      image: "data/item (6).png",
      image2: "data/item1 (6).png",
      texture: "data/texture item (6).jpg",
      model: "data/coat.gltf",
    shortDesc: "Утепленная парка с магнитными застежками вместо пуговиц. Для людей с артритом.",
    fullDesc: "Парка из водоотталкивающей ткани с термоподкладкой. Магнитные застежки расположены вдоль всей длины, что позволяет легко одеваться одной рукой. Усиленные плечевые швы для ношения рюкзака.",
    features: [
      "Магнитные застежки по всей длине",
      "Съемная подкладка из термофлиса",
      "Усиленные швы на плечах",
      "Карманы с подогревом",
      "Регулируемый капюшон"
    ]
  },
  {
    id: 2,
    name: "Утепленная куртка с регулируемым капюшоном",
    price: "7 200Р",
      image: "data/item (7).png",
      image2: "data/item1 (7).png",
      texture: "data/texture item (7).jpg",
      model: "data/Shirt.gltf",
    shortDesc: "Куртка для колясочников с удлиненной спинкой.",
    fullDesc: "Куртка из мембранной ткани с удлиненной спинкой, предотвращающей задирание при сидении. Капюшон регулируется одной рукой. Внутренние карманы для лекарств.",
    features: [
      "Удлиненная спинка (+15 см)",
      "Молния с крупным бегунком",
      "Водоотталкивающая ткань",
      "Светоотражающие элементы",
      "Ветрозащитная юбка"
    ]
  },
  {
    id: 3,
    name: "Жилет с бесшовными боковыми швами",
    price: "3 600Р",
      image: "data/item (8).png",
      image2: "data/item1 (8).png",
      texture: "data/texture item (8).jpg",
      model: "data/Vest.gltf",
    shortDesc: "Бесшовный жилет для людей с аутизмом.",
    fullDesc: "Жилет из мягкого хлопка без боковых швов. Магнитные застежки спереди. Карманы расположены на уровне груди для удобства доступа.",
    features: [
      "Бесшовная конструкция",
      "Гипоаллергенная ткань",
      "Карманы с магнитными клапанами",
      "Регулируемая ширина",
      "4 размера (XS-XXL)"
    ]
  },
  {
    id: 6,
    name: "Создайте свой собственный дизайн",
    price: "4 500Р",
    image: "data/custom_clothes.png",
    texture: "data/texture basic.jpg",
    model: "data/coat.gltf",
    shortDesc: "Разработайте свою уникальную одежду с помощью нашего 3D конфигуратора.",
    fullDesc: "Наш уникальный 3D конфигуратор позволяет вам создать индивидуальный дизайн одежды. Загрузите свое изображение, и мы применим его в качестве текстуры к вашей одежде. Сразу после покупки свяжемся с вами и уточним все необходимые детали.",
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

  const light_bottom = [
    {
    id: 1,
    name: "Шорты с боковыми молниями",
    price: "2 250Р",
      image: "data/item (9).png",
      image2: "data/item1 (9).png",
      texture: "data/texture item (9).jpg",
      model: "data/Shorts.gltf",
    shortDesc: "Шорты для людей с протезами.",
    fullDesc: "Шорты из дышащего хлопка с боковыми молниями по всей длине. Позволяют легко снимать/надевать протез без раздевания. Усиленная область сидения.",
    features: [
      "Молнии на обеих сторонах",
      "Эластичный пояс без пуговиц",
      "Карман для ключей на липучке",
      "Антибактериальная пропитка",
      "3 цвета (черный, бежевый, синий)"
    ]
  },
  {
    id: 2,
    name: "Легкие брюки с эластичным поясом",
    price: "3 150Р",
      image: "data/item (10).png",
      image2: "data/item1 (10).png",
      texture: "data/texture item (10).jpg",
      model: "data/Pants.gltf",
    shortDesc: "Брюки для людей с колостомой.",
    fullDesc: "Брюки из льняной ткани с эластичным поясом и скрытыми карманами для аксессуаров. Боковые швы смещены вперед для комфорта при сидении.",
    features: [
      "Пояс с регулируемой шириной",
      "Скрытые карманы на животе",
      "Усиленные колени",
      "Бесшовные манжеты",
      "Доступны в 5 размерах"
    ]
  },
  {
    id: 3,
    name: "Юбка с магнитными застежками",
    price: "2 700Р",
      image: "data/item (11).png",
      image2: "data/item1 (11).png",
      texture: "data/texture item (11).jpg",
      model: "data/Skirt.gltf",
    shortDesc: "Юбка для женщин с ограниченной подвижностью рук.",
    fullDesc: "Юбка-карандаш с магнитными застежками по бокам. Подкладка из шелковистого полиэстера предотвращает трение. Длина регулируется кнопками.",
    features: [
      "3 магнитные застежки с каждой стороны",
      "Съемный пояс-корсет",
      "Карман для телефона на бедре",
      "Ткань с UPF 50+",
      "4 размера (S-L)"
    ]
  },
  {
    id: 4,
    name: "Капри с карманами для катетеров",
    price: "3 600Р",
      image: "data/item (12).png",
      image2: "data/item1 (12).png",
      texture: "data/texture item (12).jpg",
      model: "data/Shorts.gltf",
    shortDesc: "Капри для людей с мочевыми катетерами.",
    fullDesc: "Капри из стрейч-хлопка с внутренними карманами для мешков. Молнии на штанинах для быстрого доступа. Швы обработаны плоскими лентами.",
    features: [
      "2 скрытых кармана на внутренней стороне",
      "Молнии длиной 25 см",
      "Водоотталкивающая пропитка",
      "Эластичный пояс без давления на живот",
      "3 цвета (черный, серый, хаки)"
    ]
  },
  {
    id: 5,
    name: "Создайте свой собственный дизайн",
    price: "4 500Р",
    image: "data/custom_clothes.png",
    texture: "data/texture basic.jpg",
    model: "data/Pants.gltf",
    shortDesc: "Разработайте свою уникальную одежду с помощью нашего 3D конфигуратора.",
    fullDesc: "Наш уникальный 3D конфигуратор позволяет вам создать индивидуальный дизайн одежды. Загрузите свое изображение, и мы применим его в качестве текстуры к вашей одежде. Сразу после покупки свяжемся с вами и уточним все необходимые детали.",
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

  const warm_bottom = [
    {
    id: 1,
    name: "Утепленные штаны с молниями по всей длине",
    price: "5 850Р",
      image: "data/item (13).png",
      image2: "data/item1 (13).png",
      texture: "data/texture item (13).jpg",
      model: "data/Pants.gltf",
    shortDesc: "Штаны для людей с протезами ног.",
    fullDesc: "Утепленные штаны из мембранной ткани с молниями от пояса до щиколоток. Внутренняя подкладка из флиса. Усиленные колени и сиденье.",
    features: [
      "Молнии с двумя бегунками",
      "Съемный утеплитель",
      "Светоотражающие полосы",
      "Карманы с подогревом",
      "5 размеров (XS-XXL)"
    ]
  },
  {
    id: 2,
    name: "Термобелье с бесшовной конструкцией",
    price: "4 500Р",
      image: "data/item (14).png",
      image2: "data/item1 (14).png",
      texture: "data/texture item (14).jpg",
      model: "data/Shirt.gltf",
    shortDesc: "Белье для людей с чувствительной кожей.",
    fullDesc: "Термобелье из мериносовой шерсти без боковых швов. Плоские этикетки и гипоаллергенные красители. Зона горловины с магнитной застежкой.",
    features: [
      "100% мериносовая шерсть",
      "Бесшовный крой",
      "Магнитная застежка на шее",
      "Антибактериальная пропитка",
      "4 размера (S-XL)"
    ]
  },
  {
    id: 3,
    name: "Брюки с подогревом для колясочников",
    price: "8 100Р",
      image: "data/item (15).png",
      image2: "data/item1 (15).png",
      texture: "data/texture item (15).jpg",
      model: "data/Pants.gltf",
    shortDesc: "Брюки с USB-подогревом для людей с нарушением кровообращения.",
    fullDesc: "Брюки из мягкого неопрена с встроенными нагревательными элементами. Управление через приложение. Удлиненная спинка и эластичные манжеты.",
    features: [
      "3 температурных режима",
      "Зарядка от powerbank",
      "Водонепроницаемая зона сидения",
      "Съемный внутренний слой",
      "3 размера (M-XXL)"
    ]
  },
  {
    id: 4,
    name: "Зимние лосины с усиленными коленями",
    price: "4 050Р",
      image: "data/item (16).png",
      image2: "data/item1 (16).png",
      texture: "data/texture item (16).jpg",
      model: "data/Leggings.gltf",
    shortDesc: "Лосины для людей с артрозом.",
    fullDesc: "Лосины из плотного хлопка с усиленными коленями и эластичным поясом. Внутренние карманы для согревающих пластин. Швы вынесены на внешнюю сторону.",
    features: [
      "Двойной слой ткани на коленях",
      "Карманы для гелевых грелок",
      "Эластичный пояс без давления",
      "Антистатическая пропитка",
      "4 размера (S-XL)"
    ]
  },
  {
    id: 5,
    name: "Создайте свой собственный дизайн",
    price: "4 500Р",
    image: "data/custom_clothes.png",
    texture: "data/texture basic.jpg",
    model: "data/Pants.gltf",
    shortDesc: "Разработайте свою уникальную одежду с помощью нашего 3D конфигуратора.",
    fullDesc: "Наш уникальный 3D конфигуратор позволяет вам создать индивидуальный дизайн одежды. Загрузите свое изображение, и мы применим его в качестве текстуры к вашей одежде. Сразу после покупки свяжемся с вами и уточним все необходимые детали.",
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

  const ltopGrid = document.querySelector('.ltop');
  const wtopGrid = document.querySelector('.wtop');
  const lbottomGrid = document.querySelector('.lbottom');
  const wbottomGrid = document.querySelector('.wbottom');
  const modal = document.getElementById('item-modal');
  const closeModal = document.querySelector('#item-modal .close-modal');
  const modalBody = document.querySelector('#item-modal .modal-body');

  light_top.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('item-card');
    card.setAttribute('data-id', product.id);
    card.innerHTML = `<div class="item-image"><img src="${product.image}" alt="${product.name}"></div><div class="item-info"><h3 class="item-title">${product.name}</h3><p class="item-price">${product.price}</p><p class="item-description">${product.shortDesc}</p></div>`;
    card.addEventListener('click', () => showProductModal(product));
    ltopGrid.appendChild(card);
  });

  warm_top.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('item-card');
    card.setAttribute('data-id', product.id);
    card.innerHTML = `<div class="item-image"><img src="${product.image}" alt="${product.name}"></div><div class="item-info"><h3 class="item-title">${product.name}</h3><p class="item-price">${product.price}</p><p class="item-description">${product.shortDesc}</p></div>`;
    card.addEventListener('click', () => showProductModal(product));
    wtopGrid.appendChild(card);
  });

  light_bottom.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('item-card');
    card.setAttribute('data-id', product.id);
    card.innerHTML = `<div class="item-image"><img src="${product.image}" alt="${product.name}"></div><div class="item-info"><h3 class="item-title">${product.name}</h3><p class="item-price">${product.price}</p><p class="item-description">${product.shortDesc}</p></div>`;
    card.addEventListener('click', () => showProductModal(product));
    lbottomGrid.appendChild(card);
  });

  warm_bottom.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('item-card');
    card.setAttribute('data-id', product.id);
    card.innerHTML = `<div class="item-image"><img src="${product.image}" alt="${product.name}"></div><div class="item-info"><h3 class="item-title">${product.name}</h3><p class="item-price">${product.price}</p><p class="item-description">${product.shortDesc}</p></div>`;
    card.addEventListener('click', () => showProductModal(product));
    wbottomGrid.appendChild(card);
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
    if (product.is3DCustomizable) {
      show3DCustomizableProduct(product);
    } else {
      showRegularProduct(product);
    }
    
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('show');
    }, 100);
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
    
    const view3DBtn = document.querySelector('.view-3d');
    const imageGallery = document.querySelector('.image-gallery');
    const threedContainer = document.getElementById('threed-view-container');
    
    view3DBtn.addEventListener('click', () => {
      if (view3DBtn.classList.contains('active')) {
        view3DBtn.classList.remove('active');
        threedContainer.classList.remove('show');
        imageGallery.style.display = 'block';
      } else {
        view3DBtn.classList.add('active');
        imageGallery.style.display = 'none';
        threedContainer.classList.add('show');
        setTimeout(() => {
          if (!threedContainer.children.length) {
            init3DViewer(threedContainer, product, false);
          }
        }, 100);
      }
    });
    
    const addToCartBtn = document.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
      addToCart(product);
    });
  }
  function show3DCustomizableProduct(product) {
    modalBody.innerHTML = `
      <div class="modal-image">
        <div class="threed-container show" id="threed-view-container">
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
          <div class="customization-section">
        <!-- Тип застежки -->
        <div class="category">
            <div class="category-header">
                <h3 class="category-title">Тип застежки</h3>
                <svg class="arrow" viewBox="0 0 24 24">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                </svg>
            </div>
            <div class="options-container">
                <div class="options-grid">
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Магнитные застежки</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Крупные кнопки</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Липучки</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Молнии с большими бегунками</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Эластичные завязки</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Застежки для одной руки</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Тип ткани -->
        <div class="category">
            <div class="category-header">
                <h3 class="category-title">Тип ткани</h3>
                <svg class="arrow" viewBox="0 0 24 24">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                </svg>
            </div>
            <div class="options-container">
                <div class="options-grid">
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Органический хлопок</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Бамбуковое волокно</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Мягкий лен</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Гипоаллергенный полиэстер</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Бесшовные материалы</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Ткань с UPF-защитой</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Адаптивные элементы -->
        <div class="category">
            <div class="category-header">
                <h3 class="category-title">Адаптивные элементы</h3>
                <svg class="arrow" viewBox="0 0 24 24">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                </svg>
            </div>
            <div class="options-container">
                <div class="options-grid">
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Удлиненная спинка</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Регулируемые манжеты</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Съемные подкладки</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Усиленные колени/локти</span>
                        </label>
                    </div>
                    <div class="option-item">
                        <label class="checkbox-container">
                            <input type="checkbox" class="checkbox-input">
                            <span class="checkbox-custom"></span>
                            <span class="option-label">Доступные карманы</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
        </div>
        
        <button class="btn modal-btn add-to-cart">В корзину</button>
        <button class="btn modal-btn save-design">Сохранить дизайн</button>
      </div>
    `;
    document.querySelectorAll('.category-header').forEach(header => {
      header.addEventListener('click', () => {
        const category = header.parentElement;
        category.classList.toggle('active');
      });
    });

    const threedContainer = document.getElementById('threed-view-container');
    setTimeout(() => {
      ownTexture = init3DViewer(threedContainer, product, true);
    }, 100);
    
    const dropZone = document.getElementById('texture-drop-zone');
    const fileInput = document.getElementById('texture-upload');
    threedContainer.classList.add('show');
    
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
      if (file.size > 20 * 1024 * 1024) {
        showNotification('Файл слишком большой. Максимальный размер 20МБ.', 'error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showNotification('Пожалуйста, загрузите файл изображения.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const newTexture = new THREE.Texture(img);
          newTexture.wrapS = THREE.RepeatWrapping;
          newTexture.wrapT = THREE.RepeatWrapping;
          newTexture.minFilter = THREE.LinearFilter;
          newTexture.magFilter = THREE.LinearFilter;
          newTexture.needsUpdate = true;
          ownTexture.setTexture(newTexture);

          product.customTexture = {
            dataUrl: e.target.result,
            previewImage: e.target.result
          };

          showNotification('Текстура успешно применена!', 'success');
          const dropZone = document.getElementById('texture-drop-zone');
          dropZone.style.display = "none";
        };
        img.src = e.target.result;
      };
      reader.onerror = function(e) {
        showNotification('Ошибка при чтении файла.', 'error');
      };
      reader.readAsDataURL(file);
    }
    
    
    const addToCartBtn = document.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
      if (!product.customTexture) {
        showNotification('Пожалуйста, загрузите изображение перед добавлением в корзину.', 'error');
        return;
      }
      addToCart(product);
    });
    
    const saveDesignBtn = document.querySelector('.save-design');
    saveDesignBtn.addEventListener('click', () => {
      if (!product.customTexture) {
        showNotification('Пожалуйста, загрузите изображение перед сохранением дизайна.', 'error');
        return;
      }
      var date = new Date();
      const designId = date.toLocaleDateString();
      const designName = `Дизайн ${designId}`;
      toggledFeatures = getSelectedFeatures();
      if (toggledFeatures.length == 0) toggledFeatures = ['Особенности дезайна не выбраны'];
      
      const customProduct = {
        id: `custom-${designId}`,
        name: designName,
        price: product.price,
        image: product.customTexture.previewImage,
        texture: product.customTexture.previewImage,
        customTexture: product.customTexture,
        model: product.model,
        shortDesc: "Ваш персональный дизайн",
        fullDesc: "Персонализированная одежда с вашим собственным дизайном.",
        features: toggledFeatures,
        is3DCustomizable: true
      };
      
      saveUserDesign(customProduct);
      
      showNotification('Ваш дизайн сохранен!', 'success');
    });
  }
}

let ownTexture;
function init3DViewer(container, product, isCustomizable) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f9fa);
  
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight || 1, 0.1, 1000);
  camera.position.set(0, 2, 6);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);
  
  let model;
  const loader = new THREE.GLTFLoader();
  loader.load(
    product.model,
    (gltf) => {
      model = gltf.scene;
      
      model.traverse((child) => {
        if (child.isMesh) {
          child.originalMaterial = child.material;
          const texture = new THREE.TextureLoader().load(product.texture);
          child.material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.7,
            metalness: 0.0
          });
        }
      });
      
      model.scale.set(2, 2, 2);
      if (product.model == "data/coat.gltf") model.position.set(0, -8, 0);
      else if (product.model == "data/Shirt.gltf") model.position.set(0, -6, 0);
      else if (product.model == "data/Shorts.gltf") model.position.set(0, -9, 0);
      else if (product.model == "data/Pants.gltf") model.position.set(0, -3, 0);
      else if (product.model == "data/Leggings.gltf") model.position.set(0, -5, 0);
      else if (product.model == "data/Vest.gltf") model.position.set(0, -7, 0);
      else if (product.model == "data/Skirt.gltf") model.position.set(0, 0, 0);
      scene.add(model);
      animate();
    },
    undefined,
    (error) => {
      console.error('Error loading 3D model:', error);
      showNotification('Ошибка загрузки 3D модели', 'error');
    }
  );
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minPolarAngle = -Infinity;
  controls.maxPolarAngle = Infinity;
  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = Infinity;
  controls.enablePan = false;

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  
  window.addEventListener('resize', () => {
    if (container.clientWidth > 0 && container.clientHeight > 0) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  });
  
  if (isCustomizable) {
    return {
      setTexture: (newTexture) => {
        ownTexture = newTexture;
        if (model) {
          model.traverse((child) => {
            if (child.isMesh) {
              child.material.map = ownTexture;
              child.material.needsUpdate = true;
            }
          });
        }
      },
      texture: ownTexture
    };
  }
}

function createDefaultTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, '#b6c9d6');
  gradient.addColorStop(1, '#d6e4f0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  
  ctx.strokeStyle = '#a0b8d8';
  ctx.lineWidth = 2;
  for (let i = 50; i < 512; i += 100) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(512, 512 - i);
    ctx.stroke();
  }
  
  const defaultTexture = new THREE.CanvasTexture(canvas);
  defaultTexture.wrapS = THREE.RepeatWrapping;
  defaultTexture.wrapT = THREE.RepeatWrapping;
  defaultTexture.repeat.set(1, 1);
  
  return defaultTexture;
}

function saveUserDesign(designProduct) {
  let designs = JSON.parse(localStorage.getItem('userDesigns')) || [];
  designs.push(designProduct);
  localStorage.setItem('userDesigns', JSON.stringify(designs));
  loadUserDesigns();
}

function loadUserDesigns() {
  const designs = JSON.parse(localStorage.getItem('userDesigns')) || [];
  const designsGrid = document.querySelector('.user-designs-grid');
  designsGrid.innerHTML = '';
  const userDesignsSection = document.querySelector('.user-designs');
  userDesignsSection.style.display = designs.length > 0 ? 'block' : 'none';
  
  if (designs.length === 0) return;
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
      
      const threedContainer = document.getElementById('threed-view-container');
      setTimeout(() => {
        init3DViewer(threedContainer, design, false);
      }, 100);
      
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

if (!sessionStorage.getItem('animationPlayed')) {
  document.querySelector(".loader").style.opacity = "1";
  setTimeout(() => {
    document.querySelector(".loader").style.opacity = "0";
    setTimeout(() => {
        document.querySelector(".loader").remove();
    }, 500);
  }, 3500);
  sessionStorage.setItem('animationPlayed', 'true');
}
else {
  document.querySelector(".loader").remove();
}
function getSelectedFeatures() {
  const features = [];
  document.querySelectorAll('.checkbox-input:checked').forEach(checkbox => {
    const label = checkbox.closest('.checkbox-container').querySelector('.option-label').textContent;
    features.push(label);
  });
  return features;
}
const questions = [
{
  question: "Какой длины должна быть нитка, чтобы вровень хватило для нашей теплой кофты?",
  answers: ["1 мм", "1 см", "3 м", "13 км"],
  correct: "3 м"
},
{
  question: "Что произойдет с одеждой с сенсорными кнопками, если её случайно положить в микроволновку?",
  answers: ["Взрывается", "Пишет диссертацию", "Становится умнее", "Звонит в поддержку"],
  correct: "Звонит в поддержку"
},
{
  question: "Сколько датчиков нужно добавить в шапку, чтобы она начала предсказывать погоду?",
  answers: ["0", "10", "100", "Достаточно одного, но с кофеином"],
  correct: "Достаточно одного, но с кофеином"
},
{
  question: "Что произойдет с одеждой с подсветкой, если её забыть выключить?",
  answers: ["Светится", "Горит", "Превратится обратно в нитки", "Будет заряжать розетку"],
  correct: "Светится"
},
{
  question: "Какой материал идеален для одежды с тактильными подсказками?",
  answers: ["Швабра", "Рельса", "Магнитный шелкопряд", "Песок"],
  correct: "Магнитный шелкопряд"
},
{
  question: "Сколько раз можно растянуть адаптивные брюки, прежде чем они станут шароварами?",
  answers: ["1", "10", "200", "Пока не жалуются"],
  correct: "10"
}
];

let currentQuestionIndex = 0;
let quizStarted = false;

function openQuiz() {
  document.getElementById('quizPopup').style.display = 'flex';
  document.getElementById('finalAnimation').style.display = 'none';
  document.getElementById('openBtn').style.display = 'none';
  document.getElementById('closeBtn').style.display = 'block';
  resetQuiz();
  showQuestion();
}

  function closeQuiz() {
  document.getElementById('quizPopup').style.display = 'none';
  document.getElementById('finalAnimation').style.display = 'none';
  document.getElementById('closeBtn').style.display = 'none';
  document.getElementById('openBtn').style.display = 'block';
  resetQuiz();
}

function resetQuiz() {
currentQuestionIndex = 0;
quizStarted = false;
document.getElementById('answersContainer').innerHTML = '';
document.querySelectorAll('.answer-btn').forEach(btn => btn.remove());
}

function showQuestion() {
if (currentQuestionIndex >= questions.length) {
  showFinalAnimation();
  return;
}

const q = questions[currentQuestionIndex];
document.getElementById('questionText').innerText = q.question;

const answersContainer = document.getElementById('answersContainer');
answersContainer.innerHTML = '';

const shuffled = [...q.answers].sort(() => Math.random() - 0.5);

shuffled.forEach(answer => {
  const btn = document.createElement('button');
  btn.className = 'answer-btn';
  btn.innerText = answer;
  btn.onclick = () => handleAnswer(btn, answer === q.correct);
  answersContainer.appendChild(btn);
});
}

function handleAnswer(button, isCorrect) {
const buttons = document.querySelectorAll('.answer-btn');
buttons.forEach(btn => btn.classList.add('locked'));
if (isCorrect) {
  button.classList.add('correct');
  setTimeout(() => {
    currentQuestionIndex++;
    buttons.forEach(btn => btn.classList.remove('correct', 'incorrect', 'locked'));
    showQuestion();
  }, 1000);
} else {
  button.classList.add('incorrect');
  setTimeout(() => {
    buttons.forEach(btn => btn.classList.remove('incorrect', 'locked'));
  }, 500);
}
}

function showFinalAnimation() {
document.getElementById('quizPopup').style.display = 'none';
document.getElementById('finalAnimation').style.display = 'block';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('finalCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 2;
const geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
const edges = new THREE.EdgesGeometry(geometry);
const material = new THREE.LineBasicMaterial({ color: 0x4ade80 });
const cube = new THREE.LineSegments(edges, material);
scene.add(cube);
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.008;
  cube.rotation.y += 0.012;
  cube.rotation.z += 0.005;
  renderer.render(scene, camera);
}
animate();
}
