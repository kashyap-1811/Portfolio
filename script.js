// ==========================================================================
// Custom Particle Cursor Trail Animation
// ==========================================================================
const initCursorCanvas = () => {
  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  let mouse = { x: -100, y: -100 };
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Create new particles on move
    if (particles.length < 60) {
      particles.push(new Particle(mouse.x, mouse.y));
    }
  });
  
  // Particle constructor
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      // Slighly random speed vectors
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.size = Math.random() * 3 + 1;
      this.color = Math.random() > 0.5 ? '#0ea5e9' : '#818cf8'; // Blue or Indigo
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.015;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }
  
  // Animation Loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw & update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if (p.life <= 0) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }
    
    requestAnimationFrame(animate);
  };
  
  animate();
};

// ==========================================================================
// Mobile Nav Menu and Scroll Highlighting
// ==========================================================================
const initNavigation = () => {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('navbar-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Handle header shrink on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Active link highlighting on scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.clientHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'bi bi-x-lg';
      } else {
        icon.className = 'bi bi-list';
      }
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.querySelector('i').className = 'bi bi-list';
      });
    });
    
    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.querySelector('i').className = 'bi bi-list';
      }
    });
  }
};

// ==========================================================================
// Hero Text Typing Effect
// ==========================================================================
const initTypingEffect = () => {
  const typingEl = document.getElementById('hero-typing');
  if (!typingEl) return;
  
  const words = [
    "Software Engineer",
    "DSA Focused",
    "Full-Stack Developer",
    "Microservices Enthusiast"
  ];
  
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  
  const type = () => {
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIdx - 1) || "\u200b";
      charIdx--;
    } else {
      typingEl.textContent = currentWord.substring(0, charIdx + 1) || "\u200b";
      charIdx++;
    }
    
    // Speeds: typing vs deleting
    let speed = isDeleting ? 40 : 80;
    
    if (!isDeleting && charIdx === currentWord.length) {
      // Pause at full word
      isDeleting = true;
      speed = 1500;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      speed = 400;
    }
    
    setTimeout(type, speed);
  };
  
  setTimeout(type, 800);
};

// ==========================================================================
// Scroll Reveal Animations
// ==========================================================================
const initScrollAnimations = () => {
  const elements = document.querySelectorAll('.scroll-animate');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });
  
  // Stagger helper: detects if elements share parent container
  const parentStaggers = new Map();
  
  elements.forEach((el, index) => {
    const parent = el.parentElement;
    if (parent && (parent.classList.contains('bento-grid') || 
                   parent.classList.contains('projects-grid') || 
                   parent.classList.contains('achievements-grid') || 
                   parent.classList.contains('contact-info-list') || 
                   parent.classList.contains('skills-badges-flex'))) {
      
      if (!parentStaggers.has(parent)) {
        parentStaggers.set(parent, []);
      }
      parentStaggers.get(parent).push(el);
    } else {
      observer.observe(el);
    }
  });
  
  // Apply staggered inline transition delays
  parentStaggers.forEach((children) => {
    children.forEach((child, idx) => {
      child.style.transitionDelay = `${idx * 75}ms`;
      observer.observe(child);
    });
  });
};

