function loadScript(url, callback) {
    var timeout, script = document.createElement('script');
    script.onload = function() {
        script.parentNode.removeChild(script);
        if (window && typeof window.clearTimeout === 'function') {
            window.clearTimeout(timeout);
        }
        callback();
    };
    script.src = url;
    document.head.appendChild(script);
    if (window && typeof window.setTimeout === 'function') {
        timeout = window.setTimeout(function() {
            throw new Error('Failed to load script: ' + url);
        }, 1000);
    }
}

function loadScripts(urls, callback) {
    var collectedCount = 0;
    var collect = function() {
        if (++collectedCount >= urls.length) {
            callback();
        }
    };
    for (var i = 0; i < urls.length; i++) {
        loadScript(urls[i], collect);
    }
}

function loadScore(modules, callback) {
    if (typeof modules === 'function') {
        callback = modules;
        modules = [];
    } else if (!modules) {
        modules = [];
    }
    var urls = ['../_base.js'];
    for (var i = 0; i < modules.length; i++) {
        var module = modules[i];
        urls.push('../' + module.replace('.', '/') + '.js');
    }
    loadScripts(urls, function() {
        callback(score.noConflict());
    });
}

function loadScoreWithRequireJs(modules, callback) {
    if (typeof modules === 'function') {
        callback = modules;
        modules = [];
    } else if (!modules) {
        modules = [];
    }
    loadScript('require.js', function() {
        for (var i = 0; i < modules.length; i++) {
            modules[i] = modules[i].replace('.', '/');
        }
        modules.splice(0, 0, '_base');
        require.config({baseUrl: "../"});
        require(modules, function(score) {
            require = undefined;
            requirejs = undefined;
            define = undefined;
            callback(score);
        });
    });
}
