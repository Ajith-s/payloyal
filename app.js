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

function render() {
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const customers = customerStats();
  const repeatCustomers = customers.filter(c => c.visits > 1).length;
  document.getElementById('salesKpi').textContent = rupees(total);
  document.getElementById('paymentsKpi').textContent = payments.length;
  document.getElementById('repeatKpi').textContent = repeatCustomers;
  document.getElementById('aovKpi').textContent = rupees(total / payments.length);

  document.getElementById('transactionRows').innerHTML = [...payments].reverse().slice(0, 8).map(p => `
    <tr><td>${p.time}</td><td>${p.vpa}</td><td>${rupees(p.amount)}</td><td>Paid</td></tr>
  `).join('');

  document.getElementById('customerList').innerHTML = customers.map(c => `
    <div class="customer-row"><span>${c.vpa}<br><small>${c.visits > 1 ? 'Repeat customer' : 'New customer'}</small></span><strong>${c.visits} visits · ${rupees(c.spend)}</strong></div>
  `).join('');

  const rewardEnabled = document.getElementById('rewardToggle')?.checked;
  const closeToReward = customers.filter(c => c.visits >= 3 && c.visits < 5).length;
  document.getElementById('dailyReport').textContent = `🤖 PayLoyal AI report — Blue Bean Cafe\n\nSales: ${rupees(total)}\nPayments: ${payments.length}\nAverage order: ${rupees(total / payments.length)}\nNew customers: ${customers.filter(c => c.visits === 1).length}\nReturning customers: ${repeatCustomers}\nPeak hour: 6–7 PM\n\n${rewardEnabled ? `${closeToReward} customers are close to earning ₹50 off.\nSuggested action: remind regulars about the 5-visit reward.` : 'Rewards are currently disabled.'}`;
}

document.getElementById('loginForm')?.addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('login').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
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

document.getElementById('rewardToggle')?.addEventListener('change', render);
