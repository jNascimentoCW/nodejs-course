/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';

//DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

//Delegation
if (mapBox) {
    const locations = JSON.parse(
        document.getElementById('map').dataset.locations,
    );
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}
