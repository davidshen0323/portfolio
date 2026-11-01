export const targetPositions = [
  [230, 190],
  [470, 270],
  [710, 150],
];
export const targetRewards = [20, 30, 50];

export function drawArena(ctx, { room, target, reducedMotion }, now) {
  const time = reducedMotion ? 0 : now / 1000;
  const background = ctx.createLinearGradient(0, 0, 900, 480);
  background.addColorStop(0, room === '深藍海域' ? '#122341' : '#164d59');
  background.addColorStop(1, '#081b2c');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 900, 480);
  ctx.strokeStyle = '#80cbd512';
  ctx.lineWidth = 1;
  for (let x = 0; x < 900; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 480);
    ctx.stroke();
  }
  for (let y = 0; y < 480; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(900, y);
    ctx.stroke();
  }
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = '#b2ecdb22';
    ctx.beginPath();
    ctx.arc(
      (i * 97) % 900,
      (((i * 79 - time * 12) % 480) + 480) % 480,
      3 + (i % 3),
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  targetPositions.forEach(([x, y], i) => {
    const pulse = 1 + Math.sin(time * 1.4 + i) * 0.08;
    ctx.fillStyle = ['#92d9c8', '#8eb1e1', '#cab2ef'][i];
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.ellipse(x, y, 40 * pulse, 27 * pulse, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(x - 35, y);
    ctx.lineTo(x - 58, y - 24);
    ctx.lineTo(x - 55, y + 25);
    ctx.fill();
    ctx.fillStyle = '#143845';
    ctx.beginPath();
    ctx.arc(x + 17, y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#bedde5';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(targetRewards[i] + ' POINTS', x, y + 60);
    if (i === target) {
      ctx.strokeStyle = '#d3f4db';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 64, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = '11px sans-serif';
      ctx.fillText('TARGET', x, y - 80);
    }
  });
  ctx.fillStyle = '#355c69';
  ctx.beginPath();
  ctx.moveTo(410, 480);
  ctx.lineTo(450, 410);
  ctx.lineTo(490, 480);
  ctx.fill();
}
