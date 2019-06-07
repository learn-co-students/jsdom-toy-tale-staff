
function toggleFormVisibility() {
  // hide & seek with the form
  const toyFormContainer = document.querySelector('.container');
  if (!toyFormContainer.style.display || toyFormContainer.style.display == 'none') {
    toyFormContainer.style.display = 'block'
  } else {
    toyFormContainer.style.display = 'none'
  }
}

function resetForm() {
  const toyForm = document.querySelector('.add-toy-form');
  toyForm.reset();
}

function handleFormSubmit(event) {
  event.preventDefault();
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    })
  }).then( (response) => {
    return response.json();
  }).then( (json) => {
    const toyCollection = document.querySelector('#toy-collection');
    // it comes from the server as a string, but we want it to be an int
    json["likes"] = parseInt(json["likes"]);
    const toyCard = addToyCard(json);
    toyCollection.appendChild(toyCard);
    resetForm();
    toggleFormVisibility();
  }).catch( (err) => {
    alert(`Failed to add new toy. Full error message was: ${err}`);
  });
}

function increaseLikeCount(event, toyData) {
  const id = toyData["id"];
  toyData["likes"]++;

  fetch(`http://localhost:3000/toys/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": toyData["likes"]
    })
  }).then( (response) => {
    return response.json();
  }).then( (json) => {
    updateLikeCount(event, json["likes"]);
  }).catch( (err) => {
    toyData["likes"]--;
    alert(`Failed to add more likes. Full error message was: ${err}`);
  });
}

function updateLikeCount(event, updatedLikesFromServer) {
  const likeButton = event.target;
  const card = likeButton.parentElement;
  const likeCountSpan = card.querySelector('#like-count');
  likeCountSpan.innerText = updatedLikesFromServer;
}

function addToyCard(toyData) {

  // <div class="card"></div>
  const toyCard = document.createElement('div');
  toyCard.className = "card";

  // <h2>:name</h2>
  const toyHeading = document.createElement('h2');
  toyHeading.innerText = toyData["name"];

  /*
    <div class="card">
      <h2>:name</h2>
    </div>
  */
  toyCard.appendChild(toyHeading);

  // <img src=":image" class="toy-avatar">
  const toyImage = document.createElement('img');
  toyImage.src = toyData["image"];
  toyImage.className = "toy-avatar";

  /*
    <div class="card">
      <h2>:name</h2>
      <img src=":image" class="toy-avatar">
    </div>
  */
  toyCard.appendChild(toyImage);

  // <p></p>
  const toyLikes = document.createElement('p');

  // <span id="like-count">:likes</span>
  const likeCountSpan = document.createElement('span');
  likeCountSpan.innerText = toyData["likes"];
  likeCountSpan.id = "like-count";

  // <p><span id="like-count">:likes</span></p>
  toyLikes.appendChild(likeCountSpan);

  // " Likes"
  const toyLikesText = document.createTextNode(" Likes");

  // <p><span id="like-count">:likes</span> Likes</p>
  toyLikes.appendChild(toyLikesText);

  /*
    <div class="card">
      <h2>:name</h2>
      <img src=":image" class="toy-avatar">
      <p><span id="like-count">:likes</span> Likes</p>
    </div>
  */
  toyCard.appendChild(toyLikes);

  // <button class="like-btn">Like <3</button>
  const toyLikeButton = document.createElement('button');
  toyLikeButton.className = "like-btn";
  toyLikeButton.innerText = "Like <3";

  /*
    invoking the method in an anonymous function to customize params
    if we said `.addEventListener("click", increaseLikeCount);`, that method
    would only get the event data, but we want it to have `toyData` too
  */
  toyLikeButton.addEventListener("click", (ev) => increaseLikeCount(ev, toyData));

  /*
    <div class="card">
      <h2>:name</h2>
      <img src=":image" class="toy-avatar">
      <p><span id="like-count">:likes</span> Likes</p>
      <button class="like-btn">Like <3</button>
    </div>
  */
  toyCard.appendChild(toyLikeButton);

  return toyCard;
}

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.querySelector('#new-toy-btn');
  addBtn.addEventListener('click', toggleFormVisibility);

  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener("submit", handleFormSubmit);

  fetch("http://localhost:3000/toys")
  .then( (response) => {
    return response.json();
  })
  .then( (json) => {
    const toyCollection = document.querySelector('#toy-collection');
    for (const toyData of json) {
      // it comes from the server as a string, but we want it to be an int
      toyData["likes"] = parseInt(toyData["likes"]);
      const toyCard = addToyCard(toyData);
      toyCollection.appendChild(toyCard);
    }
  }).catch( (err) => {
    alert(`Toys DB failed to load.  Are you sure you started the JSON server? Full error message was: ${err}`);
  });

});
