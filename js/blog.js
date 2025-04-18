// js/blog.js

// Constants
const postsPerPage = 12;
let currentPage = 0;
let posts = [];
let filteredPosts = [];

const blogGrid = document.getElementById('blog-grid');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');

// Observer for fade animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

// Load posts chunk
function loadPostsChunk() {
  const start = currentPage * postsPerPage;
  const end = start + postsPerPage;
  const chunk = filteredPosts.slice(start, end);

  chunk.forEach(post => {
    const card = createPostCard(post);
    blogGrid.appendChild(card);
    observer.observe(card);
  });

  currentPage++;
}

// Create post card
function createPostCard(post) {
  const postUrl = `/posts/${post.year}/${post.slug}.html`;
  const card = document.createElement('div');
  card.className = 'blog-card magnetic fade-slide-up';
  card.innerHTML = `
    <a href="${postUrl}" class="blog-link" data-link>
      <div class="blog-card-image">
        <img src="${post.image}" alt="${post.title}" />
      </div>
      <div class="blog-card-content">
        <h2>${post.title}</h2>
        <p class="post-date">${new Date(post.date).toDateString()}</p>
      </div>
    </a>
  `;
  return card;
}

// Scroll to load more
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 300)) {
    if (currentPage * postsPerPage < filteredPosts.length) {
      loading.style.display = 'block';
      setTimeout(() => {
        loadPostsChunk();
        loading.style.display = 'none';
      }, 500);
    }
  }
});

// Filter search
searchInput.addEventListener('input', function () {
  const query = this.value.toLowerCase();
  filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.excerpt?.toLowerCase().includes(query)
  );
  blogGrid.innerHTML = '';
  currentPage = 0;
  loadPostsChunk();
});

// Load blogRollData.json
fetch('/data/blogRollData.json')
  .then(res => {
    if (!res.ok) throw new Error('Failed to load blogRollData');
    return res.json();
  })
  .then(data => {
    posts = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredPosts = [...posts];
    loadPostsChunk();
  })
  .catch(err => {
    console.error('Failed to fetch posts:', err);
    blogGrid.innerHTML = `<p style="text-align:center;">Error loading blog posts.</p>`;
  });