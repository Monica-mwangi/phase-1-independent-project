const characters = document.getElementById("character details");
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const favourites = document.getElementById("favoritesList");

//fetch and display the search results
fetch("`https://thronesapi.com/api/v2/Characters?firstname=${searchTerm}`")
.then (response =>response.json())
.then(data => {
    console.log(data);
    data.results.forEach(character => {
        const li = document.createElement("li");
        li.textContent = character.name;
        li.setAttribute("class", "list-group-item");
        characters.appendChild(li);
    });
});
 // Event listener for search input
 searchInput.addEventListener('input', debounce(searchCharacters, 300));
