document.getElementById('advToggleBtn').addEventListener('click', () => {
  document.getElementById('advPanel').classList.toggle('open');
});
document.querySelectorAll('.sort-group button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sort-group button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
