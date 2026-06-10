import { NextRequest, NextResponse } from "next/server";

// Luhn algorithm — validates card number checksum
function luhn(raw: string): boolean {
  const digits = raw.replace(/\s/g, "").split("").map(Number);
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function isExpiryValid(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  if (month < 1 || month > 12) return false;
  // Last day of expiry month must be >= today
  return new Date(year, month, 0) >= new Date();
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { cardNumber, cardType, expiry, cvv, cardHolder } = body;

  const errors: Record<string, string> = {};

  // Card number
  const rawNumber = String(cardNumber ?? "").replace(/\s/g, "");
  if (rawNumber.length < 13 || rawNumber.length > 19 || !/^\d+$/.test(rawNumber)) {
    errors.cardNumber = "Numéro de carte invalide (13 à 19 chiffres)";
  } else if (!luhn(rawNumber)) {
    errors.cardNumber = "Numéro de carte invalide";
  }

  // Card type
  if (!cardType) {
    errors.cardType = "Veuillez sélectionner un type de carte";
  }

  // Expiry
  if (!expiry || !isExpiryValid(String(expiry))) {
    errors.expiry = "Date d'expiration invalide ou expirée";
  }

  // CVV — 3 digits standard, 4 for Amex
  const cvvLength = cardType === "amex" ? 4 : 3;
  if (!cvv || !new RegExp(`^\\d{${cvvLength}}$`).test(String(cvv))) {
    errors.cvv = `Cryptogramme invalide (${cvvLength} chiffres requis)`;
  }

  // Cardholder name
  if (!cardHolder || String(cardHolder).trim().length < 2) {
    errors.cardHolder = "Nom du détenteur requis";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
