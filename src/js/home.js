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
    const data = await response.json();
    if (data.data.movie_count > 0) {
      return data;
      // aquí termina la ejecución de la función
    }
    // si no hay peliculas aquí continúa
    throw new Error('No se encontró ningún resultado');
  }


  const $form = document.getElementById('form')
  const $home = document.getElementById('home')
  const $featuringContainer = document.getElementById('featuring')


  function setAttributes($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute]);
    }
  }

  const BASE_API = 'https://yts.lt/api/v2/'



  function featuringTemplate(peli) {
    return (
      `
      <div class="featuring">
        <div class="featuring-image">
          <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${peli.title}</p>
        </div>
      </div>
      `
    )
  }



  $form.addEventListener('submit', async (event) => {
    //debugger
    event.preventDefault();
    $home.classList.add('search-active');
    const $loader = document.createElement('img');
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    })
    $featuringContainer.append($loader);

    const data = new FormData($form);
    try {
      const {
        data: {
          movies: pelis
        }
      } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
      // debugger
      // const HTMLString = featuringTemplate(peli.data.movies[0])
      const HTMLString = featuringTemplate(pelis[0])
      $featuringContainer.innerHTML = HTMLString;
    } catch (error) {
      // debugger
      alert(error.message);
      $loader.remove();
      $home.classList.remove('search-active');
    }


  })

  function videoItemTemplate(movie, category) {
    return (
      `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
      <div class="primaryPlaylistItem-image">
        <img src="${movie.medium_cover_image}">
      </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>
    `
    )
  }

  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  function addEventClick($element) {
    $element.addEventListener('click', () => {
      // alert('click');
      showModal($element)
    })
  }


  ////////////////// selectores en jQuery///////////////////////////////////
  //const $home = $('.home .list #item')  // por convencion el $ es para saber que es un elemento del DOM


  function renderMovieList(list, $container, category) {
    // borrar imagen loader
    $container.children[0].remove();
    //actionList.data.movies.
    list.forEach((movie) => {
      //debugger.
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);

      //debugger
      //$actionContainer.
      $container.append(movieElement);
      // para esperar que se cargue completamente la imagen
      const image = movieElement.querySelector('img');
      image.addEventListener('load', (event) => {
        // con image sirve también
        // image.srcElement.classList.add('fadeIn');
        event.srcElement.classList.add('fadeIn');
      });
      addEventClick(movieElement);
    })
  }

  async function cacheExists(category) {
    const listName = `${category}List`;
    const cacheList = window.localStorage.getItem(listName);
    // debugger
    if (cacheList) {
      // alert('existe');
      return JSON.parse(cacheList);
    }
    // alert('no existe en el cache')
    const { data: { movies: data } } = await getData(`${BASE_API}list_movies.json?genre=${category}`);
    window.localStorage.setItem(listName, JSON.stringify(data));

    return data;
  }

  // const {data: {movies: actionList}} = await getData(`${BASE_API}list_movies.json?genre=action`)
  const actionList = await cacheExists('action');
  // window no hace falta en realidad
  // localStorage.setItem('actionList', JSON.stringify(actionList))
  const $actionContainer = document.querySelector('#action')
  renderMovieList(actionList, $actionContainer, 'action')

  const dramaList = await cacheExists('drama');
  const $dramaContainer = document.getElementById('drama')
  renderMovieList(dramaList, $dramaContainer, 'drama')

  const animationList = await cacheExists('animation');
  const $animationContainer = document.getElementById('animation')
  renderMovieList(animationList, $animationContainer, 'animation')


    ////////////////////////////////////////////////////////////////////
    async function getUser(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }
  
    function userItemTemplate(user) {
      return (
        `
          <li class="playlistFriends-item">
            <a href="">
              <img class="playlist-friend-image" width="100" src="${user.picture.thumbnail}" alt="">
              <span class="playlist-friend-name">${user.name.first} ${user.name.last}</span>
            </a>
          </li>
          `
      )
    }
  
    function playlistItemplate(movie) {
      return (
        `
          <li class="myPlaylist-item">
            <a href="#">
              <span>${movie.title}</span>
            </a>
          </li>
          `
      )
    }
  
    function renderUserList(list, $container) {
      list.forEach((movie) => {
        const HTMLString = userItemTemplate(movie);
        const playlistElement = createTemplate(HTMLString);
        $container.append(playlistElement);
      })
    }
  
    function renderPlaylist(list, $container) {
      list.forEach((user) => {
        const HTMLString = playlistItemplate(user);
        const userElement = createTemplate(HTMLString);
        $container.append(userElement);
      })
    }
  
    const { results: userList } = await getUser('https://randomuser.me/api/?results=10');
    const $userContainer = document.querySelector('ul');
    renderUserList(userList, $userContainer);
  
    const { data: { movies: fantasyList } } = await getData(`${BASE_API}list_movies.json?genre=fantasy&limit=10`);
    $playListContainer = document.querySelector('.myPlaylist');
    renderPlaylist(fantasyList, $playListContainer);
    /////////////////////////////////////////////////////////////////////


  // sin async
  // let terrorList;
  // getData('https://yts.lt/api/v2/list_movies.json?genre=terror')
  //   .then(function (data){
  //     console.log('terrorList', data);
  //     terrorList = data;
  //   })
  console.log(actionList, dramaList, animationList);
  // console.log('actionList', actionList);

  const $modal = document.getElementById('modal')
  const $overlay = document.getElementById('overlay')
  const $hideModal = document.getElementById('hide-modal')

  // buscar elementos dentro de #modal
  // document.querySelector('#modal img')  así está bien pero se puede optimizar así:
  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');

  function findById(list, id) {
    return list.find(movie => movie.id === parseInt(id, 10));
  }

  function findMovie(id, category) {
    switch (category) {
      case 'action': {
        return findById(actionList, id)
      }
      case 'drama': {
        return findById(dramaList, id)
      }
      default: {
        return findById(animationList, id)
      }
    }

    // podemos escribirlos sin las llaves cuando sólo hay un return y si sólo hay un parámetro
    // se pueden quitar los paréntesis
    // actionList.find((movie) => {
    //   debugger
    //   return movie.id === parseInt(id, 10);
    // })
  }

  function showModal($element) {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const data = findMovie(id, category)

    $modalTitle.textContent = data.title
    $modalImage.setAttribute('src', data.medium_cover_image);
    $modalDescription.textContent = data.description_full
  }

  $hideModal.addEventListener('click', hideModal);
  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .8s forwards';
  }

})();




