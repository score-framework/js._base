function loadScript(url, callback) {
    var maxTimeout, ieTimeout, iePoller, script = document.createElement('script');
    script.onload = function() {
        script.onload = function() {};
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
        window.clearTimeout(maxTimeout);
        window.clearTimeout(ieTimeout);
        callback();
    };
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    iePoller = function() {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onload();
        } else {
            ieTimeout = window.setTimeout(iePoller, 10);
        }
    };
    iePoller();
    if (document.head) {
        document.head.appendChild(script);
    } else {
        document.body.appendChild(script);
    }
    maxTimeout = window.setTimeout(function() {
        throw new Error('Failed to load script: ' + url);
    }, 1000);
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
    var urls = ['../init.js'];
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
        modules.splice(0, 0, 'init');
        require.config({baseUrl: "../"});
        require(modules, function(score) {
            require = undefined;
            requirejs = undefined;
            define = undefined;
            callback(score);
        });
    });
}
