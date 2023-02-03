import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import FileUpload from "react-material-file-upload";

ConfirmationDialog.PropTypes = {
    showDialog: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    successButtonTitle: PropTypes.string.isRequired,
    destroyButtonTitle: PropTypes.string.isRequired,
    onTapSuccessButton: PropTypes.func.isRequired,
    onTapDestroyButton: PropTypes.func.isRequired
}

ConfirmationDialog.PropTypes = {
    showDialog: false,
    title: "",
    successButtonTitle: "",
    destroyButtonTitle: "",
    onTapSuccessButton: () => { },
    onTapDestroyButton: () => { }
}


export default function FileUploadDialog({ showDialog, title, successButtonTitle, destroyButtonTitle, onTapSuccessButton, onTapDestroyButton }) {
    const [open, setOpen] = React.useState(false);
    const [files, setFiles] = useState([]);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={showDialog}
            onClose={onTapDestroyButton}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <FileUpload value={files} onChange={setFiles} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onTapDestroyButton}>{destroyButtonTitle}</Button>
                <Button onClick={() => onTapSuccessButton(files)} autoFocus>
                    {successButtonTitle}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
