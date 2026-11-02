# Plan 1.6: acht werelden erbij, Dynamic Island en meldingen (2 november 2026)

Jaimy, 2 november: "naast de beoordelingen alles toepassen en we moeten de helft aan werelden erbij hebben dus plus 512
extra games en dat sommige ook moeilijk zijn. Ook graag mobile app animations toevoegen (Apple's Dynamic Island) en
meldingen. Je moet zelf veel voorbeelden opzoeken op het internet, alternatief dan mobbin en eerst laten zien zodat ik
kan kiezen en daaruit onze prototype toepassen."

Volgorde: 1.5 (winkelpagina, video, iPad) gaat eerst naar Apple. 1.6 bundelt de werelden en wat Jaimy kiest uit de
voorbeelden. Werkwijze per wereld zoals in `docs/PLAN-1.4.md` ("Wat één wereld vraagt"): ontwerpblad, Jaimy's ja,
portretten, 64 zaken, vertalingen in 19 talen, aankoop, schermafbeeldingen.

## Kandidaat-werelden (Jaimy kiest er acht)

Gekozen op waar onze vertoningen vandaan komen (App Store Connect 16-29 okt): VS 2.674, Saoedi-Arabië 2.078, Japan 1.425,
Brazilië 745, Mexico 712, Turkije 567, Frankrijk 501, Nederland 292, Rusland 221, plus India (vier talen) en Korea.
Geen herhaling van de zestien bestaande werelden.

| # | Wereld (werktitel) | Tijd en plek | Kamers (voorbeeld) | Waarom |
|---|---|---|---|---|
| A | Oceaanstomer | Atlantische oversteek, 1912 | balzaal, rookzaal, machinekamer, hutten, promenadedek | Klassieke whodunit op zee; VS en VK |
| B | Ryokan | Kyoto, 1923 | tatamikamer, onsen, theehuis, tuin, keuken | Japan: veel vertoningen, laagste conversie |
| C | Koffiefazenda | Brazilië, 1930 | herenhuis, droogvloer, kapel, stallen, veranda | Brazilië |
| D | Raderstoomboot | Mississippi, 1885 | pokersalon, stuurhut, ketelruim, eetzaal | VS; gokken en bluffen |
| E | Maharadjapaleis | Jaipur, 1935 | darbarzaal, spiegelzaal, stallen, sterrenwacht | India (Hindi, Marathi, Bengaals, Telugu) |
| F | Yali aan de Bosporus | Istanbul, 1925 | theesalon, hamam, botenhuis, bibliotheek | Turkije |
| G | Speakeasy | Chicago, 1927 | jazzzaal, achterkamer, kelder, garage | VS; jazz en drooglegging |
| H | Zeppelin | boven de oceaan, 1936 | salon, eetzaal, cabines, gondel | Uniek beeld, niemand kan weg |
| I | Maskerbal in Venetië | Venetië, 1750 | balzaal, gondelhuis, kapel, bibliotheek | Italië en Frankrijk; maskers als twist |
| J | Poolstation | Antarctica, 1958 | radiokamer, hondenkennel, lab, kantine | Gesloten kamer in de sneeuw (anders dan de Skihut: wetenschap, poolnacht) |
| K | Kasteel in de Hooglanden | Schotland, 1890 | grote hal, wapenkamer, distilleerderij, toren | VK; spookverhaal |
| L | Winterpaleis | Sint-Petersburg, 1900 | balzaal, ijsbaan, kapel, bibliotheek | Rusland |
| M | Safarilodge | Kenia, 1952 | lodge, tenten, waterpoel, landingsbaan | Avontuur, sterk beeld |
| N | Hanok in de bergen | Korea, 1930 | binnenplaats, theekamer, keuken, studeerkamer | Korea |

## Moeilijker

Per nieuwe wereld: deel I-II zoals nu (makkelijk naar moeilijk), deel III-V oplopend, deel VI-VIII grotendeels
meesterniveau (9×9, vijf verdachten, eerlijk bewezen met `FloorPlan.stepwise`). Zo komen er ~150 meesterzaken bij.

## Dynamic Island, Live Activities en meldingen

Onderzoek loopt: `docs/onderzoek/DYNAMIC-ISLAND-2026-11.md` en `docs/onderzoek/MELDINGEN-ANIMATIES-2026-11.md`. Daarna
een keuzepagina met echte voorbeelden (links en schermafbeeldingen) en onze eigen proefontwerpen in de stijl van het spel.
Jaimy kiest; pas dan bouwen.

## Keuze Jaimy, 2 november 2026 (keuzepagina https://claude.ai/artifact/MVFp74E7X29Q5KaDqKSsYn)

- **Animaties**: Grootboek, Stempel, Bekentenis, Bord wordt kaart, Streakvlam, Hint na stilzitten, Laadscherm met
  zinnetjes, Dynamic Island: dossier open.
- **Meldingen**: streakredder om 21:30 met knoppen; rustig stoppen na 7 dagen niet spelen (met één afscheidsbericht).
- **Werelden (8)**: Oceaanstomer, Ryokan, Koffiefazenda, Zeppelin, Poolstation, Winterpaleis, Safarilodge, Hanok in de bergen.
- Jaimy daarna: "Kunnen we ook de animatie verbeteren? of iets in die trend?" → versie 2 van de acht animaties op
  vakmanschapsniveau (aanloop, overshoot, uitloop, gelaagde deeltjes, haptiek op de klap, Liquid Glass voor eiland en
  meldingen), eerst als keuzepagina, dan in de app.
- Gevonden fouten om mee te nemen: de herinnering zegt "18:30" maar plant een uur na de gewone speeltijd; vier van de
  vijf meldingen hebben dezelfde zin met "Crimson Ledger" als titel; goede en foute beschuldiging trillen hetzelfde.