// ==========================================================================
// Bento Card 4: DSA Playground Visualizer
// ==========================================================================
const initDSAVisualizer = () => {
  const btnBS = document.getElementById('v-select-bs');
  const btnTS = document.getElementById('v-select-ts');
  const btnRun = document.getElementById('v-btn-run');
  const titleEl = document.getElementById('v-title');
  const arrayEl = document.getElementById('v-array');
  const pointersEl = document.getElementById('v-pointers');
  const logEl = document.getElementById('v-log');
  
  if (!btnBS || !btnRun) return;
  
  let currentAlgo = 'bs'; // 'bs' or 'ts'
  let isRunning = false;
  
  const bsArray = [4, 8, 15, 16, 23, 42, 56, 70, 85, 99];
  const bsTarget = 56;
  
  const tsArray = [2, 7, 11, 15];
  const tsTarget = 9;
  
  // Helper to wait in async loop
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const setupPlayground = () => {
    arrayEl.innerHTML = '';
    logEl.textContent = "Select an algorithm and click 'Run Code'";
    logEl.style.color = 'var(--accent-cyan)';
    btnRun.disabled = false;
    
    if (currentAlgo === 'bs') {
      titleEl.textContent = 'binary_search.cpp';
      pointersEl.style.display = 'flex';
      pointersEl.innerHTML = `
        <div class="v-pointer"><span class="v-pointer-dot left"></span> Left (L)</div>
        <div class="v-pointer"><span class="v-pointer-dot mid"></span> Mid (M)</div>
        <div class="v-pointer"><span class="v-pointer-dot right"></span> Right (R)</div>
      `;
      
      // Render array nodes
      bsArray.forEach(val => {
        const node = document.createElement('div');
        node.className = 'v-node';
        node.textContent = val;
        arrayEl.appendChild(node);
      });
    } else {
      titleEl.textContent = 'two_sum.js';
      pointersEl.style.display = 'flex';
      pointersEl.innerHTML = `
        <div class="v-pointer"><span class="v-pointer-dot left"></span> i pointer</div>
        <div class="v-pointer"><span class="v-pointer-dot right"></span> complement check</div>
      `;
      
      // Render array nodes
      tsArray.forEach(val => {
        const node = document.createElement('div');
        node.className = 'v-node';
        node.textContent = val;
        arrayEl.appendChild(node);
      });
      
      // Render HashMap space below
      const mapWrapper = document.createElement('div');
      mapWrapper.className = 'v-map-grid';
      mapWrapper.id = 'v-map-grid';
      arrayEl.appendChild(mapWrapper);
    }
  };
  
  // Run Binary Search Animation
  const runBinarySearch = async () => {
    const nodes = arrayEl.querySelectorAll('.v-node');
    let left = 0;
    let right = bsArray.length - 1;
    let stepCount = 1;
    
    logEl.textContent = `Starting Binary Search for target: ${bsTarget}`;
    await sleep(1000);
    
    while (left <= right) {
      if (!isRunning) return;
      
      // Reset prior classes
      nodes.forEach(n => n.classList.remove('active-check'));
      
      // Calculate mid
      const mid = Math.floor((left + right) / 2);
      
      // Apply visual pointer badges
      nodes.forEach((node, idx) => {
        // Clear children text except base val
        node.innerHTML = bsArray[idx];
        
        let label = '';
        if (idx === left) label += 'L';
        if (idx === mid) label += 'M';
        if (idx === right) label += 'R';
        
        if (label) {
          const lblNode = document.createElement('span');
          lblNode.style.position = 'absolute';
          lblNode.style.bottom = '-18px';
          lblNode.style.fontSize = '9px';
          lblNode.style.fontWeight = 'bold';
          lblNode.style.color = idx === mid ? 'var(--accent-blue)' : (idx === left ? 'var(--accent-cyan)' : 'var(--accent-purple)');
          lblNode.textContent = label;
          node.appendChild(lblNode);
        }
        
        // Discard out of bounds nodes
        if (idx < left || idx > right) {
          node.classList.add('discarded');
        }
      });
      
      // Highlight check mid
      nodes[mid].classList.remove('discarded');
      nodes[mid].classList.add('active-check');
      logEl.textContent = `Step ${stepCount}: L=${left}, R=${right}. Mid=${mid} (Val=${bsArray[mid]})`;
      await sleep(1500);
      
      if (bsArray[mid] === bsTarget) {
        nodes[mid].classList.remove('active-check');
        nodes[mid].classList.add('found');
        logEl.textContent = `Target ${bsTarget} found at index ${mid}!`;
        logEl.style.color = 'var(--accent-emerald)';
        return;
      }
      
      if (bsArray[mid] < bsTarget) {
        logEl.textContent = `${bsArray[mid]} < ${bsTarget}. Discard left half. Move L to ${mid + 1}`;
        left = mid + 1;
      } else {
        logEl.textContent = `${bsArray[mid]} > ${bsTarget}. Discard right half. Move R to ${mid - 1}`;
        right = mid - 1;
      }
      
      // Animate slide out
      nodes.forEach((node, idx) => {
        if (idx < left || idx > right) {
          node.classList.add('discarded');
        }
      });
      
      stepCount++;
      await sleep(1500);
    }
    
    logEl.textContent = "Target not found in array.";
    logEl.style.color = 'var(--accent-rose)';
  };
  
  // Run Two Sum Animation
  const runTwoSum = async () => {
    const nodes = arrayEl.querySelectorAll('.v-node');
    const mapGrid = document.getElementById('v-map-grid');
    const map = {};
    
    logEl.textContent = `Starting Two Sum for target: ${tsTarget}`;
    mapGrid.innerHTML = '<div style="grid-column: span 4; font-size:9px; color:var(--text-muted)">Map: {}</div>';
    await sleep(1000);
    
    for (let i = 0; i < tsArray.length; i++) {
      if (!isRunning) return;
      
      // Clear checking states
      nodes.forEach(n => n.classList.remove('active-check'));
      
      const val = tsArray[i];
      const complement = tsTarget - val;
      
      // Set i label
      nodes[i].innerHTML = val;
      const ptr = document.createElement('span');
      ptr.style.position = 'absolute';
      ptr.style.bottom = '-18px';
      ptr.style.fontSize = '9px';
      ptr.style.color = 'var(--accent-cyan)';
      ptr.textContent = 'i';
      nodes[i].appendChild(ptr);
      
      nodes[i].classList.add('active-check');
      logEl.textContent = `Step ${i+1}: Val=${val}, Complement = ${tsTarget} - ${val} = ${complement}`;
      await sleep(1500);
      
      // Highlight map check
      logEl.textContent = `Checking if complement ${complement} exists in Map...`;
      await sleep(1000);
      
      if (complement in map) {
        const compIdx = map[complement];
        nodes[i].classList.remove('active-check');
        nodes[i].classList.add('found');
        nodes[compIdx].classList.add('found');
        
        logEl.textContent = `Found! ${val} (idx ${i}) + ${complement} (idx ${compIdx}) = ${tsTarget}`;
        logEl.style.color = 'var(--accent-emerald)';
        return;
      }
      
      // Add val to map
      map[val] = i;
      nodes[i].classList.remove('active-check');
      
      // Update Map visual box
      let mapHtml = '';
      for (let k in map) {
        mapHtml += `<div class="v-map-item added">${k} ➔ idx ${map[k]}</div>`;
      }
      mapGrid.innerHTML = mapHtml;
      
      logEl.textContent = `Complement ${complement} not in Map. Insert {${val}: ${i}} into Map.`;
      await sleep(1500);
    }
    
    logEl.textContent = "No two elements sum up to target.";
    logEl.style.color = 'var(--accent-rose)';
  };
  
  // Select binary search
  btnBS.addEventListener('click', () => {
    if (isRunning) return;
    currentAlgo = 'bs';
    btnBS.classList.add('active');
    btnTS.classList.remove('active');
    setupPlayground();
  });
  
  // Select two sum
  btnTS.addEventListener('click', () => {
    if (isRunning) return;
    currentAlgo = 'ts';
    btnTS.classList.add('active');
    btnBS.classList.remove('active');
    setupPlayground();
  });
  
  // Trigger Run
  btnRun.addEventListener('click', async () => {
    if (isRunning) return;
    
    isRunning = true;
    btnRun.disabled = true;
    btnBS.style.opacity = '0.5';
    btnTS.style.opacity = '0.5';
    
    if (currentAlgo === 'bs') {
      await runBinarySearch();
    } else {
      await runTwoSum();
    }
    
    isRunning = false;
    btnRun.disabled = false;
    btnBS.style.opacity = '1';
    btnTS.style.opacity = '1';
  });
  
  // Initial draw
  setupPlayground();
};

