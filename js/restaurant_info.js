let restaurant;
let reviews;
var newMap;
let idbPromise;
const notFav = "select as favorite";
const fav = "is Favorite";

/**
* Initialize map as soon as the page is loaded.
*/
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
});

/**
* Initialize leaflet map
*/
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
          mapboxToken:
          'pk.eyJ1IjoiYWh4aWUiLCJhIjoiY2pqaGN4dmxrMGM3OTN2cmwwaG8zemVxdSJ9.B_5RlKDgcUmY4EEcvLndBQ',
          maxZoom: 18,
          attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox.streets'
        }).addTo(newMap);
        fillBreadcrumb();
        DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
      }
    });
  }

  //  window.initMap = () => {
  //   fetchRestaurantFromURL((error, restaurant) => {
  //     if (error) { // Got an error!
  //       console.error(error);
  //     } else {
  //       self.map = new google.maps.Map(document.getElementById('map'), {
  //         zoom: 16,
  //         center: restaurant.latlng,
  //         scrollwheel: false
  //       });
  //       fillBreadcrumb();
  //       DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
  //     }
  //   });
  // }

  /**
  * Get current restaurant from page URL.
  */
  fetchRestaurantFromURL = (callback) => {
    if (self.restaurant) { // restaurant already fetched!
      callback(null, self.restaurant)
      return;
    }
    const id = getParameterByName('id');
    if (!id) { // no id found in URL
      error = 'No restaurant id in URL'
      callback(error, null);
    } else {
      DBHelper.fetchRestaurantById(id, (error, restaurant) => {
        self.restaurant = restaurant;
        if (!restaurant) {
          console.error(error);
          return;
        }
        fillRestaurantHTML();
        callback(null, restaurant)
      });
    }
  }

  /**
  * Create restaurant HTML and add it to the webpage
  */
  fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img'
    // image.src = DBHelper.imageUrlForRestaurant(restaurant);
    // const imgPath = ImageHelper.getImageName(restaurant.photograph);
    if (restaurant.photograph) {
      const imgPath = 'img/' + restaurant.photograph;
      image.src = imgPath + '_520w.jpg';
      image.alt = ImageHelper.getAltText(restaurant.photograph);
    }
    else {
      image.src = 'img/no_image.png';
      image.alt = 'no picture available';
    }

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;


    // fill operating hours
    if (restaurant.operating_hours) {
      fillRestaurantHoursHTML();
    }

    console.log("restaurant favorite status: " + self.restaurant.is_favorite);
    if (self.restaurant.is_favorite === 'true') {
        console.log("restaurant will be loaded as favorite");
        document.getElementById("favorite-button").innerHTML = fav;
    } else {
        console.log("restaurant will be loaded not as favorite");
        document.getElementById("favorite-button").innerHTML = notFav;
    }

    // fill reviews
    fillReviewsHTML(restaurant.id);
  }

  /**
  * Create restaurant operating hours HTML table and add it to the webpage.
  */
  fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
      const row = document.createElement('tr');

      const day = document.createElement('td');
      day.innerHTML = key;
      row.appendChild(day);

      const time = document.createElement('td');
      time.innerHTML = operatingHours[key];
      row.appendChild(time);

      hours.appendChild(row);
    }
  }

  /**
  * Create all reviews HTML and add them to the webpage.
  */
  // fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  // fillReviewsHTML = (reviews = DBHelper.fetchReviewsById(1, (error, reviews) => {
  // })) => {
  function fillReviewsHTML(id) {
    DBHelper.fetchReviewsById(id, (error, reviews) => {
      if (reviews) {
        self.reviews = reviews;
        console.log(self.reviews);
        const container = document.getElementById('reviews-container');
        const title = document.createElement('h3');
        title.innerHTML = 'Reviews';
        container.appendChild(title);

        if (!reviews) {
          const noReviews = document.createElement('p');
          noReviews.innerHTML = 'No reviews yet!';
          container.appendChild(noReviews);
          return;
        }
        const ul = document.getElementById('reviews-list');
        reviews.forEach(review => {
          ul.appendChild(createReviewHTML(review));
        });
        container.appendChild(ul);
      }
    });

  }


  function sendReview(event) {
    event.preventDefault();
    let formData = new FormData(document.querySelector('#review-form'));
    const reviewData = getNewReviewData(formData);
    console.log('send Review to server: ');
    console.log(reviewData);
    DBHelper.sendReviewsToServer(reviewData);
    addNewReviewToHTML(reviewData);
  };

  function getNewReviewData(formData) {
    const restaurant_id = self.restaurant.id;
    const name = formData.get('name');
    const rating = formData.get('rating');
    const comments = formData.get('comments');
    const updatedAt = new Date();

    const reviewData = new Object({
      restaurant_id: restaurant_id,
      name: name,
      rating: rating,
      comments: comments,
      updatedAt: updatedAt
    });
    return reviewData;
  }

  // getCurrentCreationDate = () => {
  //   new Date().format('m-d-Y h:i');
  // }

  function addNewReviewToHTML(review) {
    const container = document.getElementById('reviews-container');
    const ul = document.getElementById('reviews-list');
    ul.appendChild(createReviewHTML(review));
    container.appendChild(ul);
  }

  /**
  * Create review HTML and add it to the webpage.
  */
  createReviewHTML = (review) => {
    const li = document.createElement('li');
    const nameDateContainer = document.createElement('div');
    nameDateContainer.setAttribute('id', 'review-name-date-container');

    const name = document.createElement('p');
    name.setAttribute('id', 'review-name');
    name.innerHTML = review.name;
    nameDateContainer.appendChild(name);
    // li.appendChild(name);

    const date = document.createElement('p');
    date.setAttribute('id', 'review-date');
    if (review.createdAt) {
      date.innerHTML = review.createdAt;
    } else {
      date.innerHTML = new Date();
    }
    nameDateContainer.appendChild(date);
    // li.appendChild(date);
    li.appendChild(nameDateContainer);

    const ratingContainter = document.createElement('div');
    ratingContainter.setAttribute('id', 'review-rating-container');

    const rating = document.createElement('p');
    rating.setAttribute('id', 'review-rating');
    rating.innerHTML = `Rating: ${review.rating}`;
    ratingContainter.appendChild(rating);
    li.appendChild(ratingContainter);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
  }

  /**
  * Add restaurant name to the breadcrumb navigation menu
  */
  fillBreadcrumb = (restaurant=self.restaurant) => {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.innerHTML = restaurant.name;
    breadcrumb.appendChild(li);
  }

  /**
  * Get a parameter by name from page URL.
  */
  getParameterByName = (name, url) => {
    if (!url)
    url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
    if (!results)
    return null;
    if (!results[2])
    return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  document.getElementById("favorite-button").addEventListener("click", function() {

    let favoriteStatus = self.restaurant.is_favorite;
    console.log("favorite status before: " + self.restaurant.is_favorite);

    if (favoriteStatus === 'true') {
      favoriteStatus = 'false';
      document.getElementById("favorite-button").innerHTML = notFav;
    } else {
      favoriteStatus = 'true';
      document.getElementById("favorite-button").innerHTML = fav;
    }

    self.restaurant.is_favorite = favoriteStatus;
    DBHelper.sendFavorite(self.restaurant);
    console.log("favorite status after: " + self.restaurant.is_favorite);
  });


  window.addEventListener('load', function() {
    function updateOnlineStatus(event) {
      var condition = navigator.onLine ? "online" : "offline";
      var indicator = document.getElementById("online-indicator");

      console.log('Status is now: ' + condition);
      if (condition === "offline") {
        alert("No network connection, newly created reviews will be stored and sent when online");
      }
      if (condition === "online") {
        alert("new created reviews will be sent to server");
        DBHelper.sendOfflineRestaurants();
        DBHelper.sendOfflineReviews();
        DBHelper.deleteOfflineReviews();
      }
    }
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  });
