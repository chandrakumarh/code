import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, Card, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
//
import useAuth from 'src/hooks/useAuth';
import fakeRequest from '../../../../utils/fakeRequest';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const { changePassword } = useAuth()

  const ChangePassWordSchema = Yup.object().shape({
    oldpassword: Yup.string().required('Old Password is required'),
    newpassword: Yup.string().required('New Password is required').min(6, 'Password must be at least 6 characters'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newpassword'), null], 'Passwords must match')
  });

  const formik = useFormik({
    initialValues: {
      oldpassword: '',
      newpassword: '',
      confirmNewPassword: ''
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = values
      delete payload["confirmNewPassword"]
      try {
        const response = await changePassword(payload);
        setSubmitting(false);
        enqueueSnackbar('Password updated successfully', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Password updated failed', { variant: 'failure' });
      }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Card sx={{ p: 3 }}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end">
            <TextField
              {...getFieldProps('oldpassword')}
              fullWidth
              autoComplete="on"
              type="password"
              label="Old Password"
              error={Boolean(touched.oldpassword && errors.oldpassword)}
              helperText={touched.oldpassword && errors.oldpassword}
            />

            <TextField
              {...getFieldProps('newpassword')}
              fullWidth
              autoComplete="on"
              type="password"
              label="New Password"
              error={Boolean(touched.newpassword && errors.newpassword)}
              helperText={(touched.newpassword && errors.newpassword) || 'Password must be minimum 6+'}
            />

            <TextField
              {...getFieldProps('confirmNewPassword')}
              fullWidth
              autoComplete="on"
              type="password"
              label="Confirm New Password"
              error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
              helperText={touched.confirmNewPassword && errors.confirmNewPassword}
            />

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </Card>
  );
}
