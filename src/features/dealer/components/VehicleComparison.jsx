import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { money } from '../../../shared/lib/format';
export default function VehicleComparison({ cars }) {
  const { t, locale } = useI18n();
  const [ids, setIds] = useState([]);
  const selected = cars.filter((car) => ids.includes(car.id));
  const fields = [
    ['售價', (c) => money(c.price * 10000, locale)],
    ['年份', (c) => c.year],
    ['里程', (c) => c.mileage],
    ['車型', (c) => t(c.body)],
    ['排氣量', (c) => c.engine],
    ['顏色', (c) => t(c.color)],
  ];
  return (
    <section className="portfolio-extra" id="compare">
      <span className="kicker">SIDE BY SIDE</span>
      <h2>{t('把選擇放在一起看。')}</h2>
      <p>{t('選擇至少兩台車，比較售價、年份與里程。')}</p>
      <div className="compare-choices">
        {cars.map((car) => (
          <label key={car.id}>
            <input
              type="checkbox"
              checked={ids.includes(car.id)}
              onChange={(e) =>
                setIds(e.target.checked ? [...ids, car.id] : ids.filter((id) => id !== car.id))
              }
            />{' '}
            {t(car.name)}
          </label>
        ))}
      </div>
      <div className="compare-table">
        {selected.length < 2 ? (
          <p>{t('選擇兩台或三台車，即可開啟比較。')}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t('比較項目')}</th>
                {selected.map((car) => (
                  <th key={car.id}>{t(car.name)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map(([label, value]) => (
                <tr key={label}>
                  <th>{t(label)}</th>
                  {selected.map((car) => (
                    <td key={car.id}>{value(car)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
