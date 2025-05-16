import '@testing-library/jest-dom';

// Add these lines to polyfill TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Or, if the above doesn't work directly with your Node/JSDOM version
// you might see people do:
// if (typeof global.TextEncoder === 'undefined') {
//   const { TextEncoder, TextDecoder } = require('util');
//   global.TextEncoder = TextEncoder;
//   global.TextDecoder = TextDecoder;
// }

// Any other global setup for your tests can go here.