import { ShareImpactStats, ShareCardTheme, ShareCardFormat } from '../types/shareImpact';

export interface GenerateImageOptions {
  theme: ShareCardTheme;
  format: ShareCardFormat;
  includeQr?: boolean;
}

// Color palettes for canvas themes
const THEME_PALETTES: Record<ShareCardTheme, {
  bgGradient: [string, string, string];
  cardBg: string;
  cardBorder: string;
  accent: string;
  accentSecondary: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  badgeText: string;
  glow: string;
}> = {
  EMERALD_GHANA: {
    bgGradient: ['#042217', '#0A3B2A', '#02160F'],
    cardBg: 'rgba(6, 44, 32, 0.75)',
    cardBorder: 'rgba(52, 211, 153, 0.35)',
    accent: '#10B981', // Emerald 500
    accentSecondary: '#F59E0B', // Amber 500
    textPrimary: '#FFFFFF',
    textSecondary: '#A7F3D0',
    badgeBg: 'rgba(16, 185, 129, 0.2)',
    badgeText: '#6EE7B7',
    glow: 'rgba(16, 185, 129, 0.25)'
  },
  KENTE_GOLD: {
    bgGradient: ['#2A1802', '#452604', '#1A0E01'],
    cardBg: 'rgba(58, 32, 5, 0.75)',
    cardBorder: 'rgba(245, 158, 11, 0.4)',
    accent: '#F59E0B', // Gold/Amber
    accentSecondary: '#10B981', // Emerald
    textPrimary: '#FFFFFF',
    textSecondary: '#FDE68A',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    badgeText: '#FCD34D',
    glow: 'rgba(245, 158, 11, 0.3)'
  },
  CYBER_DARK: {
    bgGradient: ['#0B0F19', '#111827', '#030712'],
    cardBg: 'rgba(31, 41, 55, 0.75)',
    cardBorder: 'rgba(59, 130, 246, 0.35)',
    accent: '#3B82F6', // Blue
    accentSecondary: '#10B981', // Emerald
    textPrimary: '#FFFFFF',
    textSecondary: '#93C5FD',
    badgeBg: 'rgba(59, 130, 246, 0.2)',
    badgeText: '#60A5FA',
    glow: 'rgba(59, 130, 246, 0.25)'
  },
  COASTAL_BLUE: {
    bgGradient: ['#04202C', '#0A3A4C', '#02121A'],
    cardBg: 'rgba(8, 48, 64, 0.75)',
    cardBorder: 'rgba(6, 182, 212, 0.35)',
    accent: '#06B6D4', // Cyan
    accentSecondary: '#10B981', // Emerald
    textPrimary: '#FFFFFF',
    textSecondary: '#A5F3FC',
    badgeBg: 'rgba(6, 182, 212, 0.2)',
    badgeText: '#67E8F9',
    glow: 'rgba(6, 182, 212, 0.25)'
  }
};

function getDimensions(format: ShareCardFormat): { width: number; height: number } {
  switch (format) {
    case 'STORY_PORTRAIT':
      return { width: 1080, height: 1920 };
    case 'LANDSCAPE_BANNER':
      return { width: 1200, height: 630 };
    case 'POST_SQUARE':
    default:
      return { width: 1080, height: 1080 };
  }
}

// Helper to draw rounded rectangle
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill = true,
  stroke = true
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

/**
 * Generate a high-resolution canvas image summarizing user impact stats
 */
