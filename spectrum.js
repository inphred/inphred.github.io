// ===================================================================
// spectrum.js — positions everything in the Products "Spectrum Map"
// by WAVELENGTH (nm) instead of hand-tuned percentages.
//
// HOW TO EDIT THE CHART DATA:
//   • Application pin:  <div class="spec-pin r1" data-nm="1380"> … </div>
//        - data-nm   = wavelength in nm (sets horizontal position)
//        - class r1 / r2 = which of the two label rows (flip to avoid overlap)
//   • Product band / incumbent marker:
//        <div class="spec-band swir" data-nm-start="1300" data-nm-end="2300">
//   • Tick marks + region zones come from the CONFIG just below.
//
// THE SCALE is piecewise-linear (keeps the narrow visible range readable
// next to the very wide SWIR range). Edit ANCHORS to rescale the whole axis.
// ===================================================================
(function () {
  // [wavelength nm, position %] — must ascend. 3 zones sit between these 4 anchors.
  var ANCHORS = [[400, 0], [750, 24], [1400, 48], [2300, 100]];
  // Wavelength tick marks drawn on the track (label auto-formatted).
  var TICKS = [450, 750, 1400, 2300];

  function nmToPct(nm) {
    nm = +nm;
    if (nm <= ANCHORS[0][0]) return 0;
    if (nm >= ANCHORS[ANCHORS.length - 1][0]) return 100;
    for (var i = 0; i < ANCHORS.length - 1; i++) {
      var a = ANCHORS[i], b = ANCHORS[i + 1];
      if (nm >= a[0] && nm <= b[0]) return a[1] + (nm - a[0]) / (b[0] - a[0]) * (b[1] - a[1]);
    }
    return 0;
  }

  document.querySelectorAll('.spectrum').forEach(function (fig) {
    // Region zones + their labels (driven by the anchors so they always match)
    var zones = fig.querySelectorAll('.spec-zone');
    var labels = fig.querySelectorAll('.spec-zonelabel');
    for (var i = 0; i < zones.length; i++) {
      var startPct = ANCHORS[i][1], endPct = ANCHORS[i + 1][1];
      zones[i].style.width = (endPct - startPct) + '%';
      if (labels[i]) labels[i].style.left = startPct + '%';
    }

    // Incumbent marker spans its wavelength range (small dashed box)
    fig.querySelectorAll('.spec-incumbent[data-nm-start][data-nm-end]').forEach(function (b) {
      var l = nmToPct(b.dataset.nmStart), r = nmToPct(b.dataset.nmEnd);
      b.style.left = l + '%';
      b.style.width = (r - l) + '%';
    });

    // Product-family badges span their wavelength range (like the incumbent)
    fig.querySelectorAll('.spec-band[data-nm-start][data-nm-end]').forEach(function (b) {
      var l = nmToPct(b.dataset.nmStart), r = nmToPct(b.dataset.nmEnd);
      b.style.left = l + '%';
      b.style.width = (r - l) + '%';
    });

    // Application pins (data-nm)
    fig.querySelectorAll('.spec-pin[data-nm]').forEach(function (p) {
      p.style.left = nmToPct(p.dataset.nm) + '%';
    });

    // Wavelength ticks
    var track = fig.querySelector('.spec-track');
    if (track) {
      TICKS.forEach(function (nm) {
        var pct = nmToPct(nm);
        var t = document.createElement('div');
        t.className = 'spec-tick';
        t.style.left = pct + '%';
        track.appendChild(t);
        var lbl = document.createElement('div');
        lbl.className = 'spec-ticklabel';
        lbl.style.left = Math.min(pct, 97) + '%';
        lbl.textContent = (+nm).toLocaleString() + ' nm';
        track.appendChild(lbl);
      });
    }
  });
})();
