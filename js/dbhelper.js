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
    return `http://localhost:${port}/restaurants`;
  }
  /**
  * Fetch all restaurants.
  */
  static fetchRestaurants(callback) {

    // fetch('http://localhost:1337/restaurants')
    //     .then((res) => res.json())
    //     .then((data) => {
    //         debugger;
    //         console.log(data);
    // });

    // fetch(DBHelper.DATABASE_URL).then(
    //   function(response) {
    //     return response.json();
    //   }).then(getResponses);
    //
    // function getResponses(data) {
    //   console.log(data);
    // }
    //
    // var dbPromise = idb.open('testdb', 4, function(upgradeDb) {
    //   switch(upgradeDb.oldVersion) {
    //     case 0:
    //       var keyValStore = upgradeDb.createObjectStore('keyval');
    //       keyValStore.put('world', 'hello');
    //     case 1:
    //       upgradeDb.createObjectStore('people', { keyPath: 'name'});
    //     case 2:
    //       var peopleStore = upgradeDb.transaction.objectStore('people');
    //       peopleStore.createIndex('animal', 'favoriteAnimal');
    //     case 3:
    //       peopleStore = upgradeDb.transaction.objectStore('people');
    //       peopleStore.createIndex('age', 'age');
    //   }
    // });

    // dbPromise.then(function(db) {
    //   var tx = db.transaction('keyval');
    //   var keyValStore = tx.objectStore('keyval');
    //   return keyValStore.get('hello');
    // }).then(function(val) {
    //   console.log('The value of "hello" is: ', val);
    // });
    //
    // dbPromise.then(function(db) {
    //   var tx = db.transaction('keyval', 'readwrite');
    //   var keyValStore = tx.objectStore('keyval');
    //   keyValStore.put('bar', 'foo');
    //   return tx.complete;
    // }).then(function() {
    //   console.log('Added foo:bar to keyval');
    // });
    //
    // dbPromise.then(function(db) {
    //   var tx = db.transaction('keyval', 'readwrite');
    //   var keyValStore = tx.objectStore('keyval');
    //   keyValStore.put('cat', 'favoriteAnimal');
    //   return tx.complete;
    // }).then(function() {
    //   console.log('Added cat to keyVal');
    // });
    //
    // dbPromise.then(function(db) {
    //   var tx = db.transaction('people', 'readwrite');
    //   var peopleStore = tx.objectStore('people');
    //
    //   peopleStore.put({
    //     name: 'Johannes',
    //     age: 27,
    //     favoriteAnimal: 'dog'
    //   });
    //
    //   peopleStore.put({
    //     name: 'Annamaria',
    //     age: 25,
    //     favoriteAnimal: 'cat'
    //   });
    //
    //   peopleStore.put({
    //     name: 'Max',
    //     age: 33,
    //     favoriteAnimal: 'turtle'
    //   });
    //   return tx.complete;
    // }).then(function() {
    //   console.log('Person added');
    // });

    // dbPromise.then(function(db) {
    //   var tx = db.transaction('people');
    //   var peopleStore = tx.objectStore('people');
    //   var animalIndex = peopleStore.index('animal');
    //   return peopleStore.getAll();
    // }).then(function(people) {
    //   console.log('People: ', people);
    // });
    //
    // dbPromise.then(function(db) {
    //   var tx = db.transaction('people');
    //   var peopleStore = tx.objectStore('people');
    //   var ageIndex = peopleStore.index('age');
    //
    //   return ageIndex.openCursor();
    // }).then(function logPerson(cursor) {
    //   if (!cursor) return;
    //   console.log('Cursored at: ', cursor.value.name);
    //   return cursor.continue().then(logPerson);
    // }).then(function() {
    //   console.log('Done cursoring');
    // });



    fetch(DBHelper.DATABASE_URL)
          .then((res) => res.json())
          .then((data) => {
              const restaurants = data;
              console.log(restaurants);
              // if (!db) return;
              idbPromise.then(function(db) {
              var tx = db.transaction('restaurants-reviews', 'readwrite');
              var restarantsTable = tx.objectStore('restarants-reviews');
              restarants.forEach(function(restaurant) {
                restarantsTable.put(restaurant);
              });
            });
              callback(null,restaurants)
      });

    // return fetch(`${DBHelper.DATABASE_URL}`)
    // .then((res) => {
    //   return res.json();
    // }).then((res) => {
    //   const restaurants = res;
    //   callback(null,restaurants)
    // }).catch((error) => {
    //   callback(error,null)
    // })



    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', DBHelper.DATABASE_URL);
    // xhr.onload = () => {
    //   if (xhr.status === 200) { // Got a success response from server!
    //     const json = JSON.parse(xhr.responseText);
    //     const restaurants = json.restaurants;
    //     callback(null, restaurants);
    //   } else { // Oops!. Got an error from server.
    //     const error = (`Request failed. Returned status of ${xhr.status}`);
    //     callback(error, null);
    //   }
    // };
    // xhr.send();
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

  }
