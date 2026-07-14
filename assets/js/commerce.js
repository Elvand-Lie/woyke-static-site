const requestOtp = document.querySelector('#request-otp')
const authBack = document.querySelector('#auth-back')
const authForm = document.querySelector('#auth-form')
const credentialsStep = document.querySelector('[data-auth-step="credentials"]')
const otpStep = document.querySelector('[data-auth-step="otp"]')
const authStatus = document.querySelector('#auth-status')

requestOtp?.addEventListener('click', () => {
  const phone = authForm?.elements?.phone?.value?.trim()
  const password = authForm?.elements?.password?.value
  if (phone !== '+65 8123 4567' || password !== 'woyke-demo') {
    authStatus.hidden = false
    authStatus.textContent = 'Use the demonstration phone number and password shown above.'
    return
  }
  authStatus.hidden = true
  credentialsStep.hidden = true
  otpStep.hidden = false
  authForm.elements.otp?.focus()
})
authBack?.addEventListener('click', () => {
  otpStep.hidden = true
  credentialsStep.hidden = false
  authStatus.hidden = true
  authForm.elements.phone?.focus()
})
authForm?.addEventListener('submit', (event) => {
  event.preventDefault()
  if (authForm.elements.otp?.value !== '123456') {
    authStatus.hidden = false
    authStatus.textContent = 'Use demo OTP 123456.'
    return
  }
  localStorage.setItem('woyke-demo-session','active')
  location.href = '/account/'
})

const checkoutForm = document.querySelector('#checkout-form')
checkoutForm?.addEventListener('submit', (event) => {
  event.preventDefault()
  if (!checkoutForm.reportValidity()) return
  const button = checkoutForm.querySelector('button[type="submit"] span:first-child')
  if (button) button.textContent = 'Creating demo order…'
  setTimeout(() => { location.href = '/checkout/success/' }, 650)
})

const copyShare = document.querySelector('#copy-share')
const shareStatus = document.querySelector('#share-status')
copyShare?.addEventListener('click', async () => {
  const value = `${location.origin}/share/`
  try { await navigator.clipboard.writeText(value); shareStatus.textContent = 'Demo link copied.' }
  catch { shareStatus.textContent = value }
})
