from bs4 import BeautifulSoup
import json


source = open('html-source.html', encoding="utf8").read()
soup = BeautifulSoup(source, 'html.parser')

# Prittified to look and understand the structure of Code
# prittified = soup.prettify().encode("utf-8")
# open('prettified.html', 'wb').write(prittified)

color_sets = []

for sets in soup.find_all("a", {"class": "smallpalette-container"}):
    set = {}
    set['name'] = sets.find(
        'div', {"class": "name"}).contents[0].replace('\n        ', '')
    set['emoji'] = sets.find('span', {"class": "emoji"}).string
    set['colors'] = []
    for color in sets.find_all("div", {"class": "color"}):
        set['colors'].append(color['style'].replace(
            'background: ', "").replace(';', ""))
    color_sets.append(set)

open('colors_data.json', 'w+').write(json.dumps(color_sets))

print('Check file `colors_data.json` Updated Color Sets.')
