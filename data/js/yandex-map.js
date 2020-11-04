$(document).ready(function () {
    ymaps.ready(init);

    function init() {
        var myPlacemark1,
            myMap1 = new ymaps.Map(
                "map",
                {
                    center: [41.2948337, 69.2800393],
                    zoom: 14,
                    controls: ['searchControl', 'zoomControl', 'geolocationControl','fullscreenControl']
                },
                {
                    searchControlProvider: "yandex#search",
                }
            );

        var myPlacemark2,
            myMap2 = new ymaps.Map(
                "map1",
                {
                    center: [41.2948337, 69.2800393],
                    zoom: 14,
                    controls: ['searchControl', 'zoomControl', 'geolocationControl','fullscreenControl']
                },
                {
                    searchControlProvider: "yandex#search",
                }
            );
        var address1 = $("#address-pass");
        var address2 = $("#address-now");

        // Listening for a click on the map
        myMap1.events.add("click", function (e) {
            var coords = e.get("coords");

            // Moving the placemark if it was already created
            if (myPlacemark1) {
                myPlacemark1.geometry.setCoordinates(coords);
            }
            // Otherwise, creating it.
            else {
                myPlacemark1 = createPlacemark(coords);
                myMap1.geoObjects.add(myPlacemark1);
                // Listening for the dragging end event on the placemark.
                myPlacemark1.events.add("dragend", function () {
                    getAddress1(myPlacemark1.geometry.getCoordinates());
                });
            }
            getAddress1(coords);
        });

        myMap2.events.add("click", function (e) {
            var coords = e.get("coords");
            

            // Moving the placemark if it was already created
            if (myPlacemark2) {
                myPlacemark2.geometry.setCoordinates(coords);
            }
            // Otherwise, creating it.
            else {
                myPlacemark2 = createPlacemark(coords);
                myMap2.geoObjects.add(myPlacemark2);
                // Listening for the dragging end event on the placemark.
                myPlacemark2.events.add("dragend", function () {
                    getAddress2(myPlacemark2.geometry.getCoordinates());
                });
            }
            getAddress2(coords);
        });

        // Creating a placemark
        function createPlacemark(coords) {
            return new ymaps.Placemark(
                coords,
                {
                    iconCaption: "searching...",
                },
                {
                    preset: "islands#violetDotIconWithCaption",
                    draggable: true,
                }
            );
        }

        // Determining the address by coordinates (reverse geocoding).
        function getAddress1(coords) {
            myPlacemark1.properties.set("iconCaption", "searching...");
            ymaps.geocode(coords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);

                myPlacemark1.properties.set({
                    // Forming a string with the object's data.
                    iconCaption: [
                        // The name of the municipality or the higher territorial-administrative formation.
                        firstGeoObject.getLocalities().length
                            ? firstGeoObject.getLocalities()
                            : firstGeoObject.getAdministrativeAreas(),
                        // Getting the path to the toponym; if the method returns null, then requesting the name of the building.
                        firstGeoObject.getThoroughfare() ||
                            firstGeoObject.getPremise(),
                    ]
                        .filter(Boolean)
                        .join(", "),
                    // Specifying a string with the address of the object as the balloon content.
                    balloonContent: firstGeoObject.getAddressLine(),
                });
                address1.val(firstGeoObject.getAddressLine());
            });
        }

        // Determining the address by coordinates (reverse geocoding).
        function getAddress2(coords) {
            myPlacemark2.properties.set("iconCaption", "searching...");
            ymaps.geocode(coords).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);
                myPlacemark2.properties.set({
                    // Forming a string with the object's data.
                    iconCaption: [
                        // The name of the municipality or the higher territorial-administrative formation.
                        firstGeoObject.getLocalities().length
                            ? firstGeoObject.getLocalities()
                            : firstGeoObject.getAdministrativeAreas(),
                        // Getting the path to the toponym; if the method returns null, then requesting the name of the building.
                        firstGeoObject.getThoroughfare() ||
                            firstGeoObject.getPremise(),
                    ]
                        .filter(Boolean)
                        .join(", "),
                    // Specifying a string with the address of the object as the balloon content.
                    balloonContent: firstGeoObject.getAddressLine(),
                });
                address2.val(firstGeoObject.getAddressLine());
            });
        }
    }
});
