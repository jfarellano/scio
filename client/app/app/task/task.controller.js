(function () {
    'use strict';

    angular.module('app.task')
        .controller('TaskCtrl', [ '$scope', 'taskStorage', 'filterFilter', '$rootScope', '$mdToast', TaskCtrl]);
        
    function TaskCtrl($scope, taskStorage, filterFilter, $rootScope, $mdToast) {
        var tasks, showToast;

        // Toast
        showToast = function(content, type) {
            if(type == 'danger') {
                $mdToast.show({
                    templateUrl: 'toast-danger.html',
                    position: 'bottom right',
                    hideDelay: 2000
                });

                return;
            }

            $mdToast.show(
                $mdToast.simple()
                    .content(content)
                    .position('bottom right')
                    .hideDelay(2000)
            );
        };
        $scope.closeToast = function() {
            $mdToast.hide();
        }; 


        tasks = $scope.tasks = taskStorage.get();
        $scope.newTask = '';
        $scope.remainingCount = filterFilter(tasks, {completed: false}).length;
        $scope.editedTask = null;
        $scope.statusFilter = {
            completed: false
        };

        $scope.filter = function(filter) {
            switch (filter) {
                case 'all':
                    return $scope.statusFilter = '';
                case 'active':
                    return $scope.statusFilter = {
                        completed: false
                    };
                case 'completed':
                    return $scope.statusFilter = {
                        completed: true
                    };
            }
        };

        $scope.add = function() {
            var newTask;
            newTask = $scope.newTask.trim();
            if (newTask.length === 0) {
                return;
            }
            tasks.push({
                title: newTask,
                completed: false
            });
            showToast('New task: "' + newTask + '" added', 'success');
            taskStorage.put(tasks);
            $scope.newTask = '';
            $scope.remainingCount++;
        };

        $scope.edit = function(task) {
            $scope.editedTask = task;
        };

        $scope.doneEditing = function(task) {
            $scope.editedTask = null;
            task.title = task.title.trim();
            if (!task.title) {
                $scope.remove(task);
            } else {
                showToast('Task updated');
            }
            taskStorage.put(tasks);
        };

        $scope.remove = function(task) {
            var index;
            $scope.remainingCount -= task.completed ? 0 : 1;
            index = $scope.tasks.indexOf(task);
            $scope.tasks.splice(index, 1);
            taskStorage.put(tasks);
            showToast('Task removed', 'danger');
        };

        $scope.completed = function(task) {
            $scope.remainingCount += task.completed ? -1 : 1;
            taskStorage.put(tasks);
            if (task.completed) {
                if ($scope.remainingCount > 0) {
                    if ($scope.remainingCount === 1) {
                        showToast('Almost there! Only ' + $scope.remainingCount + ' task left');
                    } else {
                        showToast('Good job! Only ' + $scope.remainingCount + ' tasks left');
                    }
                } else {
                    showToast('Congrats! All done :)', 'success');
                }
            }
        };

        $scope.clearCompleted = function() {
            $scope.tasks = tasks = tasks.filter(function(val) {
                return !val.completed;
            });
            taskStorage.put(tasks);
        };

        $scope.markAll = function(completed) {
            tasks.forEach(function(task) {
                task.completed = completed;
            });
            $scope.remainingCount = completed ? 0 : tasks.length;
            taskStorage.put(tasks);
            if (completed) {
                showToast('Congrats! All done :)', 'success');
            }
        };

        $scope.$watch('remainingCount == 0', function(val) {
            $scope.allChecked = val;
        });

        $scope.$watch('remainingCount', function(newVal, oldVal) {
            $rootScope.$broadcast('taskRemaining:changed', newVal);
        });

    }

})(); 