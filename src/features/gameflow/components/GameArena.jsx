import { useEffect, useRef } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { drawArena, targetPositions } from './arenaRenderer';
export default function GameArena({ room, target, onTarget }) {
  const canvas = useRef(null);
  const { t } = useI18n();
  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    if (!ctx) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
    let frame;
    const draw = (time) => {
      if (!document.hidden) drawArena(ctx, { room, target, reducedMotion }, time);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [room, target]);
  return (
    <div className="arena">
      <canvas
        ref={canvas}
        width={900}
        height={480}
        aria-label={t('遊戲場景，點選目標可瞄準。也可使用下方目標選單。')}
        onClick={(event) => {
          const rect = canvas.current.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 900;
          const y = ((event.clientY - rect.top) / rect.height) * 480;
          const distances = targetPositions.map(([px, py]) => Math.hypot(x - px, y - py));
          onTarget(distances.indexOf(Math.min(...distances)));
        }}
      />
      <div className="arena-caption">{t('選擇目標 → 發射 → 查看事件')}</div>
    </div>
  );
}
