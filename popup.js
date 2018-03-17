function changeTheme(theme) {
  console.log('>>>>>>>>>>>', theme);
  const url = chrome.extension.getURL(`themes/2.x/theme-${theme}.css`);
  console.log('>>>>>>>>>>>', url);
  const script = `var link = document.createElement("link"); link.href = "${url}"; link.type = "text/css"; link.rel = "stylesheet"; document.getElementsByTagName("head")[0].appendChild(link);`;
  chrome.tabs.executeScript({
    code: script
  });
}

function getSavedTheme(callback) {
  chrome.storage.sync.get('swagger-theme', (theme) => {
    callback(chrome.runtime.lastError ? null : theme);
  });
}

function saveTheme(theme) {
  chrome.storage.sync.set({ 'swagger-theme': theme });
}

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('dropdown');

  getSavedTheme((theme) => {
    if (theme) {
      changeTheme(theme['swagger-theme']);
      dropdown.value = theme;
    }
  });

  dropdown.addEventListener('change', () => {
    changeTheme(dropdown.value);
    saveTheme(dropdown.value);
  });
});
