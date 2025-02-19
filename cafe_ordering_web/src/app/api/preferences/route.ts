// app/api/preferences/route.ts

export const config = { runtime: 'nodejs' };

import { NextResponse } from 'next/server';
import path from 'path';

import { SitePreferenceModel } from './SitePreferenceModel';
import { PreferencesService } from './PreferencesService';

// Dosyanın yolu: Proje kök dizininde data/preferences.json
const PREF_FILE_PATH = path.join(process.cwd(), 'data', 'preferences.json');
const preferencesService = new PreferencesService(PREF_FILE_PATH);


// Aşağıdaki GET, PUT ve POST fonksiyonları Next.js API route handler olarak export edilir.

export async function GET() {
  const prefs = preferencesService.getPreferences();
  return NextResponse.json(prefs);
}

export async function PUT(request: Request) {
  try {
    const newPrefs = await request.json();
    console.log("new",newPrefs);
    const updatedPrefs = preferencesService.updatePreferences(newPrefs);
    return NextResponse.json(updatedPrefs);
  } catch (error) {
    console.error('PUT isteği sırasında hata oluştu:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return PUT(request);
}