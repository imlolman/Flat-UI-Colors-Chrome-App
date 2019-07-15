window.addEventListener('load', () => {
  fetch('colors_data.json').then(res => res.json()).then(data => {
    showColors(data);
    addEventListenersToPalette()
  })
  $('.btn').tipr({
    'speed': 0,
  })
  $('.onlyOnChromeApp').tipr({
    'speed': 0,
  })

  $('#pin').on('click', () => {
    OnlyAvailableOnChromeApp();
  })

  $('#minimize').on('click', () => {
    OnlyAvailableOnChromeApp();
  });

  $('#close').on('click', () => {
    window.close();
  });

  $('#resize').on('click', () => {
    OnlyAvailableOnChromeApp();
  });

  $('#move').on('click', () => {
    OnlyAvailableOnChromeApp();
  });

  $('#back').on('click', () => {
    $('#home').fadeIn(100);
    $('#set').fadeOut(100)
    $('body').css('max-height', '700px');
  })
})

var OnlyAvailableOnChromeApp = () => {
  $('.onlyOnChromeApp').show()
}

var addEventListenersToPalette = () => {
  document.querySelectorAll('#palette').forEach(ele => {
    ele.addEventListener('click', (event) => {
      var targetElement = event.target;
      while (targetElement.id != "palette") {
        targetElement = targetElement.parentElement
      }
      template = ''
      window.colors[targetElement.getAttribute('paletteid')].colors.forEach(color => {
        template += `<div class="color" id="bigcolor" style="background: ${color}"></div>`
      })
      $('.color-box').html(template)
      $('#home').fadeOut(100);
      $('#set').fadeIn(100)
      $('body').css('max-height', '200px');
      addEventListenersToColors()
    })
  })
}

var addEventListenersToColors = () => {
  document.querySelectorAll('#bigcolor').forEach(ele => {
    ele.addEventListener('click', event => {
      color = rgb2hex(event.target.style.background)
      copyToClipboard(color)
      showCopied(color)
      trackButtonClick(event)
    })
  })
}

var showColors = (data) => {
  window.colors = data;
  toSet = '';
  data.forEach((colorSet, index) => {
    middleColours = '';
    colorSet.colors.forEach(color => {
      middleColours += `<div class="color" style="background: ${color}"></div>`
    })
    template = `      
      <div class="col-xs-6 col-sm-4 col-md-4 color-set-column" id="palette" paletteid="${index}">
        <div class="color-set">
          <div class="show-color">
            ` + middleColours + `    
          </div>
          <div class="plate-name">
            <span class="name">${colorSet.name}</span>
            <span class="emoji">${colorSet.emoji}</span>
          </div>
        </div>
      </div>`
    toSet += template;
  });
  $('#loadColoursHere').html(toSet);
}

var rgb2hex = (rgb) => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);

  function hex(x) {
    var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
  }
}

var copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

var showCopied = (color) => {
  var texts = ['Got it!', 'It\'ll Rock!', 'Copied!', 'Paste Me!', 'Right One!', 'Will Do!']
  $('#randomText').html(texts[Math.floor(Math.random() * texts.length)])
  $('.colorCopiedBox').css('background', color)
  $('.colorCopiedBox').show()
  setTimeout(() => $('.colorCopiedBox').hide(), 1000);
}




// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Add your Analytics tracking ID here.
 */
var _AnalyticsCode = 'UA-111255706-2';
/**
 * Below is a modified version of the Google Analytics asynchronous tracking
 * code snippet.  It has been modified to pull the HTTPS version of ga.js
 * instead of the default HTTP version.  It is recommended that you use this
 * snippet instead of the standard tracking snippet provided when setting up
 * a Google Analytics account.
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);
(function () {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();


function trackButtonClick(e) {
  _gaq.push(['_trackEvent', e.target.id, 'clicked']);
}