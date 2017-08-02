(function () {
    'use strict';
    angular.module('app.layout')
        .directive('includeReplace', includeReplace)

        // sidebar
        .directive('toggleSidebar', toggleSidebar)
        .directive('autoCloseMobileSidebar', ['$rootScope', '$timeout', autoCloseMobileSidebar])
        .directive('accordionNav', accordionNav)
        .directive('highlightActive', highlightActive)
        .directive('appendSubMenuIcon', appendSubMenuIcon)
        .directive('slimScroll', slimScroll)

        // overlay
        .directive('searchOverlay', ['$timeout', searchOverlay])
        .directive('openSearchOverlay', ['$rootScope', openSearchOverlay])

        // quickview
        .directive('toggleQuickview', toggleQuickview)

        // Loader
        .directive('uiPreloader', ['$rootScope', uiPreloader])


    // used with ng-include, replace origial one with children element
    // note: transclude is false
    function includeReplace() {
        var directive = {
            require: 'ngInclude',
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, el) {
            el.replaceWith(el.children());
        }
    }

    // off-canvas sidebar for mobile, and this is the trigger
    function toggleSidebar() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, el) {
            var $el = $(el[0]);
            var $body = $('#body');

            $el.on('click', function(e) {
                // _sidebar.scss, _page-container.scss
                $body.toggleClass('sidebar-mobile-open') 
                e.preventDefault();
            });
        }
    }

    // Mobile only: automatically close sidebar on route change. 
    // require ui-router
    function autoCloseMobileSidebar($rootScope, $timeout) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, el) {
            var $body = $('#body');

            // `$stateChangeSuccess` for ui-router, `routeChangeSuccess` for ng-route
            $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
                // use $timeout is better, otherwise there won't be a off-cavans sidebar slide to code transition 
                $timeout(function() {
                    // .sidebar-mobile-open is mobile specific, add/remove it on desktop won't have any side effect
                    $body.removeClass('sidebar-mobile-open');
                }, 0)
            });
        }
    }

    // for accordion/collapse style NAV, multi-level nav
    // use on nav `ul` tag
    function accordionNav() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            var $nav
               ,slideTime
               ,$lists
               ,$As
               ;

            // on click, open it's own ul, close sibling li opened ul & sub ul
            // on click, close it's own ul & sub ul

            $nav = $(ele[0]);
            slideTime = 250;
            $lists = $nav.find('ul').parent('li'); // lists has ul
            $lists.append('<i class="material-icons icon-has-ul">arrow_drop_down</i>');
            $As = $lists.children('a');

            // Disable a link that has ul
            $As.on('click', function(event) {
                event.preventDefault();
            });

            // Accordion nav
            $nav.on('click', function(e) {

                var target = e.target;
                var $parentLi = $(target).closest('li') // closest, insead of parent, so it still works when click on i icons
                if (!$parentLi.length) return; // return if doesn't click on li
                var $subUl = $parentLi.children('ul')


                // var depth = $subUl.parents().length; // but some li has no sub ul, so...
                var depth = $parentLi.parents().length + 1;
                
                // filter out all elements (except target) at current depth or greater
                var allAtDepth = $nav.find('ul').filter(function() {
                    if($(this).parents().length >= depth && this !== $subUl.get(0)) {
                        return true; 
                    }
                })
                allAtDepth.slideUp(slideTime).closest('li').removeClass('open');

                // Toggle target 
                if ( $parentLi.has('ul').length ) {
                    $parentLi.toggleClass('open');
                }
                $subUl.stop().slideToggle(slideTime);

            })
        }
    }

    function highlightActive() {
        var directive = {
            restrict: 'A',
            controller: [ '$scope', '$element', '$attrs', '$location', highlightActiveCtrl]
        };

        return directive;

        function highlightActiveCtrl($scope, $element, $attrs, $location) {
            var highlightActive, links, path;

            links = $element.find('a');

            path = function() {
                return $location.path();
            };

            highlightActive = function(links, path) {
                path = '#' + path;
                angular.forEach(links, function(link) {
                    var $li, $link, href;
                    $link = angular.element(link);
                    $li = $link.parent('li');
                    href = $link.attr('href');
                    if ($li.hasClass('active')) {
                        $li.removeClass('active');
                    }
                    if (path.indexOf(href) === 0) {
                        $li.addClass('active');
                    }
                });
            };

            highlightActive(links, $location.path());

            $scope.$watch(path, function(newVal, oldVal) {
                if (newVal === oldVal) return;
                
                highlightActive(links, $location.path());
            });

        }

    }

    // need to add class '.prepend-icon' to a link that appends icon first
    function appendSubMenuIcon() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, el) {
            var $el = $(el[0]);

            $el.find('.prepend-icon').prepend('<i class="material-icons">keyboard_arrow_right</i>');
        }
    }

    function slimScroll() {
        return {
            restrict: 'A',
            link: function(scope, el, attrs) {
                var $el = $(el[0]);
                $el.slimScroll({
                    height: attrs.scrollHeight || '100%'
                });
            }
        };
    }


    function searchOverlay($timeout) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, el) {
            var $el = $(el[0]),
                $body = $('#body'),
                $search_input = $el.find('#overlay-search-input'),
                $closeOverlayBtn = $el.find('#overlay-close');


                // $timeout(function() {
                //     // .sidebar-mobile-open is mobile specific, add/remove it on desktop won't have any side effect
                //     $body.removeClass('sidebar-mobile-open');
                // }, 0)


            // open overlay & auto focus input box
            var openOverlay = function () {
                $body.addClass('overlay-active');

                // [delay] should >= `visibility` transition duration in CSS, see _overlay.scss, otherwise auto-focus won't work since element is not there
                $timeout(function() {
                    $search_input.focus();
                }, 301) 
            }

            // close overlay and reset search input value
            var closeOverlay = function () {
                $body.removeClass('overlay-active');
                $search_input.val(function() {
                    return this.defaultValue;
                });
            }

            // events
            scope.$on('searchOveraly:open', function() {
                openOverlay();
            })

            $el.on('keyup', function(e) {
                if ( e.keyCode == 27) { // when ESC is pressed
                    closeOverlay();
                }
            });

            $closeOverlayBtn.on('click', function(e) {
                closeOverlay();
                e.preventDefault();
            })

        } 
    }

    function openSearchOverlay($rootscope) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, el, attrs) {
            var $body = $('#body');
            var $el = $(el[0]);

            $el.on('click', function(e) {
                $rootscope.$broadcast('searchOveraly:open');

                e.preventDefault();
            });
        }
    }

    function toggleQuickview() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, el, attrs) {
            var $el = $(el[0]);
            var $body = $('#body');

            $el.on('click', function(e) {
                var qvClass = 'quickview-open';

                if (attrs.target) {
                    var qvClass = qvClass + '-' + attrs.target;
                }

                // CSS class on body instead of #quickview
                // because before ng-include load quickview.html, you'll fail to get $('#')
                $body.toggleClass(qvClass);
                e.preventDefault();
            });

        }
    }

    function uiPreloader($rootScope) {
        return {
            restrict: 'A',
            template:'<span class="bar"></span>',
            link: function(scope, el, attrs) {        
                el.addClass('preloaderbar hide');
                scope.$on('$stateChangeStart', function(event) {
                    el.removeClass('hide').addClass('active');
                });
                scope.$on('$stateChangeSuccess', function( event, toState, toParams, fromState ) {
                    event.targetScope.$watch('$viewContentLoaded', function(){
                        el.addClass('hide').removeClass('active');
                    })
                });

                scope.$on('preloader:active', function(event) {
                    el.removeClass('hide').addClass('active');
                });
                scope.$on('preloader:hide', function(event) {
                    el.addClass('hide').removeClass('active');
                });                
            }
        };        
    }

})(); 
