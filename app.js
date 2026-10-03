const seedPayments = [
  { time: '09:12', vpa: 'riya@okaxis', amount: 180 },
  { time: '10:04', vpa: 'arjun@oksbi', amount: 240 },
  { time: '11:28', vpa: 'riya@okaxis', amount: 160 },
  { time: '13:10', vpa: 'meera@okhdfcbank', amount: 310 },
  { time: '16:46', vpa: 'kabir@ibl', amount: 220 },
  { time: '18:05', vpa: 'arjun@oksbi', amount: 260 },
  { time: '18:31', vpa: 'riya@okaxis', amount: 190 }
];
let payments = [...seedPayments];
let rewardRule = {
  enabled: true,
  name: '5 visits reward',
  visits: 5,
  value: '₹50 off'
};

const rupees = n => `₹${Math.round(n).toLocaleString('en-IN')}`;

function customerStats() {
  const map = new Map();
  payments.forEach(p => {
    const current = map.get(p.vpa) || { vpa: p.vpa, visits: 0, spend: 0 };
    current.visits += 1;
    current.spend += p.amount;
    map.set(p.vpa, current);
  });
  return [...map.values()].sort((a, b) => b.spend - a.spend);
}

function syncRewardForm() {
  const name = document.getElementById('rewardName');
  const visits = document.getElementById('rewardVisits');
  const value = document.getElementById('rewardValue');
  const toggle = document.getElementById('rewardToggle');
  if (!name) return;
  name.value = rewardRule.name;
  visits.value = rewardRule.visits;
  value.value = rewardRule.value;
  toggle.checked = rewardRule.enabled;
}

function render() {
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const customers = customerStats();
  const returningCustomers = customers.filter(c => c.visits > 1).length;
  document.getElementById('salesKpi').textContent = rupees(total);
  document.getElementById('paymentsKpi').textContent = payments.length;
  document.getElementById('repeatKpi').textContent = returningCustomers;
  document.getElementById('aovKpi').textContent = rupees(total / payments.length);

  document.getElementById('transactionRows').innerHTML = [...payments].reverse().slice(0, 8).map(p => `
    <tr><td>${p.time}</td><td>${p.vpa}</td><td>${rupees(p.amount)}</td><td>Paid</td></tr>
  `).join('');

  document.getElementById('customerList').innerHTML = customers.map(c => `
    <div class="customer-row"><span>${c.vpa}<br><small>${c.visits > 1 ? 'Returning customer' : 'New customer'}</small></span><strong>${c.visits} visits · ${rupees(c.spend)}</strong></div>
  `).join('');

  const closeToReward = customers.filter(c => c.visits >= Math.max(1, rewardRule.visits - 2) && c.visits < rewardRule.visits);
  const eligible = customers.filter(c => c.visits >= rewardRule.visits);
  const rewardText = document.getElementById('rewardText');
  const rewardStatus = document.getElementById('rewardStatus');
  const eligibleList = document.getElementById('eligibleList');

  if (rewardText) {
    rewardText.textContent = rewardRule.enabled
      ? `${rewardRule.name}: customers earn ${rewardRule.value} after ${rewardRule.visits} visit${rewardRule.visits === 1 ? '' : 's'}.`
      : 'Rewards are currently disabled.';
  }
  if (rewardStatus) rewardStatus.textContent = rewardRule.enabled ? 'Active' : 'Paused';
  if (eligibleList) {
    eligibleList.innerHTML = rewardRule.enabled && eligible.length
      ? eligible.map(c => `<div class="customer-row"><span>${c.vpa}<br><small>Eligible for ${rewardRule.value}</small></span><strong>${c.visits}/${rewardRule.visits} visits</strong></div>`).join('')
      : `<div class="empty-state">${rewardRule.enabled ? 'No customers are eligible yet. Simulate payments to test rewards.' : 'Enable rewards to see eligible customers.'}</div>`;
  }

  document.getElementById('dailyReport').textContent = `🤖 PayLoyal AI report — Blue Bean Cafe\n\nSales: ${rupees(total)}\nPayments: ${payments.length}\nAverage order: ${rupees(total / payments.length)}\nNew customers: ${customers.filter(c => c.visits === 1).length}\nReturning customers: ${returningCustomers}\nPeak hour: 6–7 PM\n\nReward rule: ${rewardRule.enabled ? `${rewardRule.name} (${rewardRule.value} after ${rewardRule.visits} visits)` : 'Rewards disabled'}\nEligible customers: ${rewardRule.enabled ? eligible.length : 0}\nNear reward: ${rewardRule.enabled ? closeToReward.length : 0}\n\n${rewardRule.enabled ? `Suggested action: remind near-reward customers about ${rewardRule.value}.` : 'Suggested action: enable a simple reward to encourage return visits.'}`;
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
    amount: [120, 160, 180, 220, 260, 310][Math.floor(Math.random() * 6)]
  });
  render();
});

document.getElementById('rewardForm')?.addEventListener('submit', e => {
  e.preventDefault();
  rewardRule = {
    enabled: document.getElementById('rewardToggle').checked,
    name: document.getElementById('rewardName').value.trim() || 'Custom reward',
    visits: Math.max(1, Number(document.getElementById('rewardVisits').value || 1)),
    value: document.getElementById('rewardValue').value.trim() || 'Reward'
  };
  render();
});

document.getElementById('rewardToggle')?.addEventListener('change', () => {
  rewardRule.enabled = document.getElementById('rewardToggle').checked;
  render();
});
