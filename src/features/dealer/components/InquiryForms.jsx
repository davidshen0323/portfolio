import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
export function InquiryForm({ cars, selectedId, onSelect }) {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: '', contact: '', message: '' });
  const [preview, setPreview] = useState(false);
  const car = cars.find((c) => c.id === selectedId);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <section className="inquiry" id="inquiry">
      <div>
        <span className="kicker">YOUR NEXT DRIVE / 03</span>
        <h2>{t('對哪一台有興趣？')}</h2>
        <p>{t('選擇車輛並留下需求，看看詢問流程如何運作。')}</p>
        <p className="note">{t('填寫內容僅在本頁預覽，不會傳送給車商。')}</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPreview(true);
        }}
      >
        <label>
          {t('想詢問的車輛')}
          <select required value={selectedId} onChange={(e) => onSelect(e.target.value)}>
            <option value="">{t('請選擇車輛')}</option>
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {t(c.name)} · {c.id}
              </option>
            ))}
          </select>
        </label>
        {[
          ['name', '稱呼', 40],
          ['contact', '聯絡方式', 80],
        ].map(([key, label, max]) => (
          <label key={key}>
            {t(label)}
            <input required name={key} value={form[key]} onChange={update} maxLength={max} />
          </label>
        ))}
        <label>
          {t('想了解的內容')}
          <textarea
            name="message"
            value={form.message}
            onChange={update}
            maxLength={500}
            rows={4}
          />
        </label>
        <button type="submit">{t('預覽詢問內容 ↗')}</button>
        {preview && car && (
          <pre className="request-preview" role="status">
            {[
              t('詢問內容預覽（未送出）'),
              t(car.name) + ' · ' + car.id,
              t('稱呼：') + form.name,
              t('聯絡方式：') + form.contact,
              t('需求：') + (form.message || t('未填寫')),
              t('資料僅供本頁預覽，不會傳送給車商。'),
            ].join('\n')}
          </pre>
        )}
      </form>
    </section>
  );
}
export function SellCarForm() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState({ model: '', year: '', mileage: '', notes: '' });
  const [preview, setPreview] = useState(false);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <section className="sell" id="sell">
      <div>
        <span className="kicker">SELL YOUR CAR / 04</span>
        <h2>{t('想出售你的車？')}</h2>
        <p>
          {t('提供車輛基本資訊，先整理一份估價需求摘要。正式網站可再串接車商的 CRM 或聯絡管道。')}
        </p>
        <p className="note">{t('此表單僅供預覽需求，不提供估價或資料傳送。')}</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPreview(true);
        }}
      >
        <label>
          {t('車款或車型')}
          <input required name="model" value={form.model} onChange={update} maxLength={80} />
        </label>
        <div className="sell-two">
          <label>
            {t('出廠年份')}
            <input
              required
              name="year"
              type="number"
              min="1980"
              max={new Date().getFullYear()}
              value={form.year}
              onChange={update}
            />
          </label>
          <label>
            {t('目前里程（公里）')}
            <input
              required
              name="mileage"
              type="number"
              min="0"
              max="1000000"
              value={form.mileage}
              onChange={update}
            />
          </label>
        </div>
        <label>
          {t('車況補充')}
          <textarea name="notes" value={form.notes} onChange={update} maxLength={500} rows={3} />
        </label>
        <button type="submit">{t('預覽售車需求 ↗')}</button>
        {preview && (
          <pre className="request-preview" role="status">
            {[
              t('售車需求預覽（未送出）'),
              form.model,
              form.year,
              Number(form.mileage).toLocaleString(locale) + ' km',
              form.notes,
              t('網站不提供估價，資料也不會傳送給車商。'),
            ].join('\n')}
          </pre>
        )}
      </form>
    </section>
  );
}
