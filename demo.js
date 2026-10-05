const siteBase = 'https://payloyal.netlify.app';
const slugify = value => String(value || 'merchant')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'merchant';
const isValidUpi = value => /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/.test(String(value || '').trim());

const choices = document.getElementById('launchpadChoices');
const setup = document.getElementById('upiSetup');
document.getElementById('showUpiSetup').addEventListener('click', () => {
  choices.classList.add('hidden');
  setup.classList.remove('hidden');
});
document.getElementById('backToChoices').addEventListener('click', () => {
  setup.classList.add('hidden');
  choices.classList.remove('hidden');
});

async function saveMerchantToFirebase(payload) {
  const config = window.PAYLOYAL_FIREBASE_CONFIG;
  if (!config) return { stored: 'local', reason: 'Firebase config not set' };

  const [{ initializeApp }, { getFirestore, collection, addDoc, serverTimestamp }] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js')
  ]);

  const app = initializeApp(config);
  const db = getFirestore(app);
  await addDoc(collection(db, 'merchant_demo_setups'), {
    ...payload,
    createdAt: serverTimestamp()
  });
  return { stored: 'firebase' };
}

document.getElementById('launchpadUpiForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = document.getElementById('merchantSaveStatus');
  const merchant = {
    businessName: document.getElementById('businessName').value.trim(),
    upiId: document.getElementById('merchantUpiId').value.trim(),
    ownerName: document.getElementById('ownerName').value.trim(),
    ownerPhone: document.getElementById('ownerPhone').value.replace(/\D/g, '').slice(-10),
    city: document.getElementById('merchantCity').value.trim(),
    businessType: document.getElementById('businessType').value
  };

  if (!merchant.businessName || !merchant.ownerName || !merchant.city) {
    status.textContent = 'Please fill all required merchant details.';
    return;
  }
  if (!isValidUpi(merchant.upiId)) {
    status.textContent = 'Enter a valid UPI ID, for example bluebeancafe@okaxis.';
    return;
  }
  if (!/^\d{10}$/.test(merchant.ownerPhone)) {
    status.textContent = 'Enter a valid 10-digit contact phone.';
    return;
  }

  const slug = slugify(merchant.businessName);
  const payUrl = `${siteBase}/pay.html?merchant=${encodeURIComponent(slug)}&pa=${encodeURIComponent(merchant.upiId)}&pn=${encodeURIComponent(merchant.businessName)}`;
  const payload = {
    businessName: merchant.businessName,
    upiId: merchant.upiId,
    ownerName: merchant.ownerName,
    ownerPhoneLast4: merchant.ownerPhone.slice(-4),
    city: merchant.city,
    businessType: merchant.businessType,
    slug,
    payUrl,
    source: 'payloyal-launchpad'
  };

  status.textContent = 'Saving setup...';
  localStorage.setItem('payloyalMerchantSetup', JSON.stringify(merchant));

  try {
    const result = await saveMerchantToFirebase(payload);
    status.textContent = result.stored === 'firebase'
      ? 'Saved to Firebase. Your demo QR is ready.'
      : 'Saved locally. Firebase config is not set.';
  } catch (error) {
    console.error(error);
    status.textContent = 'Saved locally, but Firebase write failed. Check Firestore rules.';
  }

  document.getElementById('setupResult').classList.remove('hidden');
  document.getElementById('setupQrImage').src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payUrl)}`;
  document.getElementById('setupQrUrl').textContent = `payloyal.in/pay/${slug}`;
  document.getElementById('setupPreviewLink').href = `pay.html?merchant=${encodeURIComponent(slug)}&pa=${encodeURIComponent(merchant.upiId)}&pn=${encodeURIComponent(merchant.businessName)}`;
});
