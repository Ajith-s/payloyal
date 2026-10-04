const seedPayments = [
  { time: '09:12', vpa: 'riya@okaxis', amount: 180, hasPhone: true },
  { time: '10:04', vpa: 'arjun@oksbi', amount: 240, hasPhone: true },
  { time: '11:28', vpa: 'riya@okaxis', amount: 160, hasPhone: true },
  { time: '13:10', vpa: 'meera@okhdfcbank', amount: 310, hasPhone: false },
  { time: '16:46', vpa: 'kabir@ibl', amount: 220, hasPhone: false },
  { time: '18:05', vpa: 'arjun@oksbi', amount: 260, hasPhone: true },
  { time: '18:31', vpa: 'riya@okaxis', amount: 190, hasPhone: true }
];
let payments = [...seedPayments];
let redemptions = [
  { vpa: 'riya@okaxis', reward: '5 visits reward', discount: 50, status: 'Redeemed today' }
];
let rewardRule = {
  enabled: true,
  name: '5 visits reward',
  visits: 5,
  type: 'fixed',
  value: 50
};

const rupees = n => `₹${Math.round(n).toLocaleString('en-IN')}`;
const rewardLabel = () => rewardRule.type === 'percent' ? `${rewardRule.value}% off` : `${rupees(rewardRule.value)} off`;
const estimatedDiscount = (aov) => rewardRule.type === 'percent' ? aov * (rewardRule.value / 100) : rewardRule.value;

function customerStats() {
  const map = new Map();
  payments.forEach(p => {
    const current = map.get(p.vpa) || { vpa: p.vpa, visits: 0, spend: 0, hasPhone: false };
    current.visits += 1;
    current.spend += p.amount;
    current.hasPhone = current.hasPhone || Boolean(p.hasPhone);
    map.set(p.vpa, current);
  });
  return [...map.values()].sort((a, b) => b.spend - a.spend);
}

function syncRewardForm() {
  if (!document.getElementById('rewardName')) return;
  document.getElementById('rewardName').value = rewardRule.name;
  document.getElementById('rewardVisits').value = rewardRule.visits;
  document.getElementById('rewardType').value = rewardRule.type;
  document.getElementById('rewardValue').value = rewardRule.value;
  document.getElementById('rewardToggle').checked = rewardRule.enabled;
}

