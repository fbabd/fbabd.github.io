// js/include.js
(function () {
  // resolve relative URL against current page path (works on GitHub Pages subpaths)
  function resolveUrl(rel) {
    const base = location.origin + location.pathname.replace(/[^/]*$/, "");
    return new URL(rel, base).href;
  }

  async function loadPartial(el) {
    const rel = el.getAttribute("data-include");
    const url = resolveUrl(rel);
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error("[include] failed:", rel, err);
      el.innerHTML = `<!-- include failed: ${rel} (${err.message}) -->`;
    } finally {
      el.removeAttribute("data-include"); // avoid reprocessing
    }
  }

  async function loadAllPartials() {
    let slots = Array.from(document.querySelectorAll("[data-include]"));
    while (slots.length) {
      await Promise.all(slots.map(loadPartial));
      // check if nested partials appeared
      slots = Array.from(document.querySelectorAll("[data-include]"));
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src + "?v=" + Date.now(); // bust cache to ensure re-init
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.body.appendChild(s);
    });
  }

  async function boot() {
    await loadAllPartials();
    // NOW load/re-run your site initializer AFTER partials are in the DOM
    await loadScript("js/main.js");
    document.dispatchEvent(new CustomEvent("includes:loaded"));
    console.log("[include] partials loaded, main.js re-initialized");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();