// ==========================================================================
// Artha Project Microservices Simulator
// ==========================================================================
const initArthaSimulator = () => {
  const btnTrigger = document.getElementById('artha-simulate-btn');
  const logsContainer = document.getElementById('artha-logs');
  
  if (!btnTrigger) return;
  
  // Map of connection path IDs to their SVG coordinate data
  const paths = {
    'client-gateway': 'M 90 180 L 160 180',
    'gateway-redis': 'M 210 205 L 210 255',
    'gateway-expense': 'M 260 180 L 330 180',
    'expense-db': 'M 380 205 L 380 255',
    'expense-kafka': 'M 430 180 L 480 180',
    'kafka-analytics': 'M 530 155 L 530 105',
    'analytics-mongo': 'M 530 60 L 530 35',
    'kafka-notification': 'M 530 205 L 530 255'
  };
  
  // Apply path strings to offset properties
  for (let key in paths) {
    const pulse = document.getElementById(`pulse-${key}`);
    if (pulse) {
      pulse.style.offsetPath = `path('${paths[key]}')`;
    }
  }
  
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const writeLog = (text, type = '') => {
    const line = document.createElement('div');
    line.className = `artha-log-line ${type}`;
    line.innerHTML = `&gt; ${text}`;
    logsContainer.appendChild(line);
    
    // Auto scroll logs
    logsContainer.scrollTop = logsContainer.scrollHeight;
  };
  
  const animateNode = (nodeId, active = true) => {
    const el = document.getElementById(nodeId);
    if (el) {
      if (active) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  };
  
  const animatePath = (pathId, active = true) => {
    const el = document.getElementById(pathId);
    if (el) {
      if (active) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  };
  
  const animatePulse = async (pulseId) => {
    const el = document.getElementById(pulseId);
    if (el) {
      el.classList.add('animate');
      // duration matches CSS
      await sleep(1800);
      el.classList.remove('animate');
    }
  };
  
  btnTrigger.addEventListener('click', async () => {
    btnTrigger.disabled = true;
    logsContainer.innerHTML = '';
    
    // Reset nodes state
    const nodes = ['gateway', 'eureka', 'redis', 'expense', 'db', 'kafka', 'analytics', 'mongo', 'notification'];
    nodes.forEach(n => animateNode(`node-${n}`, false));
    Object.keys(paths).forEach(p => animatePath(`path-${p}`, false));
    
    // 1. Client Trigger
    writeLog('Client (React 19) initiated request: POST /api/v1/expense', 'system');
    animateNode('node-client', true);
    animatePath('path-client-gateway', true);
    await animatePulse('pulse-client-gateway');
    
    // 2. Gateway entry
    animateNode('node-gateway', true);
    writeLog('API Gateway (Spring Cloud Gateway) received request. Authorizing JWT...');
    await sleep(800);
    
    // 3. Redis check
    writeLog('Gateway checking Redis Rate Limiter & read Cache...');
    animatePath('path-gateway-redis', true);
    animatePulse('pulse-gateway-redis');
    await sleep(1000);
    animateNode('node-redis', true);
    writeLog('Redis rate check: OK (remaining budget bucket slots: 279/280). Cache check: Miss.', 'success');
    await sleep(1000);
    
    // 4. Eureka lookup
    writeLog('Gateway calling Eureka discovery server to resolve service instance...');
    animateNode('node-eureka', true);
    await sleep(1000);
    writeLog('Eureka: Expense Service mapped to instance http://10.244.3.44:8081', 'success');
    await sleep(800);
    animateNode('node-eureka', false);
    animateNode('node-redis', false);
    
    // 5. Gateway routes to Core Expense Service
    writeLog('Gateway forwarding POST payload to Core Expense Service...');
    animatePath('path-gateway-expense', true);
    animatePulse('pulse-gateway-expense');
    await sleep(1200);
    animateNode('node-expense', true);
    
    // 6. DB transaction
    writeLog('Expense Service writing record to Neon PostgreSQL instance...');
    animatePath('path-expense-db', true);
    animatePulse('pulse-expense-db');
    await sleep(1200);
    animateNode('node-db', true);
    writeLog('PostgreSQL transaction committed. Generated primary ID: EX-88902', 'success');
    await sleep(1000);
    animateNode('node-db', false);
    
    // 7. Emitting event to Kafka
    writeLog('Expense Service publishing event [expense-created] to Kafka event broker...');
    animatePath('path-expense-kafka', true);
    animatePulse('pulse-expense-kafka');
    await sleep(1200);
    animateNode('node-kafka', true);
    writeLog('Kafka: Message published to topic "expense-events" partition 2.', 'success');
    await sleep(1000);
    
    // 8. Event Consumers start async processes
    writeLog('Kafka Event Broker broadcasting to consumer nodes...', 'system');
    
    // Trigger notification and analytics in parallel
    animatePath('path-kafka-notification', true);
    animatePulse('pulse-kafka-notification');
    
    animatePath('path-kafka-analytics', true);
    animatePulse('pulse-kafka-analytics');
    
    await sleep(1200);
    animateNode('node-notification', true);
    animateNode('node-analytics', true);
    
    writeLog('Notification Service: Consumed event. Triggered SendGrid SMTP relay for email alerts.');
    writeLog('FastAPI Analytics (Python): Consumed event. Recalculating MoM category allocations.');
    await sleep(1200);
    
    // Analytics updates MongoDB
    animatePath('path-analytics-mongo', true);
    animatePulse('pulse-analytics-mongo');
    await sleep(1000);
    animateNode('node-mongo', true);
    writeLog('FastAPI: Budget analytics scores recalculated. Updated read-model cache in MongoDB.', 'success');
    
    await sleep(1500);
    
    // Cleanup / finish
    writeLog('Transaction completed successfully in 138ms.', 'success');
    writeLog('&gt;_ Pipeline idle.', 'system');
    
    // disable highlight lines except core nodes
    btnTrigger.disabled = false;
  });
};

// ==========================================================================
// Contact Form Submission
// ==========================================================================
const initContactForm = () => {
  const form = document.getElementById('contactForm');
  const alertEl = document.getElementById('contact-alert');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !email || !subject || !message) {
      alert('Please fill out all fields.');
      return;
    }
    
    // Simulate successful mailto link redirect
    const to = 'kashyaprupareliya1811@gmail.com';
    const bodyStr = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;
    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${bodyStr}`;
    
    alertEl.style.display = 'block';
    alertEl.className = 'contact-alert success';
    alertEl.textContent = 'Opening your email client to send message...';
    
    // Redirect after brief delay
    setTimeout(() => {
      window.location.href = mailtoUrl;
      form.reset();
      
      setTimeout(() => {
        alertEl.style.display = 'none';
      }, 5000);
    }, 1200);
  });
};



// ==========================================================================
// 3D Card Hover Tilt Interaction
// ==========================================================================
const initCardTilt = () => {
  const cards = document.querySelectorAll('.tilt-card');
  if (window.innerWidth <= 768) return; // Skip on mobile for performance

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const w = rect.width;
      const h = rect.height;
      
      // Calculate rotation angles (max 5 degrees)
      const rotateX = ((h / 2 - y) / (h / 2)) * 5;
      const rotateY = ((x - w / 2) / (w / 2)) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      
      // Move radial glow position (if exists)
      const glow = card.querySelector('.spec-card-glow, .bento-card-bg-glow');
      if (glow) {
        glow.style.top = `${y - 125}px`;
        glow.style.left = `${x - 125}px`;
        glow.style.opacity = '0.24';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      
      const glow = card.querySelector('.spec-card-glow, .bento-card-bg-glow');
      if (glow) {
        glow.style.opacity = '0.12';
        glow.style.top = '';
        glow.style.left = '';
      }
    });
  });
};

// ==========================================================================
// Initializations
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  
  // Run Sub-modules
  initCursorCanvas();
  initNavigation();
  initTypingEffect();
  initScrollAnimations();
  initDSAVisualizer();
  initArthaSimulator();
  initContactForm();
  initCardTilt();
});