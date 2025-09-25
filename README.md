# TypeScript, REST ja GraphQL -reittiopas

Tämä harjoitus yhdistää REST-apien ja GraphQL-rajapintojen käytön TypeScript-kielellä. Projektissa rakennetaan hyvin yksinkertaistettu versio [reittioppaasta](https://www.reittiopas.fi), joka hyödyntää Digitransitin paikkatietoja sekä reitityspalveluja.

Harjoitus on toteutettu [React + Vite -sovelluksena](https://vite.dev/), mutta keskitymme HTTP-rajapintojen hyödyntämiseen, asynkroniseen ohjelmointiin ja GraphQL-kyselyiden tekemiseen. Harjoituksessa ei tarvitse perehtyä Reactiin tai tehdä muutoksia komponentteihin.


## Mikä on GraphQL?

GraphQL-rajapintoihin tutustumiseksi suosittelemme seuraavia kahta videota:

[**GraphQL Explained in 100 Seconds**](https://www.youtube.com/watch?v=eIQh02xuVw4) by Fireship *2:22*

[**GraphQL Client Tutorial With Fetch**](https://www.youtube.com/watch?v=0ZJI4cBS4JM) by Web Dev Simplified *15:37*

Lisäksi suosittelemme lukemaan Digitransitin [GraphQL](https://digitransit.fi/en/developers/apis/1-routing-api/0-graphql)- sekä [GraphiQL](https://digitransit.fi/en/developers/apis/1-routing-api/1-graphiql/)-sivut.


## Mikä on digitransit?

> *"Digitransit Platform is an open source journey planning solution that combines several open source components into a modern, highly available route planning service. Route planning algorithms and APIs are provided by Open Trip Planner (OTP). OTP is a great solution for general route planning but in order to provide top-notch journey planning other components such as Mobile friendly user interface, Map tile serving, Geocoding, and various data conversion tools are needed. Digitransit platform provides these tools."*
>
> https://digitransit.fi/en/developers/

Tässä esimerkkiprojektissa käytämme Digitransitin palveluista seuraavia rajapintoja:

* Geocoding API https://digitransit.fi/en/developers/apis/3-geocoding-api/
* Routing API https://digitransit.fi/en/developers/apis/1-routing-api/


## API-avaimet ja tunnistautuminen 🔐

Digitransit-rajapinnat vaativat tunnistautumista API-avainten avulla. Palveluun rekisteröityminen onnistuu ilmaiseksi osoitteessa https://portal-api.digitransit.fi/. Rekisteröinnin jälkeen voit "tilata" itsellesi "Digitransit developer API"-palvelun "Products"-välilehdellä. Tilauksen jälkeen löydät API-avaimesi "Profile"-välilehdeltä.

> [!WARNING]
> Älä tallenna API-avaintasi suoraan lähdekoodiin äläkä lisää sitä versionhallintaan. Käytä sen sijaan ympäristömuuttujaa.

Määrittele API-avain ympäristömuuttujaksi nimellä `VITE_DIGITRANSIT_SUBSCRIPTION_KEY`. Voit tehdä tämän esimerkiksi luomalla `.env`-tiedoston projektin juureen. Löydät esimerkin [`.env.example`-tiedostosta](./.env.example). Lisättyäsi tiedoston tai tehtyäsi siihen muutoksia, käynnistä kehityspalvelin uudelleen. Vaihtoehtoisesti voit asettaa muuttujan käyttöjärjestelmääsi tai koodieditoriisi ympäristömuuttujaksi.

`.env`-tiedostoa **ei tule lisätä versionhallintaan** ja se onkin rajattu pois [.gitignore](./.gitignore)-tiedoston avulla.


## Asennus ja käynnistys

Projekti asennetaan ja käynnistetään kehitystilassa kuten mikä tahansa Vite-sovellus:

```bash
npm install
npm run dev
```

Kun sovellus on käynnistynyt, siirry osoitteeseen `http://localhost:5173` tai terminaalissa näkyvään porttiin.


## Proxy-konfiguraatio

Projektissa on proxy-palvelinkonfiguraatio tiedostossa [`vite.config.ts`](./vite.config.ts), joka:

1. **Ratkaisee potentiaaliset CORS-ongelmat:** Välittää pyynnöt Digitransit API:hin kehityspalvelimen kautta
2. **Lisää tunnistautumisen:** Liittää automaattisesti API-avaimen jokaiseen pyyntöön
3. **Piilottaa API-avaimen:** API-avain ei näy frontend-koodissa tai selaimessa

Proxy käsittelee kaksi API-endpointtia:
- `/geocoding/*` → `https://api.digitransit.fi/geocoding/*` (REST API osoitehakuun)
- `/routing/*` → `https://api.digitransit.fi/routing/*` (GraphQL API reititukseen)

Jos ympäristömuuttuja on määritelty oikein ja kehityspalvelin on käynnissä, voit testata proxyä avaamalla selaimessa esimerkiksi:

* http://localhost:5173/geocoding/v1/search?text=kamppi&size=1 (toimii)

Yhteyden pitäisi onnistua ja selain näyttää JSON-vastauksen, joka sisältää haetun osoitteen koordinaatit. Suorat yhteydet Digitransitin API:hin eivät onnistu, koska ne vaativat API-avaimen ja lisäksi CORS-rajoitukset ([Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)) estävät sovellusta ottamasta siihen yhteyttä suoraan:

* https://api.digitransit.fi/geocoding/v1/search?text=kamppi&size=1 (forbidden)


## Projektin tiedostorakenne

Projektin tärkeimmät tiedostot sijaitsevat `src`-hakemistossa:

```
src/
├── components/
│   ├── AddressInput.tsx    # Osoitteen syöttökenttä, joka hakee osoitteen koordinaatit REST API:sta
│   └── ItineraryView.tsx   # Yksittäisen reittisuunnitelman näyttö
├── clients/
│   ├── geocoding.ts        # operaatiot osoitteiden hakemiseksi osoitteilla tai paikkojen nimillä (REST)
│   └── routing.ts          # operaatiot reittien hakemiseksi (GraphQL)
├── types/
│   ├── GeocodingApi.ts     # sijaintitietojen tyyppimäärittelyt
│   └── RoutingApi.ts       # reittien tyyppimäärittelyt
└── App.tsx                 # päänäkymä
```

Näistä tiedostoista [`clients`-hakemiston](./src/clients/) funktiot ovat tehtävän kannalta keskeiset, koska niihin toteutetaan REST- ja GraphQL-kutsut.


## Tehtävän osa 1: [src/clients/geocoding.ts](./src/clients/geocoding.ts)

Tehtävänäsi on täydentää `src/clients/geocoding.ts`-tiedostossa oleva funktio `addressSearch`. Funktion tulee hyödyntää [Geocoding API:a](https://digitransit.fi/en/developers/apis/3-geocoding-api/) ja palauttaa annetulla hakutekstillä saatu API-rajapinnan vastaus sellaisenaan. Vastaukselle on määritetty valmis TypeScript-tyyppi [AddressSearchResponse](./src/types/GeocodingApi.ts).

Täydennettyäsi funktion, testaa sen toimivuutta kirjoittamalla reittihaun näkymässä (http://localhost:5173) hakukenttään esimerkiksi "Kamppi" ja painamalla "Search". Osoitteen pitäisi löytyä ja tuloksen tulisi näkyä tekstikentän alapuolella. Mikäli toiminto ei toimi, tarkista mahdolliset virheilmoitukset sekä selaimen että terminaalin konsolista.


## Tehtävän osa 2:

Tämän osan suorittaminen edellyttää, että olet saanut ensimmäisen osan toimimaan. Tarkoituksena on tällä kertaa hyödyntää [Routing API:a](https://digitransit.fi/en/developers/apis/1-routing-api/) GraphQL-kyselyiden avulla.

Tehtävänäsi on täydentää [`src/clients/routing.ts`-tiedostossa](./src/clients/routing.ts) oleva funktio `fetchItineraries`. Funktion tulee hyödyntää Routing API:a ja palauttaa annetulla lähtö- ja määränpään koordinaateilla saatu API-rajapinnan vastaus. Rajapinnan antamalle vastaukselle on määritetty valmis TypeScript-tyyppi [RoutingResponse](./src/types/RoutingApi.ts). Funktiosi tulee poimia tästä vastauksesta reittisuunnitelmat (`data.plan.itineraries`) ja palauttaa ne.

Kyselyssä tulee hyödyntää GraphQL:n `plan`-operaatiota, joka saa parametreinaan lähtö- ja määränpään koordinaatit. Lisäksi voit määritellä, kuinka monta reittivaihtoehtoa haluat saada vastauksena. Alla on esitetty esimerkkikysely, [jota voit kokeilla GraphiQL-käyttöliittymässä](https://api.digitransit.fi/graphiql/hsl?query=%257B%250A%2520%2520%2520%2520plan%28%250A%2520%2520%2520%2520%2520%2520%2520%2520from%253A%2520%257B%2520lat%253A%252060.318933%252C%2520lon%253A%252024.968296%2520%257D%250A%2520%2520%2520%2520%2520%2520%2520%2520to%253A%2520%257B%2520lat%253A%252060.149087%252C%2520lon%253A%252024.984228%2520%257D%250A%2520%2520%2520%2520%2520%2520%2520%2520numItineraries%253A%25201%250A%2520%2520%2520%2520%29%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520itineraries%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520start%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520end%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520legs%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520from%2520%257B%2520name%2520%257D%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520to%2520%257B%2520name%2520%257D%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520mode%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520route%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520shortName%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%257D%250A%257D):

```graphql
{
    plan(
        from: { lat: 60.318933, lon: 24.968296 }
        to: { lat: 60.149087, lon: 24.984228 }
        numItineraries: 3
    ) {
        itineraries {
            start
            end
            legs {
                from { name }
                to { name }
                mode
                route {
                    shortName
                    longName
                }
            }
        }
    }
}
```

Suosittelemme hyödyntämään [Digitransitin GraphiQL-palvelua](https://digitransit.fi/en/developers/apis/1-routing-api/1-graphiql/) kyselyiden suunniteluun ja testaamiseen:

> *"It is highly recommended to use GraphiQL when familiarizing yourself with the Routing API."*
>
> https://digitransit.fi/en/developers/apis/1-routing-api/1-graphiql/


## Lisenssit

## Digitransit

> *"Digitransit Platform is an open source journey planning solution that combines several open source components into a modern, highly available route planning service. Route planning algorithms and APIs are provided by Open Trip Planner (OTP). OTP is a great solution for general route planning but in order to provide top-notch journey planning other components such as Mobile friendly user interface, Map tile serving, Geocoding, and various data conversion tools are needed. Digitransit platform provides these tools."*
>
> https://digitransit.fi/en/developers/

## Tämä tehtävä

Tämän tehtävän on kehittänyt Teemu Havulinna ja se on lisensoitu [Creative Commons BY-NC-SA -lisenssillä](https://creativecommons.org/licenses/by-nc-sa/4.0/). Tehtävänannon, lähdekoodien ja testien toteutuksessa on hyödynnetty ChatGPT-kielimallia sekä GitHub copilot -tekoälyavustinta.
