import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Link } from '@material-ui/core';

const Copyright: React.FC = () => {
  const { t } = useTranslation(['common']);
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {t('text.Copyright')}
      <Link color="inherit" href="/">
        Open Testing
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
};

export default Copyright;