export async function renderImpactImageToCanvas(
  stats: ShareImpactStats,
  options: GenerateImageOptions
): Promise<HTMLCanvasElement> {
  const { width, height } = getDimensions(options.format);
  const palette = THEME_PALETTES[options.theme] || THEME_PALETTES.EMERALD_GHANA;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas 2D context');

  // 1. Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, palette.bgGradient[0]);
  bgGrad.addColorStop(0.5, palette.bgGradient[1]);
  bgGrad.addColorStop(1, palette.bgGradient[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Decorative Ambient Light Orbs
  const orb1 = ctx.createRadialGradient(width * 0.8, height * 0.15, 20, width * 0.8, height * 0.15, width * 0.45);
  orb1.addColorStop(0, palette.glow);
  orb1.addColorStop(1, 'transparent');
  ctx.fillStyle = orb1;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.15, width * 0.45, 0, Math.PI * 2);
  ctx.fill();

  const orb2 = ctx.createRadialGradient(width * 0.15, height * 0.8, 20, width * 0.15, height * 0.8, width * 0.4);
  orb2.addColorStop(0, palette.glow);
  orb2.addColorStop(1, 'transparent');
  ctx.fillStyle = orb2;
  ctx.beginPath();
  ctx.arc(width * 0.15, height * 0.8, width * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // 3. Ghana Flag Decorative Strip at Top
  const stripH = 14;
  const stripW = width / 3;
  ctx.fillStyle = '#EF4444'; // Red
  ctx.fillRect(0, 0, stripW, stripH);
  ctx.fillStyle = '#F59E0B'; // Yellow/Gold
  ctx.fillRect(stripW, 0, stripW, stripH);
  ctx.fillStyle = '#10B981'; // Green
  ctx.fillRect(stripW * 2, 0, stripW, stripH);

  // Layout calculations based on format
  const isPortrait = options.format === 'STORY_PORTRAIT';
  const isLandscape = options.format === 'LANDSCAPE_BANNER';

  const marginX = isLandscape ? 60 : 70;
  const marginTop = isLandscape ? 50 : 80;

  // 4. Header Bar: Brand + Ghana Verified Pill
  // App Logo & Title
  ctx.fillStyle = palette.accent;
  ctx.font = 'bold 36px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🌿 EcoSort Ghana', marginX, marginTop + 35);

  ctx.fillStyle = palette.textSecondary;
  ctx.font = '500 18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('National Circular Economy & AI Waste Sorting Network', marginX, marginTop + 65);

  // Right pill: EPA Verified Badge
  const badgeW = 260;
  const badgeH = 44;
  const badgeX = width - marginX - badgeW;
  const badgeY = marginTop + 15;
  ctx.fillStyle = palette.badgeBg;
  ctx.strokeStyle = palette.cardBorder;
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 22, true, true);

  ctx.fillStyle = palette.badgeText;
  ctx.font = 'bold 16px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🇬🇭 EPA Verified Citizen', badgeX + badgeW / 2, badgeY + 28);
  ctx.textAlign = 'left';

  // 5. User Profile Showcase Card
  const profileCardY = marginTop + 95;
  const profileCardH = isLandscape ? 120 : 150;
  const profileCardW = width - marginX * 2;

  ctx.fillStyle = palette.cardBg;
  ctx.strokeStyle = palette.cardBorder;
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, marginX, profileCardY, profileCardW, profileCardH, 28, true, true);

  // User Avatar (Try loading image or draw stylized badge)
  const avatarSize = isLandscape ? 76 : 94;
  const avatarX = marginX + 30;
  const avatarY = profileCardY + (profileCardH - avatarSize) / 2;

  let loadedAvatar = false;
  if (stats.avatarUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = stats.avatarUrl;
      await new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        setTimeout(() => resolve(false), 800);
      });
      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();

        // Border around avatar
        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.stroke();
        loadedAvatar = true;
      }
    } catch {
      loadedAvatar = false;
    }
  }

  if (!loadedAvatar) {
    // Fallback Initial Avatar Circle
    const avGrad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
    avGrad.addColorStop(0, palette.accent);
    avGrad.addColorStop(1, palette.accentSecondary);
    ctx.fillStyle = avGrad;
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.font = `bold ${Math.round(avatarSize * 0.42)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    const initials = stats.userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'GH';
    ctx.fillText(initials, avatarX + avatarSize / 2, avatarY + avatarSize / 2 + Math.round(avatarSize * 0.15));
    ctx.textAlign = 'left';
  }

  // Name & Rank Info
  const textLeft = avatarX + avatarSize + 24;
  ctx.fillStyle = palette.textPrimary;
  ctx.font = `bold ${isLandscape ? 28 : 34}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText(stats.userName, textLeft, profileCardY + (isLandscape ? 45 : 55));

  // Rank Badge Pill
  ctx.fillStyle = palette.accent;
  ctx.font = `bold ${isLandscape ? 16 : 18}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText(`🏆 ${stats.rankTitle}`, textLeft, profileCardY + (isLandscape ? 75 : 95));

  // Community & Streak
  ctx.fillStyle = palette.textSecondary;
  ctx.font = `500 ${isLandscape ? 14 : 16}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText(`📍 ${stats.community} • 🔥 ${stats.streakDays}-Day Sorting Streak`, textLeft, profileCardY + (isLandscape ? 100 : 126));

  // 6. Metrics Grid (Highlight Stats)
  const gridY = profileCardY + profileCardH + (isLandscape ? 20 : 30);
  const gridW = width - marginX * 2;

  // Stat Items
  const metrics = [
    {
      label: 'Waste Diverted',
      value: `${stats.totalWasteKg} kg`,
      sub: 'Prevented Landfill Dumping',
      icon: '⚖️',
      color: palette.accent
    },
    {
      label: 'EcoPoints Earned',
      value: `${stats.ecoPoints} Pts`,
      sub: `≈ GH₵ ${stats.momoGhs.toFixed(2)} MoMo Cash`,
      icon: '🪙',
      color: '#F59E0B'
    },
    {
      label: 'CO₂ Offset',
      value: `${stats.co2OffsetKg} kg`,
      sub: 'Clean Air Benefit',
      icon: '💨',
      color: '#38BDF8'
    },
    {
      label: 'Trees Equivalent',
      value: `${stats.treesEquivalent} Seedlings`,
      sub: 'Preserved in Ghana Forest',
      icon: '🌳',
      color: '#4ADE80'
    },
    {
      label: 'Bottles Recycled',
      value: `${stats.plasticBottlesCount} Items`,
      sub: 'Ocean Plastic Diverted',
      icon: '🍾',
      color: '#818CF8'
    },
    {
      label: 'Verified Collections',
      value: `${stats.verifiedCollections} Pickups`,
      sub: `${stats.accuracyScore}% AI Scan Accuracy`,
      icon: '✅',
      color: '#F472B6'
    }
  ];

  if (isLandscape) {
    // 3 columns x 2 rows
    const cols = 3;
    const cardGap = 16;
    const cardWidth = (gridW - cardGap * (cols - 1)) / cols;
    const cardHeight = 110;

    metrics.forEach((m, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cx = marginX + col * (cardWidth + cardGap);
      const cy = gridY + row * (cardHeight + cardGap);

      ctx.fillStyle = palette.cardBg;
      ctx.strokeStyle = palette.cardBorder;
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, cx, cy, cardWidth, cardHeight, 18, true, true);

      // Icon & Label
      ctx.fillStyle = palette.textSecondary;
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(`${m.icon} ${m.label}`, cx + 18, cy + 30);

      // Value
      ctx.fillStyle = m.color;
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillText(m.value, cx + 18, cy + 65);

      // Sub
      ctx.fillStyle = palette.textSecondary;
      ctx.font = '500 11px system-ui, sans-serif';
      ctx.fillText(m.sub, cx + 18, cy + 90);
    });
  } else if (isPortrait) {
    // 2 columns x 3 rows with taller cards
    const cols = 2;
    const cardGap = 20;
    const cardWidth = (gridW - cardGap * (cols - 1)) / cols;
    const cardHeight = 160;

    metrics.forEach((m, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cx = marginX + col * (cardWidth + cardGap);
      const cy = gridY + row * (cardHeight + cardGap);

      ctx.fillStyle = palette.cardBg;
      ctx.strokeStyle = palette.cardBorder;
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, cx, cy, cardWidth, cardHeight, 22, true, true);

      // Icon & Label
      ctx.fillStyle = palette.textSecondary;
      ctx.font = 'bold 17px system-ui, sans-serif';
      ctx.fillText(`${m.icon} ${m.label}`, cx + 22, cy + 42);

      // Value
      ctx.fillStyle = m.color;
      ctx.font = 'bold 36px system-ui, sans-serif';
      ctx.fillText(m.value, cx + 22, cy + 95);

      // Sub
      ctx.fillStyle = palette.textSecondary;
      ctx.font = '500 14px system-ui, sans-serif';
      ctx.fillText(m.sub, cx + 22, cy + 130);
    });
  } else {
    // Square 1:1 format (2 columns x 3 rows or 3 x 2)
    const cols = 2;
    const cardGap = 18;
    const cardWidth = (gridW - cardGap * (cols - 1)) / cols;
    const cardHeight = 125;

    metrics.forEach((m, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cx = marginX + col * (cardWidth + cardGap);
      const cy = gridY + row * (cardHeight + cardGap);

      ctx.fillStyle = palette.cardBg;
      ctx.strokeStyle = palette.cardBorder;
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, cx, cy, cardWidth, cardHeight, 20, true, true);

      // Icon & Label
      ctx.fillStyle = palette.textSecondary;
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText(`${m.icon} ${m.label}`, cx + 20, cy + 34);

      // Value
      ctx.fillStyle = m.color;
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.fillText(m.value, cx + 20, cy + 78);

      // Sub
      ctx.fillStyle = palette.textSecondary;
      ctx.font = '500 13px system-ui, sans-serif';
      ctx.fillText(m.sub, cx + 20, cy + 104);
    });
  }

  // 7. Highlight Quote Banner (if portrait / story mode or bottom banner)
  if (isPortrait) {
    const bannerY = gridY + 3 * 180 + 30;
    const bannerH = 150;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, marginX, bannerY, gridW, bannerH, 24, true, true);

    ctx.fillStyle = palette.accent;
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('🌱 Circular Economy Champion Message', marginX + 30, bannerY + 45);

    ctx.fillStyle = palette.textPrimary;
    ctx.font = 'italic 17px system-ui, sans-serif';
    ctx.fillText('"Every bottle sorted in Ghana empowers local collectors and protects our coastline."', marginX + 30, bannerY + 82);

    ctx.fillStyle = palette.textSecondary;
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText('⚡ Join the movement on EcoSort Ghana • Scan, Sort & Earn MoMo', marginX + 30, bannerY + 118);
  }

  // 8. Footer Bar: Verification Ledger & URL
  const footerY = height - (isLandscape ? 40 : 60);

  ctx.fillStyle = palette.textSecondary;
  ctx.font = 'bold 15px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🛡️ Verified by Ghana EPA Node & Circular Fleet #GH-ECOSORT', marginX, footerY);

  ctx.textAlign = 'right';
  ctx.fillStyle = palette.accent;
  ctx.font = 'bold 17px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('ecosort.gh 🇬🇭', width - marginX, footerY);
  ctx.textAlign = 'left';

  return canvas;
}

