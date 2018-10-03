(function () {
  /* Initialize firebase */
  let config = {
    apiKey: "AIzaSyBlFJVRhkxDSUCRCZatc_d9mbShWfr9Xug",
    databaseURL: "https://wot-1819-85183.firebaseio.com",
  }

  firebase.initializeApp(config);

  /* Global variables */
  const database = firebase.database();
  const ref = database.ref('characters');
  const grid = document.querySelector('.grid__wrapper');
  const message_container = document.querySelector('.message-container');

  /* Generate the grid */
  generateGrid();

  /* Functions */

  /* Generate a 8x8 grid */
  function generateGrid() {
    clearGrid();
    for (let i = 1; i < 65; i++) {
      const new_element = document.createElement('div');
      new_element.addEventListener("click", () => {
        clearMessage();
        if (new_element.getAttribute('data-checked') === 'true') {
          new_element.style.backgroundColor = 'yellow';
          new_element.setAttribute('data-checked', false);
        }
        else {
          new_element.style.backgroundColor = 'red';
          new_element.setAttribute('data-checked', true);
        }
      });
      new_element.innerHTML = i;
      new_element.classList.add('grid__item');
      new_element.setAttribute('data-id', i);
      grid.appendChild(new_element);
    }
  }

  /* Clear the messagebox */
  function clearMessage() {
    message_container.innerHTML = '';
  }

  /* Get the characters from Firebase */
  function GetCharacters() {
    // Return promise
    return new Promise((resolve, reject) => {
      ref.once('value').then((snapshot) => {
        return resolve(snapshot);
      }).catch((e) => {
        return reject(e);
      });
    });
  }

  /* Display the character on the grid */
  function displayCharacter(character) {
    for (let bit of character) {
      const new_elem = document.createElement('div');
      new_elem.classList.add('grid__item');
      if (parseInt(bit) === 1) {
        new_elem.classList.add('grid__item--red');
      }
      grid.appendChild(new_elem);
    }
  }

  function clearGrid() {
    const grid = document.querySelector('.grid__wrapper');
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
  }

  /* 
  Add an eventlistener to the loop button
  Get the data returned by the GetCharacters() promise
  Create a new promise to delay the forEach loop
  Loop over the characters and display them on the grid 
  */
  document.getElementById('loop').addEventListener('click', () => {
    let promise = Promise.resolve();
    GetCharacters().then((characters) => {
      characters.forEach((character) => {
        promise = promise.then(() => {
          return new Promise((res) => {
            setTimeout(res, 1000);
            clearGrid();
            displayCharacter(character.val().string);
          });
        });
      });
    });
  });

  /* 
  Add an eventlistener to the show-all button 
  Get the data returned by the GetCharacters() promise
  Loop over the characters and display them in the character_container
  Add an eventlistener to each character and trigger the display on each click
  */
  document.getElementById('show-all').addEventListener('click', () => {
    const character_container = document.querySelector('.character-container');
    GetCharacters().then((characters) => {
      characters.forEach((character) => {
        const new_elem = document.createElement('p');
        new_elem.innerHTML = character.val().string;
        new_elem.addEventListener('click', () => {
          clearGrid();
          displayCharacter(character.val().string);
        });
        character_container.appendChild(new_elem);
      });
    });
  });

  /* 
  Add an eventlistener to the confirm button
  Loop over all the grid-items and get their data-checked attribute
  Append the data-checked value to the string
  Create a new reference in the firebase database, append all of the needed information.
  Display a message wheter the item has been pushed successfully or not.
  */
  document.getElementById('confirm').addEventListener('click',() => {
    let string_character = '';
    document.querySelectorAll('.grid__item').forEach((item) => {
      const item_checked = item.getAttribute('data-checked');
      console.log(item.getAttribute('data-checked'))
      if (item_checked === 'true') {
        string_character += 1;
      }
      else {
        string_character += 0;
      }
    });
    if (string_character.includes('1')) {
      const newPostRef = ref.push();
      const promise = newPostRef.set({
        rows: 8,
        cols: 8,
        string: string_character,
      });
      promise.then(e => {
        console.log('Succesfully inserted data');
        document.querySelector('.message-container').innerHTML = 'Data succesvol aan database toegevoegd.';
        generateGrid();
      });
      promise.catch(e => {
        document.querySelector('.message-container').innerHTML = 'Kon data niet toevoegen aan database.';
        console.log('An error occured: ' + e.message);
      });
    }
    else {
      message_container.innerHTML = 'Selecteer tenminste 1 vakje'
    }

  });

})();