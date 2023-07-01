const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function toggleTheme() {
  if (document.body.classList.contains('dark-theme')) {
    document.body.classList.remove('dark-theme');
  } else {
    document.body.classList.add('dark-theme');
  }
}

themeToggle.addEventListener('click', toggleTheme);

if (prefersDarkScheme.matches) {
  document.body.classList.add('dark-theme');
}