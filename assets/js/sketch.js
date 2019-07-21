window.addEventListener('load', () => {
  makeWindowLarge()
  chrome.storage.local.get('colors', function (result) {
    if (result == undefined || result.colors == undefined) {
      fetch('colors_data.json').then(res => res.json()).then(data => {
        showColors(data);
        addEventListenersToPalette()
        chrome.storage.local.set({
          colors: data
        });
      })
    } else {
      showColors(result.colors);
      addEventListenersToPalette()
    }
  });

  setColorBoxListeners()

  $('.btn').tipr({
    'speed': 0,
  })

  $('#pin').on('click', () => {
    $('.tipr_container_above').remove()
    if ($('#pin').hasClass('active')) {
      chrome.app.window.current().setAlwaysOnTop(false);
      $('#pin').removeClass('active')
    } else {
      chrome.app.window.current().setAlwaysOnTop(true);
      $('#pin').addClass('active')
    }
  })

  $('#minimize').on('click', () => {
    chrome.app.window.current().minimize()
    $('.tipr_container_above').remove()
  });

  $('#close').on('click', () => {
    chrome.app.window.current().close()
  });

  $('#resize').on('click', () => {
    $('.tipr_container_above').remove()
    if ($('#resize').attr('res') == 'sm') {
      makeWindowSmall()
    } else {
      makeWindowLarge()
    }
  });

  $('#back').on('click', () => {
    $('#home').fadeIn(100);
    $('#set').fadeOut(100)
    makeWindowLarge()
  })

  $('#edit').on('click', () => {
    if (!$('#edit').hasClass('active')) {
      setEditModeOn()
      addAddNewPalletOption()
      bindEditEvents()
    } else {
      setEditModeOff()
      removeAllandReload()
    }
  })
})