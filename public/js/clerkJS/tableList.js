// header
const accountDrop = document.getElementsByClassName('dropbtn')[0];
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
accountDrop.addEventListener('click', () => {
   document.getElementById("myDropdown").classList.toggle("show");
})

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
   if (!event.target.matches('.dropbtn')) {
      document.getElementById("myDropdown").classList.remove('show')
   }
}