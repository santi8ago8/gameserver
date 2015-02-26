(function (window) {
    io('ws://' + window.location.hostname + ':6868')
        .on('restart', function () {
            window.location.reload();
        });

})(window);