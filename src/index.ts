import '../phaser/phaser.js';
import {Config} from './core/config';
import './styles/styles.css';

// tslint:disable-next-line:no-unused-expression
new Config();

const newDiv = document.createElement('p');
const newContent = document.createTextNode('Hola!¿Qué tal?');
newDiv.style.fontFamily = 'pixel';
newDiv.style.position = 'absolute';
newDiv.style.left = '-1000px';
newDiv.style.visibility = 'hidden';
newDiv.style.height = '0';
newDiv.style.width = '0';
newDiv.appendChild(newContent);

document.body.append(newDiv);

document.querySelector('body').style.backgroundColor = 'lightgrey';