function render() {
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const customers = customerStats();
  const aov = total / payments.length;
  const returningCustomers = customers.filter(c => c.visits > 1).length;
  const newCustomers = customers.filter(c => c.visits === 1).length;
  document.getElementById('salesKpi').textContent = rupees(total);
  document.getElementById('paymentsKpi').textContent = payments.length;
  document.getElementById('repeatKpi').textContent = returningCustomers;
  const optedInCustomers = customers.filter(c => c.hasPhone).length;
  const optInRate = customers.length ? Math.round((optedInCustomers / customers.length) * 100) : 0;
  document.getElementById('phoneOptInKpi').textContent = `${optInRate}%`;
  document.getElementById('phoneOptInCount').textContent = optedInCustomers;
  document.getElementById('phoneOptInPercent').textContent = `${optInRate}%`;
  document.getElementById('campaignReach').textContent = optedInCustomers;

  document.getElementById('transactionRows').innerHTML = [...payments].reverse().slice(0, 8).map(p => `
    <tr><td>${p.time}</td><td>${p.vpa}</td><td>${rupees(p.amount)}</td><td>Paid</td></tr>
  `).join('');

  document.getElementById('customerList').innerHTML = customers.map(c => `
    <div class="customer-row"><span>${c.vpa}<br><small>${c.visits > 1 ? 'Returning customer' : 'New customer'} · ${c.hasPhone ? 'Rewards opt-in' : 'No phone opt-in'}</small></span><strong>${c.visits} visits · ${rupees(c.spend)}</strong></div>
  `).join('');

  const closeToReward = customers.filter(c => c.visits >= Math.max(1, rewardRule.visits - 2) && c.visits < rewardRule.visits);
  const eligible = customers.filter(c => c.visits >= rewardRule.visits);
  const rewardText = document.getElementById('rewardText');
  const rewardStatus = document.getElementById('rewardStatus');
  const eligibleList = document.getElementById('eligibleList');

  if (rewardText) {
    rewardText.textContent = rewardRule.enabled
      ? `${rewardRule.name}: customers earn ${rewardLabel()} after ${rewardRule.visits} visit${rewardRule.visits === 1 ? '' : 's'}.`
      : 'Rewards are currently disabled.';
  }
  if (rewardStatus) rewardStatus.textContent = rewardRule.enabled ? 'Active' : 'Paused';
  if (eligibleList) {
    eligibleList.innerHTML = rewardRule.enabled && eligible.length
      ? eligible.map(c => `<div class="customer-row"><span>${c.vpa}<br><small>Eligible for ${rewardLabel()}</small></span><strong>${c.visits}/${rewardRule.visits} visits</strong></div>`).join('')
      : `<div class="empty-state">${rewardRule.enabled ? 'No customers are eligible yet. Simulate payments to test rewards.' : 'Enable rewards to see eligible customers.'}</div>`;
  }

  const leaderboard = document.getElementById('leaderboardList');
  if (leaderboard) {
    leaderboard.innerHTML = customers.slice(0, 5).map((c, idx) => `
      <div class="customer-row leaderboard-row"><span><strong>#${idx + 1}</strong> ${c.vpa}<br><small>${rupees(c.spend)} lifetime spend</small></span><strong>${c.visits} visits</strong></div>
    `).join('');
  }

  const projectedBaseSales = total * 30;
  const loyaltyLift = rewardRule.enabled ? 0.12 : 0;
  const incrementalSales = projectedBaseSales * loyaltyLift;
  const expectedRedemptions = rewardRule.enabled ? Math.max(eligible.length, Math.ceil(closeToReward.length * 0.6)) : 0;
  const discountCost = expectedRedemptions * estimatedDiscount(aov);
  const netImpact = incrementalSales - discountCost;
  const impactGrid = document.getElementById('impactGrid');
  if (impactGrid) {
    impactGrid.innerHTML = `
      <div><strong>${rupees(projectedBaseSales)}</strong><span>Projected 30-day sales</span></div>
      <div><strong>${rupees(incrementalSales)}</strong><span>Estimated loyalty lift</span></div>
      <div><strong>${rupees(discountCost)}</strong><span>Reward cost</span></div>
      <div><strong>${rupees(netImpact)}</strong><span>Net impact</span></div>
    `;
  }
  const impactSummary = document.getElementById('impactSummary');
  if (impactSummary) {
    impactSummary.textContent = rewardRule.enabled
      ? `Based on today’s sales pace, PayLoyal estimates the current reward could add about ${rupees(netImpact)} in net 30-day sales impact after expected redemptions.`
      : 'Enable loyalty rewards to estimate 30-day sales impact.';
  }

  const redemptionRows = document.getElementById('redemptionRows');
  if (redemptionRows) {
    const projected = eligible.filter(c => !redemptions.some(r => r.vpa === c.vpa)).map(c => ({ vpa: c.vpa, reward: rewardRule.name, discount: estimatedDiscount(aov), status: 'Available' }));
    redemptionRows.innerHTML = [...redemptions, ...projected].map(r => `
      <tr><td>${r.vpa}</td><td>${r.reward}</td><td>${rupees(r.discount)}</td><td>${r.status}</td></tr>
    `).join('') || '<tr><td colspan="4">No redemptions yet.</td></tr>';
  }

  document.getElementById('dailyReport').textContent = `🤖 PayLoyal AI report — Blue Bean Cafe\n\nSales: ${rupees(total)}\nPayments: ${payments.length}\nAverage order: ${rupees(aov)}\nNew customers: ${newCustomers}\nReturning customers: ${returningCustomers}\nReward phone opt-in: ${optedInCustomers}/${customers.length} customers (${optInRate}%)\nPeak hour: 6–7 PM\n\nReward rule: ${rewardRule.enabled ? `${rewardRule.name} (${rewardLabel()} after ${rewardRule.visits} visits)` : 'Rewards disabled'}\nEligible customers: ${rewardRule.enabled ? eligible.length : 0}\nNear reward: ${rewardRule.enabled ? closeToReward.length : 0}\nRedeemed rewards: ${redemptions.length}\nProjected net 30-day impact: ${rupees(netImpact)}\n\n${rewardRule.enabled ? `Suggested action: remind near-reward customers about ${rewardLabel()} and promote the reward during peak hour.` : 'Suggested action: enable a simple reward to encourage return visits.'}`;
}

document.getElementById('loginForm')?.addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('login').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  syncRewardForm();
  render();
});

document.getElementById('simulatePayment')?.addEventListener('click', () => {
  const pool = ['riya@okaxis', 'arjun@oksbi', 'nisha@ybl', 'meera@okhdfcbank', 'samir@ibl'];
  const now = new Date();
  payments.push({
    time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    vpa: pool[Math.floor(Math.random() * pool.length)],
    amount: [120, 160, 180, 220, 260, 310][Math.floor(Math.random() * 6)],
    hasPhone: Math.random() > 0.35
  });
  render();
});

