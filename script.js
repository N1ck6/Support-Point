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
      shortDesc: "Прочная ткань из льна, которая становится мягче с каждой стиркой.",
      fullDesc: "Наша повседневная рубашка из льна сочетает устойчивость и комфорт. Лен выращивается без пестицидов и становится мягче с каждой стиркой, что делает ее долговечным выбором для вашего гардероба.",
      features: [
        "55% лен, 45% органический хлопок",
        "Производство без пестицидов",
        "Естественная защита от УФ-излучения",
        "Прочная конструкция для долговечности",
        "Становится мягче со временем"
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
          <h4>Особенности:</h4>
          <ul>
            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <button class="btn modal-btn">В корзину</button>
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
