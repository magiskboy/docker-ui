import React from 'react';
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Button,
  Grid,
  Box,
  Checkbox,
  Link,
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { Copyright } from 'shared';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { State } from 'reducers';
import { ILoginUserPayload, loginUserAction } from 'reducers/user';
import useStyles from './styles';

interface LoginProps {
  loginUser: (payload: ILoginUserPayload) => void;
}

// eslint-disable-next-line react/prop-types
const Login: React.FC<LoginProps> = ({ loginUser }) => {
  const classes = useStyles();
  const { t } = useTranslation(['common', 'errors']);

  const LoginSchema = yup.object().shape({
    email: yup
      .string()
      .email(t('errors:form.InvalidEmailFormat'))
      .required(t('errors:form.required', { FieldName: t('common:title.EmailAddess') })),
    password: yup
      .string()
      .required(t('errors:form.required', { FieldName: t('common:title.Password') }))
      .min(8, t('errors:form.MinLength', { value: 8 }))
      .max(20, t('errors:form.MaxLength', { value: 20 })),
    rememberMe: yup.boolean(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
    resolver: yupResolver(LoginSchema),
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t('common:title.Login')}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(loginUser)}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label={t('common:title.EmailAddress')}
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label={t('common:title.Password')}
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...field}
              />
            )}
          />
          <FormControlLabel
            control={
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => <Checkbox color="primary" {...field} />}
              />
            }
            label={t('common:text.RememberMe')}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t('common:title.Login')}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                {t('common:text.ForgotPassword')}
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {t('common:text.RegisterReminder')}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

const mapStateToProps = (state: State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loginUser: (payload: ILoginUserPayload) => dispatch(loginUserAction(payload)),
});

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;

export { Login };
