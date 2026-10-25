const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.textContent = theme === 'dark' ? '☀' : '☾';
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101210' : '#f5f4ed';
}
let savedTheme;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch {}
setTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'dark');
themeButton.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch {}
});
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigation.querySelectorAll('a').forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  let count = 0;
  projectCards.forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.stack !== filter;
    if (!card.hidden) count++;
  });
  document.getElementById('filter-status').textContent = `${count} projects shown`;
}));
document.getElementById('year').textContent = new Date().getFullYear();
matchMedia('(min-width: 701px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
