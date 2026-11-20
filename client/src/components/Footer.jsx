import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}