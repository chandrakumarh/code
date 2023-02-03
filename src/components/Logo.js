import PropTypes from 'prop-types';
// material
import { useTheme } from '@mui/material/styles';
import { Box, Avatar } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;

  return (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320.4 107.88">
        <defs>
          <style>{'.cls-1{fill:#389f3b;}.cls-2{fill:#1d89bc;}'}</style>
        </defs>
        <path
          className="cls-1"
          d="M104.3,87.58H71a15.44,15.44,0,0,0,4.55,10.8,15,15,0,0,0,10.83,4,28.16,28.16,0,0,0,17.07-5.76v9.16a31.12,31.12,0,0,1-8.56,4.11,35.92,35.92,0,0,1-10,1.24q-7.83,0-12.66-3.24a23.72,23.72,0,0,1-7.74-8.72A26.65,26.65,0,0,1,61.65,86.5q0-10.81,6.12-17.57a20.46,20.46,0,0,1,15.9-6.77q9.42,0,15,6.59t5.61,17.64ZM71.22,82H95c-.24-3.74-1.36-6.62-3.34-8.64a10.73,10.73,0,0,0-8-3,11.54,11.54,0,0,0-8.26,3A15,15,0,0,0,71.22,82Z"
          transform="translate(-61.65 -26.66)"
        />
        <path
          className="cls-1"
          d="M112.12,107V96.94a42.81,42.81,0,0,0,8.1,4.5,18.83,18.83,0,0,0,7,1.72,8.74,8.74,0,0,0,5-1.44,4.13,4.13,0,0,0,2.11-3.44A4.64,4.64,0,0,0,133,94.86a32.13,32.13,0,0,0-5.89-3.94q-9.06-5-11.86-8.62a12.34,12.34,0,0,1-2.8-7.79,11,11,0,0,1,4.24-8.9q4.24-3.45,10.93-3.45a30.18,30.18,0,0,1,14.25,3.91v9.26q-8.34-5-13.63-5a7.58,7.58,0,0,0-4.4,1.16,3.58,3.58,0,0,0-1.67,3.07,4.42,4.42,0,0,0,1.51,3.14,26.4,26.4,0,0,0,5.33,3.6l3.34,1.9Q144.17,89.85,144.16,98a11.75,11.75,0,0,1-4.55,9.54q-4.55,3.73-11.7,3.73a28.53,28.53,0,0,1-7.51-.9A50.33,50.33,0,0,1,112.12,107Z"
          transform="translate(-61.65 -26.66)"
        />
        <path
          className="cls-1"
          d="M151.55,79.45a14.45,14.45,0,0,1,5.53-12q5.53-4.39,15.1-4.4h23l7,7.31h-20A19.52,19.52,0,0,1,186,75.54a12.39,12.39,0,0,1,1.08,5.3,14.16,14.16,0,0,1-2.11,7.28,14.74,14.74,0,0,1-5.42,5.47q-3.31,1.91-10.88,3c-3.54.51-5.3,1.73-5.3,3.65a3.09,3.09,0,0,0,2,2.7,30.65,30.65,0,0,0,7.18,2.19,77.94,77.94,0,0,1,11.18,3,14.4,14.4,0,0,1,4.51,3.09,11.58,11.58,0,0,1,3.39,8.54q0,6.73-6,10.75t-16,4q-10.12,0-16.17-4t-6-10.82q0-9.63,11.88-12.4c-3.15-2-4.73-4-4.73-6a5.52,5.52,0,0,1,2-4.12A12.61,12.61,0,0,1,162,94.42Q151.55,89.79,151.55,79.45Zm15.38,33.18a13.73,13.73,0,0,0-7.74,2,6,6,0,0,0-3,5.15q0,7.31,13.17,7.3,6.22,0,9.64-1.82t3.42-5.17q0-3.3-4.32-5.38A25.76,25.76,0,0,0,166.93,112.63Zm2.21-41.41a9,9,0,0,0-6.48,2.57A8.27,8.27,0,0,0,160,80,7.83,7.83,0,0,0,162.61,86a9.5,9.5,0,0,0,6.64,2.39A9.38,9.38,0,0,0,175.86,86a8.42,8.42,0,0,0,0-12.27A9.46,9.46,0,0,0,169.14,71.22Z"
          transform="translate(-61.65 -26.66)"
        />
        <path
          className="cls-2"
          d="M293.37,63.09H333.8l-25.06,38.58H333.8v8.75H292.34l24.88-38.58H293.37Z"
          transform="translate(-61.65 -26.66)"
        />
        <path
          className="cls-2"
          d="M382.06,87.58H348.77a15.45,15.45,0,0,0,4.56,10.8,15,15,0,0,0,10.83,4,28.16,28.16,0,0,0,17.07-5.76v9.16a31.12,31.12,0,0,1-8.56,4.11,35.92,35.92,0,0,1-9.95,1.24q-7.83,0-12.66-3.24a23.72,23.72,0,0,1-7.74-8.72,26.65,26.65,0,0,1-2.91-12.68q0-10.81,6.12-17.57a20.45,20.45,0,0,1,15.9-6.77q9.4,0,15,6.59t5.61,17.64ZM349,82H372.8q-.36-5.61-3.35-8.64a10.71,10.71,0,0,0-8-3,11.54,11.54,0,0,0-8.26,3A15,15,0,0,0,349,82Z"
          transform="translate(-61.65 -26.66)"
        />
        <path
          className="cls-2"
          d="M258.08,63.09h10l-20.91,48.15h-3l-14-33-13.82,33h-3L192.29,63.09h10.06l12.4,28.7,12.08-28.7h6.94l11.94,28.7Z"
          transform="translate(-61.65 -26.66)"
        />
        <path
          className="cls-2"
          d="M276,66.84v43.59h9.36V66.37a13.5,13.5,0,0,1-9.36.47Z"
          transform="translate(-61.65 -26.66)"
        />
        <path
          className="cls-1"
          d="M281,33.23s0-.08,0-.12a2.37,2.37,0,0,0-4.73,0,1.27,1.27,0,0,0,0,.28h-.1a2.69,2.69,0,0,1-2.6,3.49,2.71,2.71,0,0,1-2.1-1,2.43,2.43,0,0,1-.2-.25l-.11-.21,0,0A3.53,3.53,0,1,0,266,40.2l.24.24.08.09a3.09,3.09,0,0,1-1.84,5l-.14,0-.23,0a2.45,2.45,0,0,0-.39,0,2.37,2.37,0,0,0,.39,4.7,3,3,0,0,0,.31,0A15,15,0,1,0,281,33.23Zm-1.69,24.38a9.25,9.25,0,1,1,9.25-9.25A9.25,9.25,0,0,1,279.34,57.61Z"
          transform="translate(-61.65 -26.66)"
        />
        <path
          className="cls-1"
          d="M264.08,44.09a1.77,1.77,0,0,0,.73-.15A1.88,1.88,0,0,0,266,42.2a2,2,0,0,0-.17-.77,1.89,1.89,0,1,0-1.72,2.66Z"
          transform="translate(-61.65 -26.66)"
        />
        <circle className="cls-1" cx="203.14" cy="6.39" r="1.36" />
        <path
          className="cls-1"
          d="M277.62,29.37A1.36,1.36,0,1,0,276.27,28,1.36,1.36,0,0,0,277.62,29.37Z"
          transform="translate(-61.65 -26.66)"
        />
        <path
          className="cls-1"
          d="M273.64,35.81a1.89,1.89,0,0,0,1.88-1.89,1.84,1.84,0,0,0,0-.33,1.88,1.88,0,0,0-3.74.33,1.92,1.92,0,0,0,.29,1A1.89,1.89,0,0,0,273.64,35.81Z"
          transform="translate(-61.65 -26.66)"
        />
      </svg>
      {/* <img alt="Esgwize" src="/public/static/img/esgwize_logo.png" /> */}
      {/* <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
          <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>
        <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
          <path
            fill="url(#BG1)"
            d="M183.168 285.573l-2.918 5.298-2.973 5.363-2.846 5.095-2.274 4.043-2.186 3.857-2.506 4.383-1.6 2.774-2.294 3.939-1.099 1.869-1.416 2.388-1.025 1.713-1.317 2.18-.95 1.558-1.514 2.447-.866 1.38-.833 1.312-.802 1.246-.77 1.18-.739 1.111-.935 1.38-.664.956-.425.6-.41.572-.59.8-.376.497-.537.69-.171.214c-10.76 13.37-22.496 23.493-36.93 29.334-30.346 14.262-68.07 14.929-97.202-2.704l72.347-124.682 2.8-1.72c49.257-29.326 73.08 1.117 94.02 40.927z"
          />
          <path
            fill="url(#BG2)"
            d="M444.31 229.726c-46.27-80.956-94.1-157.228-149.043-45.344-7.516 14.384-12.995 42.337-25.267 42.337v-.142c-12.272 0-17.75-27.953-25.265-42.337C189.79 72.356 141.96 148.628 95.69 229.584c-3.483 6.106-6.828 11.932-9.69 16.996 106.038-67.127 97.11 135.667 184 137.278V384c86.891-1.611 77.962-204.405 184-137.28-2.86-5.062-6.206-10.888-9.69-16.994"
          />
          <path
            fill="url(#BG3)"
            d="M450 384c26.509 0 48-21.491 48-48s-21.491-48-48-48-48 21.491-48 48 21.491 48 48 48"
          />
        </g>
      </svg> */}
    </Box>
  );
}
