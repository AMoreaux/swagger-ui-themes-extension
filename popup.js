function changeTheme(theme, version) {
  let script;
  console.log('>>>>>>>>>>>', theme);
  if (theme === 'none') {
    script = `var elm = document.getElementById('theme-swagger-by-extension'); if(elm)elm.parentNode.removeChild(elm);`;
  } else {
    const url = chrome.extension.getURL(`themes/${version}/theme-${theme}.css`)
    script = `var link = document.createElement("link"); link.href = "${url}"; link.type = "text/css"; link.rel = "stylesheet"; link.id = "theme-swagger-by-extension"; document.getElementsByTagName("head")[0].appendChild(link);`;
  }
  chrome.tabs.executeScript({
    code: script
  });
}

function getSavedTheme(callback) {
  chrome.storage.sync.get('swagger-theme', (theme) => {
    chrome.storage.sync.get('swagger-version', (version) => {
      callback(chrome.runtime.lastError ? null : {
        'swagger-theme': theme['swagger-theme'],
        'swagger-version': version['swagger-version'] || '2.x'
      });
    });
  });
}

function saveTheme(theme, swaggerVersion) {
  chrome.storage.sync.set({ 'swagger-theme': theme, 'swagger-version': swaggerVersion });
}

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('dropdown');
  const swaggerVersion = document.getElementById('swagger-version');

  getSavedTheme((params) => {
    if (params) {
      changeTheme(params['swagger-theme'], params['swagger-version']);
      dropdown.value = params['swagger-theme'];
      swaggerVersion.value = params['swagger-version'];
    }
  });

  dropdown.addEventListener('change', () => {
    changeTheme(dropdown.value, swaggerVersion.value);
    saveTheme(dropdown.value, swaggerVersion.value);
  });

  swaggerVersion.addEventListener('change', () => {
    changeTheme(dropdown.value, swaggerVersion.value);
    saveTheme(dropdown.value, swaggerVersion.value);
  });
});
