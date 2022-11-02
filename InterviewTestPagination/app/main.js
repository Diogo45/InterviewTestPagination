(function (angular) {
    "use strict";

    angular
        .module("todoApp")
        .directive("todoPaginatedList", [todoPaginatedList])
        .directive("pagination", [pagination]);

    /**
     * Directive definition function of 'todoPaginatedList'.
     * 
     * TODO: correctly parametrize scope (inherited? isolated? which properties?)
     * TODO: create appropriate functions (link? controller?) and scope bindings
     * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
     * 
     * @returns {} directive definition object
     */
    function todoPaginatedList() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/todo.list.paginated.html",
            scope: {}, // example empty isolate scope
            controller: ["$scope", "$http", controller],
            link: link
        };

        function controller($scope, $http) { // example controller creating the scope bindings
            $scope.todos = [];
            $scope.isLoading = true;
            $scope.page = 1;
            $scope.page_size = 20;
            $scope.filter = "Id";
            // example of xhr call to the server's 'RESTful' api

            $http.get("api/Todo/Todos").then(response => {

                let maxSize = Math.ceil(response.data.length / $scope.page_size);
                $scope.$broadcast("SET_MAX_SIZE", maxSize);

            });

            $scope.UpdateData = function () {

                if ($scope.page_size == "all")
                {
                    $http.get("api/Todo/Todos").then(response => {
                        $scope.todos = response.data
                    });

                    return;
                }

                $http.get("api/Todo/Filtered", {
                    params:
                    {
                        page: $scope.page,
                        page_size: $scope.page_size,
                        order_by: $scope.filter
                    }
                }).then(
                    response => {
                        $scope.todos = response.data;
                        $scope.isLoading = false;
                    }
                );
            }

            $scope.UpdateData();

            $scope.sortTableBy = function (prop) {
                $scope.filter = prop;
                $scope.UpdateData();
            }

            $scope.$on("PAGE_UPDATED", function (e, data) {
                $scope.page = data;
                $scope.UpdateData();

            });

            $scope.$on("PAGESIZE_UPDATED", function (e, data) {
                $scope.page_size = data;
                $scope.UpdateData();

            });
        }

        function link(scope, element, attrs) {


        }

        return directive;
    }

    /**
     * Directive definition function of 'pagination' directive.
     * 
     * TODO: make it a reusable component (i.e. usable by any list of objects not just the Models.Todo model)
     * TODO: correctly parametrize scope (inherited? isolated? which properties?)
     * TODO: create appropriate functions (link? controller?) and scope bindings
     * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
     * 
     * @returns {} directive definition object
     */
    function pagination() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/pagination.html",
            scope: {}, // example empty isolate scope
            controller: ["$scope", controller],
            link: link
        };

        function controller($scope) {

            $scope.pageData = {
                maxPage : 1,
                currentPage : 1,
                pageSize : 20
            }

            $scope.selectOptions = [10, 20, 30, 'all'];
           

            $scope.$on("SET_MAX_SIZE", function (e, data) {
                $scope.pageData.maxPage = data;
            });

            $scope.nextPage = function () {
                if ($scope.pageData.currentPage < $scope.pageData.maxPage) {
                    $scope.pageData.currentPage += 1;
                    $scope.$emit("PAGE_UPDATED", $scope.pageData.currentPage);
                }
            }

            $scope.prevPage = function () {
                if ($scope.pageData.currentPage > 1) {
                    $scope.pageData.currentPage -= 1;
                    $scope.$emit("PAGE_UPDATED", $scope.pageData.currentPage);
                }
            }

            $scope.setPage = function () {
                if ($scope.pageData.currentPage < $scope.pageData.maxPage && $scope.pageData.currentPage > 0) {
                    $scope.$emit("PAGE_UPDATED", $scope.pageData.currentPage);
                }
            }

            $scope.lastPage = function () {
                $scope.$emit("PAGE_UPDATED", $scope.pageData.maxPage);
            }

            $scope.firstPage = function () {
                $scope.$emit("PAGE_UPDATED", 1);
            }

            $scope.changePageSize = function () {
                $scope.$emit("PAGESIZE_UPDATED", $scope.pageData.pageSize);
            }


        }

        function link(scope, element, attrs) {

        }

        return directive;
    }

})(angular);

