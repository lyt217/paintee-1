/**
 * 다국어 처리
 * @param area
 * @param lang
 */
function exeTranslation(area, lang) {
	console.log("exeTranslation ::: " + lang);
	if (!lang) lang = "en";
	
	$.i18n.init({
		lng: lang,
		debug: true,
		useLocalStorage: false,
		localStorageExpirationTime: 86400000, 
		resGetPath: 'locales/__lng__/translation.json'
	}, function () {
		$(area).i18n();
	});
}