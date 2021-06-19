import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@material-ui/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as yup from 'yup';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Copyright } from 'shared';

import { IRegisterUserPayload, registerUserAction } from 'reducers/user';
import { State } from 'reducers';

import useStyles from './styles';

interface RegisterProps {
  registerUser: (payload: IRegisterUserPayload) => void;
}

// eslint-disable-next-line react/prop-types
const Register: React.FC<RegisterProps> = ({ registerUser }) => {
  const { t } = useTranslation(['common', 'errors']);
  const classes = useStyles();

  const RegisterSchema = yup.object().shape({
    firstName: yup
      .string()
      .required(t('errors:form.required', { FieldName: t('common:title.LastName') }))
      .max(50, t('errors:form.MaxLength', { FieldName: t('common:title.LastName') })),
    lastName: yup
      .string()
      .max(50, t('errors:form.MaxLength', { FieldName: t('common:title.LastName') })),
    email: yup
      .string()
      .email(t('errors:form.InvalidEmailFormat'))
      .required(t('errors:form.required', { FieldName: t('common:title.EmailAddress') })),
    password: yup
      .string()
      .required(t('errors:form.required', { FieldName: t('common:title.Password') }))
      .min(8, t('errors:form.MinLength', { value: 8 }))
      .max(20, t('errors:form.MaxLength', { value: 20 })),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
    resolver: yupResolver(RegisterSchema),
  });
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t('title.Register')}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(registerUser)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    autoComplete="fname"
                    variant="outlined"
                    fullWidth
                    id="firstName"
                    label={t('title.FirstName')}
                    autoFocus
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="lastName"
                    label={t('title.LastName')}
                    autoComplete="lname"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email"
                    label={t('title.EmailAddress')}
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    label={t('title.Password')}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t('title.Register')}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                {t('text.AlreadyHaveAnAccount')}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

const mapStateToProps = (state: State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  registerUser: (payload: IRegisterUserPayload) => dispatch(registerUserAction(payload)),
});

const RegisterContainer = connect(mapStateToProps, mapDispatchToProps)(Register);

export default RegisterContainer;
