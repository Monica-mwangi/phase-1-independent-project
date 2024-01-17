document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const searchResults = document.getElementById('searchResults');
    const characterDetails = document.getElementById('characterDetails');
    const favoritesList = document.getElementById('favoritesList');
    const commentInput = document.getElementById('commentInput');
    const commentsList = document.getElementById('commentsList');

    let favorites = getFavoritesFromStorage();

    // Event listener for search input
    searchInput.addEventListener('input', debounce(searchCharacters, 300));

    // Event listener for favorites list
    favoritesList.addEventListener('click', (event) => {
        if (event.target.classList.contains('like-button')) {
            const characterName = event.target.dataset.character;
            toggleFavorite(characterName);
            renderFavorites();
        }
    });

    // Fetch and display characters
    function searchCharacters() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm.length === 0) {
            searchResults.innerHTML = '';
            return;
        }

        fetch(`https://thronesapi.com/api/v2/Characters?firstname=${searchTerm}`)
            .then(response => response.json())
            .then(data => displaySearchResults(data))
            .catch(error => console.error(error));
    }

    // Display search results
    function displaySearchResults(results) {
        searchResults.innerHTML = '';

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `
                <h3>${result.fullName}</h3>
                <img src="${result.imageUrl}" alt="${result.fullName}">
                <p>${result.title || 'No Title'}</p>
                <button onclick="showCharacterDetails(${result.id})">Details</button>
                <button class="like-button" data-character="${result.fullName}">${isFavorite(result.fullName) ? 'Unlike' : 'Like'}</button>
            `;
            searchResults.appendChild(resultItem);
        });
    }

    // Show character details
    function showCharacterDetails(characterId) {
        fetch(`https://thronesapi.com/api/v2/Characters/${characterId}`)
            .then(response => response.json())
            .then(data => displayCharacterDetails(data))
            .catch(error => console.error(error));
    }

    // Display character details
    function displayCharacterDetails(details) {
        characterDetails.innerHTML = `
            <h2>${details.fullName}</h2>
            <p>${details.title || 'No Title'}</p>
            <p>House: ${details.family || 'Unknown'}</p>
            <p>Gender: ${details.gender || 'Unknown'}</p>
            <p>Birth: ${details.birth || 'Unknown'}</p>
            <p>Death: ${details.death || 'Unknown'}</p>
        `;
    }

    // Toggle favorite status
    function toggleFavorite(characterName) {
        if (isFavorite(characterName)) {
            favorites = favorites.filter(name => name !== characterName);
        } else {
            favorites.push(characterName);
        }

        saveFavoritesToStorage();
    }

    // Check if a character is a favorite
    function isFavorite(characterName) {
        return favorites.includes(characterName);
    }

    // Render favorites list
    function renderFavorites() {
        favoritesList.innerHTML = '';

        favorites.forEach(characterName => {
            const favoriteItem = document.createElement('li');
            favoriteItem.textContent = characterName;
            favoritesList.appendChild(favoriteItem);
        });
    }

    // Save favorites to local storage
    function saveFavoritesToStorage() {
        localStorage.setItem('gotFavorites', JSON.stringify(favorites));
    }

    // Get favorites from local storage
    function getFavoritesFromStorage() {
        const storedFavorites = localStorage.getItem('gotFavorites');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    }

    // Debounce function to delay search input processing
    function debounce(func, delay) {
        let timeoutId;
        return function () {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, arguments);
            }, delay);
        };
    }

    // Add comment
    function addComment() {
        const commentText = commentInput.value.trim();

        if (commentText.length === 0) {
            return;
        }

        // Replace 'someCharacterId' with the actual character ID
        const characterId = 'someCharacterId';

        // create an object to hold the comment data
        const commentData = { comment: commentText };

        // post request for adding comments
        fetch(`https://thronesapi.com/api/v2/Characters/${characterId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        })
            .then(response => response.json())
            .then(data => {
                // it handles the response from the server
                if (data.success) {
                    alert('Comment added successfully');
                } else {
                    alert('Failed to add comment');
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        // Clear the comment input
        commentInput.value = '';
    }

    // Delete comment
    function deleteComment() {
        // Implement logic to delete a comment
        // For example, you can remove the last child of the commentsList
        const lastComment = commentsList.lastChild;
        if (lastComment) {
            commentsList.removeChild(lastComment);
        }
    }
});




  
  