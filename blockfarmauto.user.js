// ==UserScript==
// @name         blockfarmauto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       quocthanh2694
// @match      https://blockfarm.club/*
// @icon         https://www.google.com/s2/favicons?domain=blockfarm.club
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var mapLink = 'https://blockfarm.club/farm/map';
    var worldMapLink = 'https://blockfarm.club/farm/mapview/world-map';
    var sunMapLink = 'https://blockfarm.club/farm/mapview/sun-map';
    var moonMapLink = 'https://blockfarm.club/farm/mapview/moon-map';

    var resultId = 'tool-auto-v125';

    // Your code here...

    var node = document.createElement("div");

    node.setAttribute("id", resultId);
    node.style.backgroundColor = 'white';
    node.style.maxHeight = '200px';
    node.style.overflowY = 'auto';
    document.body.insertBefore(node, document.body.firstChild);



    function log(_text) {
        console.log(_text);
        var newNode = document.createElement("div");
        var _textNode = document.createTextNode(new Date().toLocaleString() + ':   ' + _text);
        newNode.appendChild(_textNode);
        var resultDiv = document.getElementById(resultId);
        resultDiv.append(newNode);

    }
    log('Blockfarm script run... ' + location.href)

    // check error web page
    if (
        document.body.textContent.includes('Web server is returning an unknown error') &&
        document.body.textContent.includes('520')
    ) {
        console.log('Web error connection 520. Auto reload in 1s.')
        setTimeout(function () {

            location.href = mapLink;
        }, 3000)
        return;
    }

    // check afk
    setInterval(function () {
        if (location.href == 'https://blockfarm.club/afk') {
            location.href = mapLink;
        }
    }, 10000);

    // check redeem
    const redeemBtn = Array.prototype.slice.call(document.getElementsByClassName('flex-1  text-center inline border-2 font-semibold  py-1 px-1 rounded-md'))
        .filter(function (el) {
            return el.textContent.includes('Redeem reward')
        })[0];
    if (redeemBtn) {
        redeemBtn.click();
        setInterval(function () {
            location.reload();
        }, 10000)
    }



    var _worldWaterBtn = document.getElementsByClassName('flex-1  text-center inline border-2  text-blue-900 font-semibold bg-blue-300 border-blue-900 py-1 px-1 rounded-md')[0];
    var _worldWarter = _worldWaterBtn.textContent.replace('\n', '').replace('\n', '');

    var sunWaterBtn = document.getElementsByClassName('flex-1  text-center inline border-2 bg-yellow-300 text-yellow-700 font-semibold border-yellow-700 py-1 px-1 rounded-md')[0];
    var sunWarter = sunWaterBtn.textContent.replace('\n', '').replace('\n', '');

    var moonWarterBtn = document.getElementsByClassName('flex-1  text-center inline border-2  text-purple-900 font-semibold bg-purple-300 border-purple-900 py-1 px-1 rounded-md')[0];
    var moonWarter = moonWarterBtn.textContent.replace('\n', '').replace('\n', '');
    log('worldWarter: ' + _worldWarter);
    log('sunWarter: ' + sunWarter);
    log('moonWarter: ' + moonWarter);
    // claimedDailyQuest('water');
    // claimedDailyQuest('sun')


    function play(mapLink, saveKey, worldWarter, worldWaterBtn) {
        if (location.href.includes(mapLink)) {
            if (location.href == mapLink) {
                var history = localStorage.getItem(saveKey);
                var worlds;
                if (history) {
                    worlds = JSON.parse(history);
                } else {
                    worlds = {
                        date: '',
                        list: [],
                    }
                }

                // maps
                if (worlds?.date != new Date().toLocaleDateString()) {
                    var _index = 0;
                    const mapsData = document.getElementsByTagName('a');
                    Array.from(mapsData).forEach(
                        function (element, index, array) {
                            if (element.href.includes(mapLink)
                                && element.href.split(mapLink)
                                && element.href.split(mapLink)[1]
                                && element.href.split(mapLink)[1].length > 2) {
                                console.log(element.href);
                                worlds.date = new Date().toLocaleDateString();
                                worlds.list.push({
                                    tested: false,
                                    link: element.href,
                                });
                            }
                            _index++;
                            if (_index >= mapsData.length - 1) {
                                localStorage.setItem(saveKey, JSON.stringify(worlds));
                                processSelectMap();
                            }
                        }
                    );
                } else {
                    processSelectMap();
                }

                function processSelectMap() {
                    setTimeout(function () {
                        let index;
                        for (let i = 0; i < worlds?.list?.length; i++) {
                            if (!worlds.list[i].tested) {
                                index = i;
                                break;
                            }
                        }
                        if (index > -1) {
                            worlds.list[index].tested = true;
                            localStorage.setItem(saveKey, JSON.stringify(worlds));
                            location.href = worlds.list[index].link;
                        }
                    }, 2000);

                }

            } else {

                if (worldWarter.includes('Redeem')) {
                    worldWaterBtn.click();
                    return;
                }

                // detail page
                var foundBtn;
                const plantItems = document.getElementsByClassName('bg-blue-600 hover:bg-blue-400 w-full text-white font-bold py-2 px-4 border-b-4 border-blue-800 hover:border-blue-600 rounded');
                Array.from(plantItems).forEach(
                    function (element, index, array) {
                        if (element.textContent.includes('Interact')) {
                            foundBtn = element;
                        }
                    }
                );
                if (foundBtn) {
                    foundBtn.click();
                    setInterval(function () {
                        location.reload();
                    }, 10000)
                } else {
                    log('Interacted all pot. Check for another land...');
                    location.href = mapLink;
                }
            }
        } else {
            location.href = mapLink;
        }
    }

    if (!_worldWarter.includes('15 / 15') && _worldWarter.includes('15')) {
        log('world');
        play(worldMapLink, 'worlds', _worldWarter, _worldWaterBtn);
    } else if (!sunWarter.includes('15 / 15') && sunWarter.includes('15')) {
        log('suns');
        play(sunMapLink, 'suns', sunWarter, sunWaterBtn);
    } else if (!moonWarter.includes('15 / 15') && moonWarter.includes('15')) {
        log('moons');
        play(moonMapLink, 'moons', moonWarter, moonWarterBtn);
    }


    // check world map





})();