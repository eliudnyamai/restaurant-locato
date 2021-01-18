window.addEventListener("load", function () {
  $(document).on("change", "#restaurant-filter", function () {
    let storedData = JSON.parse(localStorage.getItem("restaurants"));
    if (!storedData) {
      fetch("./restaurants.json")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          initialize_map(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      initialize_map(storedData);
    }
  });
  //let the select auto-select when page loads
  var element = document.getElementById("restaurant-filter");
  var event = new Event("change", { bubbles: true });
  element.dispatchEvent(event);
});

$(document).on("click", "#submit-review", function () {
    $("#reviewModal").modal("hide");
    var reviewText = $("#review-text").val();
    var reviewStars = $("#review-stars  option:selected").val();
    var featureId = +$("#feature-id").val();
    restaurant = new Restaurant("restaurants.json");
    restaurant.addReview(reviewText, reviewStars, featureId);
    restaurant.loadUpdatedRestaurantsData();
    $("#feedback").show();
    setTimeout(function () {
      $("#feedback").hide();
    }, 2000);
});
$(document).on("click", "#add-restaurant", function () {
  var lat = +$("#lat").val();
  var lng = +$("#lng").val();
  var newResName = $("#res-name").val();
  latlang = { lng, lat };
  let restaurant = new Restaurant("restaurants.json");
  restaurant.storeRestaurant(latlang, newResName);
  restaurant.loadUpdatedRestaurantsData();
  $("#feedback").show();
  setTimeout(function () {
      $("#feedback").hide();
  }, 2000);
});

$("#reviewModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget);
  var recipient = button.data("whatever"); 
  var modal = $(this);
  modal.find(".modal-body input").val(recipient);
});
