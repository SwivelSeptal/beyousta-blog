// js/blog.js

// Blog posts data
const posts = [
  { 
    title: "Welcome to BeYousta!",
    slug: "2025-04-10-welcome-to-beyousta",
    year: "2025",
    date: "2025-04-10",
    image: "./assets/images/welcome-thumb.jpg"
  },
  { 
    title: "Express Yourself in the AI Age",
    slug: "2025-04-15-express-yourself",
    year: "2025",
    date: "2025-04-15",
    image: "./assets/images/express-yourself-thumb.jpg"
  }
  // Add more posts here...
];

// Sort posts by newest first
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Infinite scroll setup
let postsPerPage = 12;
let currentPage = 0;

const blogGrid = document.getElementById('blog-grid');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');

// Load posts in chunks
function loadPosts() {
  const start = currentPage * postsPerPage;
  const end = start + postsPerPage;
  const chunk = posts.slice(start, end);

  chunk.forEach(post => {
    const postCard = createPostCard(post);
    blogGrid.appendChild(postCard);
  });

  currentPage++;
}

// Create a blog post card dynamically
function createPostCard(post) {
  const postURL = `./posts/${post.year}/${post.slug}.html`; // Auto-generate post link

  const postCard = document.createElement('div');
  postCard.className = 'blog-card';
  postCard.innerHTML = `
    <a href="${postURL}" class="blog-link">
      <div class="blog-card-image">
        <img src="${post.image}" alt="${post.title}">
      </div>
      <div class="blog-card-content">
        <h2>${post.title}</h2>
        <p class="post-date">${post.date}</p>
      </div>
    </a>
  `;
  return postCard;
}

// Detect when user scrolls near bottom to load more posts
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 300)) {
    loading.style.display = 'block';
    setTimeout(() => {
      loadPosts();
      loading.style.display = 'none';
    }, 1000);
  }
});

// Filter posts dynamically based on search input
searchInput.addEventListener('input', function () {
  const query = this.value.toLowerCase();
  blogGrid.innerHTML = ''; // Clear the grid
  currentPage = 0; // Reset paging if needed

  const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(query));
  filteredPosts.forEach(post => {
    const postCard = createPostCard(post);
    blogGrid.appendChild(postCard);
  });
});

// Back to Top Button setup
const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});

// Smooth scroll to top on Back to Top button click
backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Initial load of posts
loadPosts();

/* ----------------------- */
/* Custom Mouse Cursor Code */
/* ----------------------- */

// Custom cursor setup
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', e => {
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';

  follower.style.top = e.clientY + 'px';
  follower.style.left = e.clientX + 'px';
});

// Smooth follower animation
let mouseX = 0, mouseY = 0;
let posX = 0, posY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function smoothFollow() {
  posX += (mouseX - posX) / 9;
  posY += (mouseY - posY) / 9;
  follower.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
  requestAnimationFrame(smoothFollow);
}

smoothFollow();

// Cursor interaction with links and buttons
const hoverTargets = document.querySelectorAll('a, button');

hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    follower.style.transform = 'scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    follower.style.transform = 'scale(1)';
  });
});