(function () {
  "use strict";

  var grid = document.getElementById("video-grid");
  if (!grid) return;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cardHtml(item) {
    var title = escapeHtml(item.title || "Untitled");
    var year = item.year != null ? escapeHtml(item.year) : "";
    var note = item.note ? escapeHtml(item.note) : "";
    var id = item.youtubeId || "";
    var isPlaceholder = !id || id === "PLACEHOLDER";

    var media;
    if (isPlaceholder) {
      media =
        '<div class="video-frame" role="img" aria-label="Video coming soon">' +
        '<div class="placeholder">video coming soon</div></div>';
    } else {
      var src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(id) +
        "?rel=0";
      media =
        '<div class="video-frame">' +
        '<iframe src="' +
        src +
        '" title="' +
        title +
        '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>' +
        "</div>";
    }

    var metaBits = [];
    if (year) metaBits.push(year);
    if (note) metaBits.push(note);

    return (
      '<li class="video-card">' +
      media +
      '<div class="video-meta">' +
      "<h3>" +
      title +
      "</h3>" +
      (metaBits.length
        ? '<p class="meta-line">' + metaBits.join(" · ") + "</p>"
        : "") +
      "</div></li>"
    );
  }

  fetch("videos.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Could not load videos.json (" + res.status + ")");
      return res.json();
    })
    .then(function (videos) {
      if (!Array.isArray(videos) || !videos.length) {
        grid.innerHTML =
          '<li class="error" role="status">No videos listed yet.</li>';
        return;
      }
      grid.innerHTML = videos.map(cardHtml).join("");
    })
    .catch(function (err) {
      grid.innerHTML =
        '<li class="error" role="alert">Failed to load videos: ' +
        escapeHtml(err.message || err) +
        "</li>";
      console.error(err);
    });
})();
