
const truncateTextElements = document.querySelectorAll('.truncate-text');
// console.log(truncateTextElements);

truncateTextElements.forEach((element) => {

  const content = element.innerText;
  const readMoreLink = element.querySelector('.read-more-link');

  if (content.length >= 50) {
    
    readMoreLink.style.display = 'inline';
    

    readMoreLink.addEventListener('click', (e) => {
      e.preventDefault();

    });
  }
});
