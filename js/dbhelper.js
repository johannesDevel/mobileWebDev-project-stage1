/**
* Common database helper functions.
*/
class DBHelper {

  /**
  * Database URL.
  * Change this to restaurants.json file location on your server.
  */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/`;
  }
  /**
  * Fetch all restaurants.
  */
  static fetchRestaurants(callback) {
    if (navigator.onLine) {

      fetch(DBHelper.DATABASE_URL + `restaurants`)
      .then((response) => response.json())
      .then((data) => {
        const restaurants = data;
        DBHelper.fillDatabase(restaurants);
        callback(null, restaurants)
      });
    }
    else {
      idb.open('restaurants-reviews').then(function (db) {
        if (!db) return;
        var tx = db.transaction('restaurants', 'readonly');
        var rest = tx.objectStore('restaurants');
        return rest.getAll();
      }).then(function (response) {
        return response;
      }).then(function (restaurants) {
        callback(null, restaurants);
      })
    }
  }

  // static get openDatabase() {
  //   if (!navigator.serviceWorker) {
  //     return Promise.resolve();
  //   } else {
  //     return idb.open('restaurants-reviews', 1, function(upgradeDb) {
  //       upgradeDb.createObjectStore('restaurants', {
  //         keyPath: 'id' });
  //       upgradeDb.createObjectStore('reviews', {
  //         keyPath: 'id' });
  //       upgradeDb.createObjectStore('reviews', {
  //         keyPath: 'updated' });
  //     });
  //   }
  // }

  static fillDatabase(restaurants) {
    const idbPromise = idb.open('restaurants-reviews', 1, function(upgradeDb) {
      var restaurantsStore = upgradeDb.createObjectStore('restaurants', {
        keyPath: 'id'
      });
    });
    idbPromise.then(function(db) {
      if (!db) return;
      var tx = db.transaction('restaurants', 'readwrite');
      var rest = tx.objectStore('restaurants');
      restaurants.forEach(function(restaurant) {
        rest.put(restaurant);
      });
      return rest.getAll();
    });
  }

  /**
  * Fetch a restaurant by its ID.
  */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
  * Fetch restaurants by a cuisine type with proper error handling.
  */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
  * Fetch restaurants by a neighborhood with proper error handling.
  */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
  * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
  */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
  * Fetch all neighborhoods with proper error handling.
  */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
  * Fetch all cuisines with proper error handling.
  */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
  * Restaurant page URL.
  */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
  * Restaurant image URL.
  */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}`);
  }

  /**
  * Map marker for a restaurant.
  */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
      return marker;
    }
    //  static mapMarkerForRestaurant(restaurant, map) {
    //   const marker = new google.maps.Marker({
    //     position: restaurant.latlng,
    //     title: restaurant.name,
    //     url: DBHelper.urlForRestaurant(restaurant),
    //     map: map,
    //     animation: google.maps.Animation.DROP}
    //   );
    //   return marker;
    // }

    static fetchReviewsById(id, callback) {
      if (navigator.onLine) {
        console.log('is online');
        fetch(DBHelper.DATABASE_URL + `reviews/?restaurant_id=${id}`)
        .then((response) => response.json())
        .then((data) => {
          const reviews = data;
          DBHelper.fillReviewDatabase(reviews);
          const currentReviews = reviews.filter(reviews => reviews.restaurant_id === id);
          console.log('current reveiws');
          console.log(currentReviews);
          callback(null, currentReviews);
        });
      } else {
        console.log('is not online');
        idb.open('restaurants-reviews').then(function (db) {
          if (!db) return;
          var tx = db.transaction('reviews', 'readonly');
          var rest = tx.objectStore('reviews');
          return rest.getAll();
        }).then(function (response) {
          return response;
        }).then(function (reviews) {
          let allReviews = reviews.filter(reviews => reviews.restaurant_id === id);

          // const offlineReviews = idb.open('restaurants-reviews').then(function (db) {
          //   if (!db) return;
          //   var tx = db.transaction('new-reviews', 'readonly');
          //   var rest = tx.objectStore('new-reviews');
          //   return rest.getAll();
          // }).then(function (response) {
          //   return response;
          // }).then(function (offlineReviews) {
          //   const newReviews = offlineReviews.filter(offlineReviews => offlineReviews.restaurant_id === id);
          //   return newReviews;
          // });
          //
          // offlineReviews.then(function (offlineReviews) {
          //   offReviews = offlineReviews;
          // });
          // console.log('offline reviews');
          // console.log(offReviews);
          console.log('online reviews: ');
          console.log(allReviews);
          callback(null, allReviews);
        });
      }
    }

    // static fetchAllReviews() {
    //   fetch(DBHelper.DATABASE_URL + `reviews/`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const reviews = data;
    //     DBHelper.fillReviewDatabase(reviews);
    //   });
    // }

    static fillReviewDatabase(reviews) {
      console.log("saving reviews to database:");
      console.log(reviews);
      const idbPromise = idb.open('restaurants-reviews', 2, function(upgradeDb) {
        var reviewsStore = upgradeDb.createObjectStore('reviews', {
          keyPath: 'id'
        });
      });
      idbPromise.then(function(db) {
        if (!db) return;
        var tx = db.transaction('reviews', 'readwrite');
        var rest = tx.objectStore('reviews');
        reviews.forEach(function(review) {
          console.log('put review in database');
          rest.put(review);
        });
        return rest.getAll();
      });
    }

    static sendReviewsToServer(data = {}) {
      const idbPromise = idb.open('restaurants-reviews', 3, function(upgradeDb) {
        var reviewsStore = upgradeDb.createObjectStore('new-reviews', {
          keyPath: 'updatedAt'
        });
      });
      idbPromise.then(function(db) {
        if (!db) return;
        var tx = db.transaction('new-reviews', 'readwrite');
        var rest = tx.objectStore('new-reviews');
        console.log('put new review in database');
        rest.put(data);
      });

      if (navigator.onLine) {
        return fetch(DBHelper.DATABASE_URL + `reviews`, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, same-origin, *omit
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
          },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // no-referrer, *client
          body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => {
          DBHelper.deleteOfflineReviews();
          response.json();
        }); // parses response to JSON
      }
    }

    static sendOfflineReviews() {
      idb.open('restaurants-reviews').then(function (db) {
        if (!db) return;
        var tx = db.transaction('new-reviews', 'readonly');
        var rest = tx.objectStore('new-reviews');
        return rest.getAll();
      }).then(function (response) {
        return response;
      }).then(function (offlineReviews) {
        console.log('offline reviews sending to server');
        console.log(offlineReviews);
        offlineReviews.forEach(review => {
          if (navigator.onLine) {
            return fetch(DBHelper.DATABASE_URL + `reviews`, {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, cors, *same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "same-origin", // include, same-origin, *omit
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                // "Content-Type": "application/x-www-form-urlencoded",
              },
              redirect: "follow", // manual, *follow, error
              referrer: "no-referrer", // no-referrer, *client
              body: JSON.stringify(review), // body data type must match "Content-Type" header
            })
            .then(response => {
              DBHelper.deleteOfflineReviews();
              response.json();
            }); // parses response to JSON
          }
        });
        DBHelper.deleteOfflineReviews();
      });
    }

    static deleteOfflineReviews() {
      console.log('deleting offline reviews');
      idb.open('restaurants-reviews').then(function (db) {
        if (!db) return;
        var tx = db.transaction('new-reviews', 'readwrite');
        var rest = tx.objectStore('new-reviews').clear();
      });
    }

    static sendFavorite(restaurant) {
        idb.open('restaurants-reviews').then(function(db) {
            if (!db) return;
            var tx = db.transaction('restaurants', 'readwrite');
            var rest = tx.objectStore('restaurants');
            rest.put(restaurant);
          });
        if (navigator.onLine) {
            console.log("change favorite status on server");
            if (restaurant.is_favorite) {
            return fetch(DBHelper.DATABASE_URL +
                    `restaurants/${restaurant.id}/?is_favorite=true`, {
                method: "PUT", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, same-origin, *omit
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                })
              .then(response => {
                response.json();
              }); // parses response to JSON
            }
            else {
                return fetch(DBHelper.DATABASE_URL +
                    `restaurants/${restaurant.id}/?is_favorite=false`, {
                method: "PUT", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, same-origin, *omit
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                })
              .then(response => {
                response.json();
              }); // parses response to JSON
            }
        }
    }



    // static fetchReviewsById(restaurant_id, callback) {
    //   DBHelper.fetchReviews((error, reviews) => {
    //     if (error) {
    //       callback(error, null);
    //     } else {
    //       const reviewsForId = reviews.find(r => r.restaurant_id == restaurant_id);
    //       if (reviewsForId) {
    //         callback(null, reviewsForId);
    //       } else {
    //         callback('Reviews do not exist', null);
    //       }
    //     }
    //   });
    // }
    //
    // static fetchReviews(callback) {
    //   fetch('http://localhost:1337/reviews')
    //     .then((response) => response.json())
    //     .then((data) => {
    //       const reviews = data;
    //       callback(null, reviews)
    //     });
    // }

  }
