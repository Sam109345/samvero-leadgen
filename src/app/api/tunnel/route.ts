import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export const dynamic = 'force-dynamic';

// Global memory cache for tunnel process across requests
let activeTunnelUrl: string = process.env.PUBLIC_LIVE_URL || 'https://situations-tongue-reservations-laws.trycloudflare.com';
let tunnelProcess: any = null;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId') || 'pk-gmb-101';

    // Check environment first
    const envPublicUrl = process.env.PUBLIC_LIVE_URL || (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost') ? process.env.NEXT_PUBLIC_APP_URL : '');
    const currentUrl = activeTunnelUrl || envPublicUrl || 'http://localhost:3000';
    const isLive = !currentUrl.includes('localhost') && !currentUrl.includes('127.0.0.1');

    return NextResponse.json({
      success: true,
      publicUrl: currentUrl,
      isLive,
      previewUrl: `${currentUrl}/preview/${leadId}`,
      isTunnelActive: Boolean(tunnelProcess) || isLive,
      tunnelDomain: isLive ? new URL(currentUrl).hostname : 'localhost',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, customUrl } = body;

    // Option 1: Set Custom Public Domain (e.g., Vercel, Netlify, Custom Domain)
    if (action === 'set-custom-url') {
      if (!customUrl || !customUrl.startsWith('http')) {
        return NextResponse.json({ success: false, error: 'Please enter a valid URL starting with http:// or https://' }, { status: 400 });
      }

      activeTunnelUrl = customUrl.replace(/\/$/, '');

      // Persist to .env.local
      try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, 'utf8');
          if (envContent.includes('PUBLIC_LIVE_URL=')) {
            envContent = envContent.replace(/PUBLIC_LIVE_URL=.*/g, `PUBLIC_LIVE_URL="${activeTunnelUrl}"`);
          } else {
            envContent += `\nPUBLIC_LIVE_URL="${activeTunnelUrl}"`;
          }
          if (envContent.includes('NEXT_PUBLIC_APP_URL=')) {
            envContent = envContent.replace(/NEXT_PUBLIC_APP_URL=.*/g, `NEXT_PUBLIC_APP_URL="${activeTunnelUrl}"`);
          }
          fs.writeFileSync(envPath, envContent);
        }
      } catch (e) {
        console.error('Failed to write .env.local:', e);
      }

      return NextResponse.json({
        success: true,
        publicUrl: activeTunnelUrl,
        message: 'Live public URL updated successfully! All client emails will now use this link.',
      });
    }

    // Option 2: Launch Automatic Free Localtunnel
    if (action === 'start-tunnel') {
      if (tunnelProcess) {
        return NextResponse.json({
          success: true,
          publicUrl: activeTunnelUrl,
          message: 'Live public tunnel is already active!',
        });
      }

      return new Promise<NextResponse>((resolve) => {
        try {
          const isWindows = process.platform === 'win32';
          const cmd = isWindows ? 'cmd.exe' : 'npx';
          const args = isWindows ? ['/c', 'npx --yes cloudflared tunnel --url http://localhost:3000'] : ['cloudflared', 'tunnel', '--url', 'http://localhost:3000'];

          const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
          tunnelProcess = child;

          let resolved = false;
          let outputBuffer = '';

          const parseOutput = (data: any) => {
            const str = data.toString();
            outputBuffer += str;
            const match = str.match(/(https:\/\/[a-z0-9-]+\.trycloudflare\.com)/i) || str.match(/your url is: (https:\/\/[^\s]+)/i);
            if (match && match[1] && !resolved) {
              resolved = true;
              activeTunnelUrl = match[1].trim();

              // Update .env.local
              try {
                const envPath = path.join(process.cwd(), '.env.local');
                if (fs.existsSync(envPath)) {
                  let envContent = fs.readFileSync(envPath, 'utf8');
                  if (envContent.includes('PUBLIC_LIVE_URL=')) {
                    envContent = envContent.replace(/PUBLIC_LIVE_URL=.*/g, `PUBLIC_LIVE_URL="${activeTunnelUrl}"`);
                  } else {
                    envContent += `\nPUBLIC_LIVE_URL="${activeTunnelUrl}"`;
                  }
                  fs.writeFileSync(envPath, envContent);
                }
              } catch (e) {
                console.error(e);
              }

              resolve(NextResponse.json({
                success: true,
                publicUrl: activeTunnelUrl,
                message: `Live Public Cloudflare Tunnel active! Accessible globally on ${activeTunnelUrl}`,
              }));
            }
          };

          child.stdout?.on('data', parseOutput);
          child.stderr?.on('data', parseOutput);

          child.on('close', () => {
            tunnelProcess = null;
          });

          // Timeout fallback after 8 seconds
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve(NextResponse.json({
                success: true,
                publicUrl: activeTunnelUrl || 'http://localhost:3000',
                message: 'Tunnel process initiated. You can also specify any custom Vercel / Netlify domain in Settings.',
              }));
            }
          }, 8000);
        } catch (spawnErr: any) {
          resolve(NextResponse.json({ success: false, error: spawnErr?.message }, { status: 500 }));
        }
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