/**
 * Generate a Blob from the canvas
 */
export async function getImpactImageBlob(
  stats: ShareImpactStats,
  options: GenerateImageOptions
): Promise<Blob> {
  const canvas = await renderImpactImageToCanvas(stats, options);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create image blob from canvas'));
    }, 'image/png', 0.95);
  });
}

/**
 * Generate a File object suitable for the Web Share API (navigator.share)
 */
export async function getImpactImageFile(
  stats: ShareImpactStats,
  options: GenerateImageOptions
): Promise<File> {
  const blob = await getImpactImageBlob(stats, options);
  const cleanName = stats.userName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `EcoSort_Ghana_Impact_${cleanName}_${Date.now()}.png`;
  return new File([blob], filename, { type: 'image/png', lastModified: Date.now() });
}

/**
 * Generate standard social share text
 */
export function generateShareText(stats: ShareImpactStats): { title: string; text: string; url: string } {
  const title = `My EcoSort Ghana Recycling Impact 🌿🇬🇭`;
  const text = `🌿 My EcoSort Ghana Impact Milestone!
👤 Sorter: ${stats.userName} (${stats.community})
🏆 Rank: ${stats.rankTitle}
⚖️ Waste Diverted: ${stats.totalWasteKg} kg
🪙 EcoPoints Earned: ${stats.ecoPoints} Pts (≈ GH₵ ${stats.momoGhs.toFixed(2)} MoMo)
💨 CO₂ Mitigated: ${stats.co2OffsetKg} kg
🌳 Trees Preserved: ${stats.treesEquivalent} Seedlings
🔥 Active Streak: ${stats.streakDays} Days

Turn your waste into instant Mobile Money in Ghana! 🇬🇭✨`;
  const url = window.location.origin || 'https://ecosort.gh';

  return { title, text, url };
}
