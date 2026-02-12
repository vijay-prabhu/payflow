/**
 * Seed script — creates 15-20 sample payments via the live API
 * Usage: npx ts-node scripts/seed.ts <API_URL>
 * Example: npx ts-node scripts/seed.ts https://qmago27u40.execute-api.ca-central-1.amazonaws.com/dev
 */

const API_URL = process.argv[2];

if (!API_URL) {
  console.error('Usage: npx ts-node scripts/seed.ts <API_URL>');
  process.exit(1);
}

const merchants = [
  'Shopify Inc.',
  'Tim Hortons',
  'Bell Canada',
  'Lululemon Athletica',
  'RBC Royal Bank',
  'Air Canada',
  'Canadian Tire',
  'Telus Communications',
  'Manulife Financial',
  'Toronto-Dominion Bank',
  'Enbridge Gas',
  'Rogers Communications',
  'Loblaw Companies',
  'Brookfield Asset Mgmt',
  'Sun Life Financial',
  'Magna International',
  'BCE Inc.',
  'Nutrien Ltd.',
];

const types = ['wire', 'eft', 'interac', 'ach'] as const;
const currencies = ['CAD', 'USD'] as const;

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function createPayment(index: number) {
  const body = {
    merchant: randomItem(merchants),
    amount: randomBetween(10, 50000),
    currency: randomItem(currencies),
    type: randomItem(types),
    idempotency_key: `seed-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 10)}`,
    description: `Seed payment #${index + 1}`,
  };

  const res = await fetch(`${API_URL}/v1/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`  FAILED (${res.status}): ${text}`);
    return null;
  }

  const data = (await res.json()) as { id: string };
  console.log(`  Created ${data.id} | ${body.merchant} | $${body.amount} ${body.currency} | ${body.type}`);
  return data;
}

async function main() {
  const count = 18;
  console.log(`Seeding ${count} payments to ${API_URL}...\n`);

  for (let i = 0; i < count; i++) {
    await createPayment(i);
    // Small delay to avoid throttling
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log('\nDone! Waiting 5s for webhook processor to update statuses...');
  await new Promise((r) => setTimeout(r, 5000));

  const res = await fetch(`${API_URL}/v1/payments?limit=100`);
  const data = (await res.json()) as { count: number; payments: { status: string }[] };
  console.log(`\nTotal payments in DB: ${data.count}`);

  const statuses: Record<string, number> = {};
  for (const p of data.payments) {
    statuses[p.status] = (statuses[p.status] || 0) + 1;
  }
  console.log('Status breakdown:', statuses);
}

main().catch(console.error);
