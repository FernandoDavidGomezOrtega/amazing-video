console.log('Hola mundo!');

const noCambia = 'Fernando Gómez'
let cambia = '@FernandoGomez'

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}

const getUserAll = new Promise(function (todoBien, todoMal) {
  // llamar a un api
  setTimeout(() => {
    // luego de 3 segundos
    todoBien('se acabó el tiempo')
  }, 3000);
})

const getUser = new Promise(function (todoBien, todoMal) {
  // llamar a un api
  setTimeout(() => {
    // luego de 3 segundos
    todoBien('se acabó el tiempo 3')
  }, 3000);
})
// getUser
//   .then(function(){
//     console.log('todo está bien en la vida');
//   })
//   .catch((message) => {
//     console.log(message);
//   })

// Promise.race([
//   getUser,
//   getUserAll,
// ])
//   .then((message) => {
//     console.log(message);
//   })
//   .catch(function(message) {
//     console.log(message);
//   })


////////////////////// con jQuery y Ajax
// $.ajax('https://randomuser.me/api/', {
//   method: 'GET',
//   success: function(data){
//     console.log(data);
//   },
//   error: function(error){
//     console.log(error);
//   }
// })

///////////////////// con javascript vanilla
fetch('https://randomuser.me/api/')
  .then(function (response) {
    // console.log(response);
    return response.json()
  })
  .then(function (user) {
    console.log('user', user.results[0].name.first);
  })
  .catch(() => {
    console.log('algo falló');
  });

(async function load() {
  //await
  async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data
  }

  const actionList = await getData('https://yts.lt/api/v2/list_movies.json?genre=action')
  const dramaList = await getData('https://yts.lt/api/v2/list_movies.json?genre=drama')
  const animationList = await getData('https://yts.lt/api/v2/list_movies.json?genre=animation')
  //debugger

  function videoItemTemplate(movie) {
    return (
      `<div class="primaryPlaylistItem">
      <div class="primaryPlaylistItem-image">
        <img src="${movie.medium_cover_image}">
      </div>
      <h4 class="primaryPlaylistItem-title">
        ${movie.title}
      </h4>
    </div>`
    )
  }

  function createTemplate(HTMLString){
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  // console.log(videoItemTemplate('../src/images/covers/bitcoin.jpg', 'bitcoin'));
  ////////////////// selectores en jQuery///////////////////////////////////
  //const $home = $('.home .list #item')  // por convencion el $ es para saber que es un elemento del DOM


  function renderMovieList(list, $container){
    // borrar imagen loader
    $container.children[0].remove();
    //actionList.data.movies.
    list.forEach((movie) => {
      //debugger.
      const HTMLString = videoItemTemplate(movie);
      const movieElement = createTemplate(HTMLString);
  
      //debugger
      //$actionContainer.
      $container.append(movieElement);
      //console.log(HTMLString);
    })
  }

  const $actionContainer = document.querySelector('#action')
  renderMovieList( actionList.data.movies, $actionContainer)

  const $dramaContainer = document.getElementById('drama')
  renderMovieList( dramaList.data.movies, $dramaContainer)

  const $animationContainer = document.getElementById('animation')
  renderMovieList( animationList.data.movies, $animationContainer)


  // sin async
  // let terrorList;
  // getData('https://yts.lt/api/v2/list_movies.json?genre=terror')
  //   .then(function (data){
  //     console.log('terrorList', data);
  //     terrorList = data;
  //   })
  console.log(actionList, dramaList, animationList);
  // console.log('actionList', actionList);


  const $featuringContainer = document.getElementById('featuring')
  const $form = document.getElementById('form')
  const $home = document.getElementById('home')

  const $modal = document.getElementById('modal')
  const $overlay = document.getElementById('overlay')
  const $hideModal = document.getElementById('hide-modal')

  // buscar elementos dentro de #modal
  // document.querySelector('#modal img')  así está bien pero se pude optimizar así:
  const $modalImage = $modal.querySelector('img');
  const $modalTitle = $modal.querySelector('h1');
  const $modalDescription = $modal.querySelector('p');



})();




