import type { APIRoute } from 'astro';

const TARGET_ORIGIN = 'https://omidadli.site';

export const ALL: APIRoute = async ({ request, url }) => {
  const proxyPath = url.searchParams.get('proxy');

  // Handle proxied API/asset requests from inside the preview iframe
  if (proxyPath) {
    const targetUrl = new URL(proxyPath, TARGET_ORIGIN).toString();
    try {
      const upstream = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'Accept': request.headers.get('accept') || '*/*',
          'User-Agent': 'Mozilla/5.0 (compatible; TheHerOmidPreview/1.0)'
        }
      });
      const body = await upstream.arrayBuffer();
      const headers = new Headers();
      const contentType = upstream.headers.get('content-type');
      if (contentType) headers.set('Content-Type', contentType);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Cache-Control', 'public, max-age=300');
      return new Response(body, { status: upstream.status, headers });
    } catch {
      return new Response(JSON.stringify({ error: 'Upstream unavailable' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Fetch main HTML document from https://omidadli.site
  try {
    const response = await fetch(TARGET_ORIGIN, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; TheHerOmidPreview/1.0)'
      }
    });
    let html = await response.text();

    // Rewrite root-relative src="/..." and href="/..." in initial HTML to absolute https://omidadli.site/...
    html = html
      .replace(/\b(src|href)=(["'])\/(?!\/)/g, `$1=$2${TARGET_ORIGIN}/`)
      .replace(/<script[^>]*static\.cloudflareinsights\.com[^>]*><\/script>/gi, '');

    // Inject runtime shim right after <head> so React Router sees "/" and dynamic root-relative images/fetches resolve to https://omidadli.site
    const runtimeShim = `
<script>
(function() {
  var ORIGIN = "${TARGET_ORIGIN}";
  try {
    history.replaceState(null, "", "/");
  } catch (e) {}

  function rewriteAssetUrl(u) {
    if (typeof u !== "string") return u;
    if (u.startsWith("/") && !u.startsWith("//") && !u.startsWith("/api/preview")) {
      return ORIGIN + u;
    }
    return u;
  }

  function rewriteFetchUrl(u) {
    if (typeof u !== "string") return u;
    if (u.startsWith("/api/")) return "/api/preview?proxy=" + encodeURIComponent(u);
    if (u.startsWith("/") && !u.startsWith("//") && !u.startsWith("/api/preview")) {
      return ORIGIN + u;
    }
    return u;
  }

  var origFetch = window.fetch;
  if (origFetch) {
    window.fetch = function(input, init) {
      if (typeof input === "string") {
        input = rewriteFetchUrl(input);
      } else if (input && typeof input.url === "string") {
        input = new Request(rewriteFetchUrl(input.url), input);
      }
      return origFetch.call(this, input, init);
    };
  }

  var origSetAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    if ((name === "src" || name === "poster") && typeof value === "string") {
      value = rewriteAssetUrl(value);
    }
    return origSetAttr.call(this, name, value);
  };

  function fixNode(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.hasAttribute) {
      ["src", "poster"].forEach(function(attr) {
        if (node.hasAttribute(attr)) {
          var v = node.getAttribute(attr);
          if (v && v.startsWith("/") && !v.startsWith("//")) {
            origSetAttr.call(node, attr, ORIGIN + v);
          }
        }
      });
      if (node.hasAttribute("srcset")) {
        var ss = node.getAttribute("srcset");
        if (ss && ss.includes("/")) {
          origSetAttr.call(node, "srcset", ss.replace(/(^|\\s)\\/(?!\\/)/g, "$1" + ORIGIN + "/"));
        }
      }
    }
    if (node.querySelectorAll) {
      node.querySelectorAll("[src^='/'], [poster^='/'], [srcset*='/']").forEach(function(el) {
        ["src", "poster"].forEach(function(attr) {
          var ev = el.getAttribute(attr);
          if (ev && ev.startsWith("/") && !ev.startsWith("//")) {
            origSetAttr.call(el, attr, ORIGIN + ev);
          }
        });
        var ess = el.getAttribute("srcset");
        if (ess && ess.includes("/")) {
          origSetAttr.call(el, "srcset", ess.replace(/(^|\\s)\\/(?!\\/)/g, "$1" + ORIGIN + "/"));
        }
      });
    }
  }

  var mo = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === "attributes") fixNode(m.target);
      else if (m.addedNodes) {
        for (var j = 0; j < m.addedNodes.length; j++) fixNode(m.addedNodes[j]);
      }
    }
  });
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "poster", "srcset"]
  });
})();
</script>`;

    html = html.replace(/<head(\s[^>]*)?>/i, (match) => `${match}${runtimeShim}`);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=180'
      }
    });
  } catch {
    return new Response('Preview temporarily unavailable', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
};