document.getElementById('rewardForm')?.addEventListener('submit', e => {
  e.preventDefault();
  rewardRule = {
    enabled: document.getElementById('rewardToggle').checked,
    name: document.getElementById('rewardName').value.trim() || 'Custom reward',
    visits: Math.max(1, Number(document.getElementById('rewardVisits').value || 1)),
    type: document.getElementById('rewardType').value,
    value: Math.max(0, Number(String(document.getElementById('rewardValue').value).replace(/[^0-9.]/g, '') || 0))
  };
  render();
});

document.getElementById('rewardToggle')?.addEventListener('change', () => {
  rewardRule.enabled = document.getElementById('rewardToggle').checked;
  render();
});

// --- Merchant demo onboarding + optional Firebase storage ---
let merchantSetup = JSON.parse(localStorage.getItem('payloyalMerchantSetup') || 'null') || {
  businessName: 'Blue Bean Cafe',
  upiId: 'bluebeancafe@okaxis',
  ownerName: 'Demo Owner',
  ownerPhone: '9999999999',
  city: 'Bengaluru',
  businessType: 'Cafe'
};

const slugify = value => String(value || 'merchant')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'merchant';

const isValidUpi = value => /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/.test(String(value || '').trim());
const siteBase = 'https://payloyal.netlify.app';

function applyMerchantSetup() {
  const slug = slugify(merchantSetup.businessName);
  const payUrl = `${siteBase}/pay.html?merchant=${encodeURIComponent(slug)}&pa=${encodeURIComponent(merchantSetup.upiId)}&pn=${encodeURIComponent(merchantSetup.businessName)}`;
  const displayUrl = `payloyal.in/pay/${slug}`;

  const title = document.getElementById('dashboardMerchantName');
  if (title) title.textContent = merchantSetup.businessName;

  const qr = document.getElementById('merchantQrImage');
  if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payUrl)}`;

  const qrUrl = document.getElementById('merchantQrUrl');
  if (qrUrl) qrUrl.textContent = displayUrl;

  const preview = document.getElementById('previewPaymentPage');
  if (preview) preview.href = `pay.html?merchant=${encodeURIComponent(slug)}&pa=${encodeURIComponent(merchantSetup.upiId)}&pn=${encodeURIComponent(merchantSetup.businessName)}`;

  ['businessName','merchantUpiId','ownerName','ownerPhone','merchantCity','businessType'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const key = ({ businessName: 'businessName', merchantUpiId: 'upiId', ownerName: 'ownerName', ownerPhone: 'ownerPhone', merchantCity: 'city', businessType: 'businessType' })[id];
    el.value = merchantSetup[key] || '';
  });
}

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

function setupMerchantOnboarding() {
  applyMerchantSetup();
  const form = document.getElementById('merchantOnboardingForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('merchantSaveStatus');
    const next = {
      businessName: document.getElementById('businessName').value.trim(),
      upiId: document.getElementById('merchantUpiId').value.trim(),
      ownerName: document.getElementById('ownerName').value.trim(),
      ownerPhone: document.getElementById('ownerPhone').value.replace(/\D/g, '').slice(-10),
      city: document.getElementById('merchantCity').value.trim(),
      businessType: document.getElementById('businessType').value
    };

    if (!next.businessName || !next.ownerName || !next.city) {
      status.textContent = 'Please fill all required merchant details.';
      return;
    }
    if (!isValidUpi(next.upiId)) {
      status.textContent = 'Enter a valid UPI ID, for example bluebeancafe@okaxis.';
      return;
    }
    if (!/^\d{10}$/.test(next.ownerPhone)) {
      status.textContent = 'Enter a valid 10-digit contact phone.';
      return;
    }

    merchantSetup = next;
    localStorage.setItem('payloyalMerchantSetup', JSON.stringify(merchantSetup));
    applyMerchantSetup();

    const slug = slugify(next.businessName);
    const payload = {
      businessName: next.businessName,
      upiId: next.upiId,
      ownerName: next.ownerName,
      ownerPhoneLast4: next.ownerPhone.slice(-4),
      city: next.city,
      businessType: next.businessType,
      slug,
      payUrl: `${siteBase}/pay.html?merchant=${encodeURIComponent(slug)}&pa=${encodeURIComponent(next.upiId)}&pn=${encodeURIComponent(next.businessName)}`,
      source: 'merchant-demo'
    };

    status.textContent = 'Saving merchant setup...';
    try {
      const result = await saveMerchantToFirebase(payload);
      status.textContent = result.stored === 'firebase'
        ? 'Saved to Firebase. QR and payment page preview updated.'
        : 'Saved locally. Add Firebase config to store demo merchants in Firestore.';
    } catch (error) {
      console.error(error);
      status.textContent = 'Saved locally, but Firebase write failed. Check Firebase config/rules.';
    }
  });
}

setupMerchantOnboarding();
