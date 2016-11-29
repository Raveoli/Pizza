var menu = angular.module("menu", []);

menu.controller("MenuCtrl", function ($http) {
    var app = this;
    loadProducts();
    var url = "http://localhost:3000/menu";

    function loadProducts() {
        $http.get('/getMenu').success(function (products) {
            console.log("I got the data I requested");
            console.log(products);
            app.products = products;
        });
    }


})

