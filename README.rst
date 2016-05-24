.. image:: https://raw.githubusercontent.com/score-framework/py.doc/master/docs/score-banner.png
    :target: http://score-framework.org

`The SCORE Framework`_ is a collection of harmonized python and javascript
libraries for the development of large scale web projects. Powered by strg.at_.

.. _The SCORE Framework: http://score-framework.org
.. _strg.at: http://strg.at


**********
score.init
**********

.. _js_init:

This is the base module providing initialization helpers for all other modules.
It does exactly *nothing* on its own, except providing a function *extend*,
that can be used to, well, extend the originally useless object.

Quickstart
==========

Browser
-------

Just make sure this module is loaded before all other score modules:

.. code-block:: html

    <script src="score.init.js"></script>
    <script src="score.dom.js"></script>
    <script>
        score.dom('body').addClass('spam');
    </script>

With require.js_
""""""""""""""""

.. code-block:: html

    <script src="require.js"></script>
    <script>
        require(['score.init', 'score.dom'], function(score) {
            score.dom('body').addClass('spam');
        });
    </script>

It is recommended to ``define()`` score with all its modules under a single URL
to make things more convenient:

.. code-block:: javascript

    // in score.js
    define(['score.init', 'score.dom'], function(score) {
        return score;
    });

.. code-block:: html

    <!-- in index.html -->
    <script src="require.js"></script>
    <script>
        require(['score'], function(score) {
            score.dom('body').addClass('spam');
        });
    </script>

.. _require.js: http://requirejs.org/


Node.js_
--------

.. code-block:: javascript

    var score = require('score.init'); require('score.oop');
    score.oop.Class({
        __name__: 'Bird'.
    });

.. _Node.js: https://nodejs.org/

Details
=======

Extending
---------

Adding modules to *score* is as simple as calling *extend()*:

.. code-block:: html

    <script src="score.init.js"></script>
    <script>
        score.extend('spam', [], function(score) {
            return function() {
                alert('spam!');
            };
        });
        score.spam(); // will show an alert with the text 'spam!'
    </script>

The second parameter (the empty array), is a list of dependencies. If your
module need another module, it will not be available until all dependencies
were loaded:

.. code-block:: html

    <script src="score.init.js"></script>
    <script>
        score.extend('knight', ['swallow'], function(score) {
            // ...
        });
        try {
            score.knight; // This will throw an Error if the modules 'swallow'
                          // and 'coconut' were not loaded yet.
        } catch (e) {
        }
        score.extend('swallow', [], function(score) {
            // ...
        });
        score.knight; // The module is now available, as all dependencies were
                      // loaded
    </script>

This behaviour has the effect, that you only need to make sure, that
``score.init`` is loaded before any other score modules. The loading order of
the other libraries become irrelevant. This is important when using score in
the browser without require.js.

noConflict()
------------

It is possible, to remove the score variable from the global scope by using its
``noConflict()`` function:

.. code-block:: html

    <script>
        (function(score) {
            // do something with score
        })(score.noConflict());
        // the score variable no longer exists
    </script>


License
=======

Copyright © 2015,2016 STRG.AT GmbH, Vienna, Austria

All files in and beneath this directory are part of The SCORE Framework.
The SCORE Framework and all its parts are free software: you can redistribute
them and/or modify them under the terms of the GNU Lesser General Public
License version 3 as published by the Free Software Foundation which is in the
file named COPYING.LESSER.txt.

The SCORE Framework and all its parts are distributed without any WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. For more details see the GNU Lesser General Public License.

If you have not received a copy of the GNU Lesser General Public License see
http://www.gnu.org/licenses/.

The License-Agreement realised between you as Licensee and STRG.AT GmbH as
Licenser including the issue of its valid conclusion and its pre- and
post-contractual effects is governed by the laws of Austria. Any disputes
concerning this License-Agreement including the issue of its valid conclusion
and its pre- and post-contractual effects are exclusively decided by the
competent court, in whose district STRG.AT GmbH has its registered seat, at the
discretion of STRG.AT GmbH also the competent court, in whose district the
Licensee has his registered seat, an establishment or assets.
