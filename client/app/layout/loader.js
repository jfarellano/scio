(function () {
    var $body = $('#body')
    var $loader = $('#loader-container')

    $(window).load(function(){
        setTimeout( hideLoader , 1000)
    });

    function hideLoader() {
        $loader.fadeOut('slow')
    }
})(); 
