import { getQuery, safeReturnUrl, setStatus } from '../app/utils.js';
import { authService } from '../services/services.js';
import { sessionRepository } from '../repositories/repositories.js';

const form = document.querySelector('#auth-form');
const credentials = document.querySelector('[data-auth-step="credentials"]');
const otp = document.querySelector('[data-auth-step="otp"]');
const status = document.querySelector('#auth-status');
const request = document.querySelector('#request-otp');
const back = document.querySelector('#auth-back');
const returnUrl = safeReturnUrl(getQuery('return'), '/account/');

if (sessionRepository.get()) setStatus(status, 'You are already signed in to the local demo. You can continue or sign in again.');
request?.addEventListener('click', () => {
  const phone = form.elements.phone.value.trim();
  const password = form.elements.password.value;
  if (phone !== '+65 8123 4567' || password !== 'woyke-demo') { setStatus(status, 'Use the demonstration phone number and password shown above.', 'error'); return; }
  setStatus(status, 'Demo OTP revealed locally. No SMS was sent.');
  credentials.hidden = true; otp.hidden = false; form.elements.otp.focus();
});
back?.addEventListener('click', () => { otp.hidden = true; credentials.hidden = false; setStatus(status, ''); form.elements.phone.focus(); });
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (form.elements.otp.value !== '123456') { setStatus(status, 'Use demo OTP 123456. No verification service is connected.', 'error'); return; }
  authService.signIn();
  location.replace(returnUrl);
});