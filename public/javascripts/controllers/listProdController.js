var menu = angular.module("admin", []);

menu.controller("prodCtrl", function ($http) {
    var app = this;
    loadProducts();
    //var url = "http://localhost:3000/menu";

    function loadProducts() {
        $http.post('/admin/products').success(function (products) {
            app.products = products;
        });
    }


})

