(function()
{
    function downloadFile(url, fileName)
    {
        // for non-IE
        if (!window.ActiveXObject) {
            var save = document.createElement('a');
            save.href = url;
            save.target = '_blank';
            save.download = fileName || 'unknown';

            var event = document.createEvent('Event');
            event.initEvent('click', true, true);
            save.dispatchEvent(event);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }

        // for IE
        else if ( !! window.ActiveXObject && document.execCommand)     {
            var _window = window.open(url, '_blank');
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fileName || url)
            _window.close();
        }
    }

    function parseSong(elem)
    {
        var url = elem.value;
        console.log('Url:' + url);

        var ind = url.indexOf(',');
        url = url.substr(0, ind);
        console.log('Url parsed:' + url);

        console.log('Download start');
        var name = url;

        var fi = url.lastIndexOf('/');
        var li = url.lastIndexOf('.mp3');

        name = url.substr(fi + 1, li - fi) + 'mp3';

        console.log('Filename:' + name);

        downloadFile(url, name);
    }
    
    var sequence = Promise.resolve();

    sequence = sequence.then(function() {
                        console.log('Add JQuery');
                        var jq = document.createElement('script');
                        jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js";
                        document.getElementsByTagName('head')[0].appendChild(jq);
                        console.log('Finish add JQuery');
                    }).then(function() {
                        console.log('Check JQuery');
                        jQuery.noConflict();
                    }).then(function()
    {
        var elems = jQuery('.play_btn input');
        
        var parseSequence = function(elem)
        {
            return new Promise(
                function(resolve, reject) {
                    console.log('Execute song saving');

                    parseSong(elem);

                    window.setTimeout(
                        function() {
                            resolve();
                        }, 9000);
                }
            );
        }

        var foreachSequence = Promise.resolve();

        jQuery.each(elems, function(index, value)
        {
            console.log('Each : ' + index);
            foreachSequence = foreachSequence.then(function() {
                console.log('Start song saving');

                return parseSequence(value);
            }).then(function(){
                console.log('Finish song saving');
                return true;
            });
        });
    });
})();