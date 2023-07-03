const BuscarHora = () =>{
  var data = new Date();
  var hora = data.getHours();

  if (hora >= 6 && hora < 12) {
      return "Good Morning";
  } else if (hora >= 12 && hora < 18) {
      return "Good Afternoon";
  } else {
      return "Good Evening";
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  document.querySelector("h2").innerText = BuscarHora() + " Wellyngton";
});