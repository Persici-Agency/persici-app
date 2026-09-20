/**
 * Strip and block Chrome Extension attributes (Bitwarden, etc.) from polluting
 * DOM elements before React hydration can evaluate them.
 */
(function () {
  try {
    if (typeof window === 'undefined') return;

    // 1. Monkey-patch setAttribute to block extensions from injecting attributes
    var origSetAttr = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, val) {
      if (
        name === 'bis_skin_checked' ||
        name === 'bis_register' ||
        name === 'bis_frame_id'
      ) {
        return;
      }
      return origSetAttr.apply(this, arguments);
    };

    // 2. Immediate cleanup of any attributes that may have already been injected
    var cleanAttr = function (el) {
      if (!el || !el.removeAttribute) return;
      el.removeAttribute('bis_skin_checked');
      el.removeAttribute('bis_register');
      el.removeAttribute('bis_frame_id');
    };

    var cleanAll = function () {
      if (typeof document === 'undefined') return;
      var els = document.querySelectorAll(
        '[bis_skin_checked],[bis_register],[bis_frame_id]'
      );
      for (var i = 0; i < els.length; i++) {
        cleanAttr(els[i]);
      }
    };
    cleanAll();

    // 3. MutationObserver to continuously strip attributes if extensions inject them later
    if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          if (m.type === 'attributes') {
            cleanAttr(m.target);
          } else if (m.type === 'childList') {
            for (var j = 0; j < m.addedNodes.length; j++) {
              var node = m.addedNodes[j];
              if (node.nodeType === 1) {
                cleanAttr(node);
                if (node.querySelectorAll) {
                  var descendants = node.querySelectorAll(
                    '[bis_skin_checked],[bis_register],[bis_frame_id]'
                  );
                  for (var k = 0; k < descendants.length; k++) {
                    cleanAttr(descendants[k]);
                  }
                }
              }
            }
          }
        }
      });

      var target = document.documentElement || document;
      if (target) {
        observer.observe(target, {
          attributes: true,
          subtree: true,
          childList: true,
          attributeFilter: ['bis_skin_checked', 'bis_register', 'bis_frame_id'],
        });
      }
    }
  } catch (e) {}
})();
