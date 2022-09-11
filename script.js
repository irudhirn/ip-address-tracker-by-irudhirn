const inputEl = document.getElementById("input");
const formEl = document.getElementById("form");
const ipEl = document.getElementById("ip");
const locationEl = document.getElementById("location");
const timezoneEl = document.getElementById("timezone");
const serviceEl = document.getElementById("service");

/*

let myIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [46, 56],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94],
});

*/

/*

// domain: 'https://www.digitalsatellite.in/'

// domains:
// 000000000000000000000000000000000.xyz
// 000180.top
// 000xs.net
// 00154021-836e-4c82-9fb4-fb4abf951347.pong.s.elliq.co
// 001cdaee-0a08-4779-987f-b6b612361079.pong.s.elliq.co

// 192.212.174.101

// 103.120.253.62

// https://geo.ipify.org/api/v2/country?apiKey=at_X14vTlksv2FC3UNNDCLcSNc3S4fMA&ipAddress=8.8.8.8

`https://geo.ipify.org/api/v2/country,city?apiKey=at_X14vTlksv2FC3UNNDCLcSNc3S4fMA`

`https://geo.ipify.org/api/v2/country?apiKey=at_X14vTlksv2FC3UNNDCLcSNc3S4fMA&ipAddress=${ipAddress}`

`https://geo.ipify.org/api/v2/country?apiKey=at_X14vTlksv2FC3UNNDCLcSNc3S4fMA&domain=${ipAddress}`

*/

class App {
  #isFirst = true;
  #url;
  #map;
  #lat;
  #lng;
  #myIcon;
  #marker;

  constructor() {
    this._getIpAddress();
    this.#myIcon = L.icon({
      iconUrl: "/icon-location.svg",
      iconSize: [46, 56],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowSize: [68, 95],
      shadowAnchor: [22, 94],
    });

    formEl.addEventListener("submit", this._newIpAddress.bind(this));
  }

  _loadMap(lat, lng) {
    this.#map = L.map("map").setView([lat, lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // L.marker([lat, lng], { icon: this.#myIcon }).addTo(this.#map);
    this.#marker = new L.marker([lat, lng], { icon: this.#myIcon }).addTo(
      this.#map
    );
  }

  _newIpAddress(e) {
    e.preventDefault();

    if (inputEl.value === "") return;

    this._getIpAddress(inputEl.value.trim());

    inputEl.value = "";

    inputEl.focus();
  }

  async _getIpAddress(ipAddress) {
    // L.marker([this.#lat, this.#lng], { icon: this.#myIcon }).removeFrom(
    // this.#map
    // );
    // console.log(ipAddress);

    if (ipAddress !== undefined && +`${ipAddress}`.slice(-3) === NaN) {
      this.#url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_X14vTlksv2FC3UNNDCLcSNc3S4fMA&domain=${ipAddress}`;
    }
    if (ipAddress !== undefined && +`${ipAddress}`.slice(-3) !== NaN) {
      this.#url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_X14vTlksv2FC3UNNDCLcSNc3S4fMA&ipAddress=${ipAddress}`;
    }
    if (ipAddress === undefined) {
      this.#url =
        "https://geo.ipify.org/api/v2/country,city?apiKey=at_X14vTlksv2FC3UNNDCLcSNc3S4fMA";
    }

    const res = await fetch(this.#url);

    // console.log(res);
    if (!res.ok) {
      alert(`Error ${res.status}. ${res.statusText}`);
      return;
    }

    if (!this.#isFirst) this.#map.removeLayer(this.#marker);

    const data = await res.json();

    const { lat } = data.location;
    const { lng } = data.location;

    ipEl.textContent = data.ip;
    locationEl.textContent = `${data.location.city}, ${data.location.region} ${
      data.location.postalCode ? data.location.postalCode : ""
    }`;
    timezoneEl.textContent = `UTC ${data.location.timezone}`;
    serviceEl.textContent = data.isp.split(" ").slice(0, 3).join(" ");

    inputEl.value = "";

    // this.#lat = lat;
    // this.#lng = lng;

    console.log(data);

    if (!this.#isFirst) {
      // console.log(lat, lng);
      this.#marker = new L.marker([lat, lng], { icon: this.#myIcon }).addTo(
        this.#map
      );
      this.#map.setView([lat, lng], 14, {
        animate: true,
        pan: { duration: 1 },
      });
      return;
      // console.log(this.#lat, this.#lng);
      // L.marker([this.#lat, this.#lng], { icon: this.#myIcon }).addTo(this.#map);
      // this.#map.setView([this.#lat, this.#lng], 14, {
      //   animate: true,
      //   pan: { duration: 1 },
      // });
      // return;
    }

    if (this.#isFirst) {
      this._loadMap(lat, lng);
      this.#isFirst = false;
    }
  }
}

const app = new App();
