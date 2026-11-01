import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { toLocalDateTime } from '../../../shared/lib/format';
export default function ContestForm({ onCreate }) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    title: '',
    category: '運動',
    a: '',
    b: '',
    description: '',
    deadline: toLocalDateTime(Date.now() + 86400000),
  });
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <>
      <div className="form-intro">
        <span className="eyebrow">START A CONTEST</span>
        <h2>{t('給大家一個可以選邊的問題。')}</h2>
        <p>{t('設定兩個選項與截止時間，建立後可在「我的競賽」管理。')}</p>
      </div>
      <form
        className="create-form"
        onSubmit={(e) => {
          e.preventDefault();
          onCreate({ ...form, deadline: new Date(form.deadline).getTime() });
        }}
      >
        <label className="full">
          {t('競賽標題')}
          <input name="title" required value={form.title} onChange={update} maxLength={100} />
        </label>
        <label>
          {t('類別')}
          <select name="category" value={form.category} onChange={update}>
            {['運動', '遊戲', '生活'].map((s) => (
              <option key={s} value={s}>
                {t(s)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('參與截止時間')}
          <input
            required
            type="datetime-local"
            name="deadline"
            value={form.deadline}
            onChange={update}
          />
        </label>
        {[
          ['a', 'A 方名稱'],
          ['b', 'B 方名稱'],
        ].map(([key, label]) => (
          <label key={key}>
            {t(label)}
            <input name={key} required maxLength={40} value={form[key]} onChange={update} />
          </label>
        ))}
        <label className="full">
          {t('結果判定說明')}
          <textarea
            name="description"
            value={form.description}
            onChange={update}
            maxLength={600}
            rows={4}
          />
        </label>
        <div className="full form-note">
          {t('這是網頁互動作品，點數無現金價值，資料只保留在目前裝置。請勿輸入真實個資。')}
        </div>
        <button className="primary" type="submit">
          {t('建立競賽 ＋')}
        </button>
      </form>
    </>
  );
}
