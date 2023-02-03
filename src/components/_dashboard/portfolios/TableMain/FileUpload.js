import React from 'react';

import { FormHelperText } from '@mui/material';
import { UploadSingleFile } from '../../../upload';

export default function FileUpload({ touched, errors, handleDrop, values }) {
  return (
    <>
      <div style={{ margin: '1rem' }}>
        <UploadSingleFile
          maxSize={3145728}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          file={values.cover}
          onDrop={handleDrop}
          error={Boolean(touched.cover && errors.cover)}
          preview
        />
        {touched.cover && errors.cover && (
          <FormHelperText error sx={{ px: 2 }}>
            {touched.cover && errors.cover}
          </FormHelperText>
        )}
      </div>
    </>
  );
}
