import React from 'react'


const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 100000,
};

const spinnerStyle = {
  width: '60px',
  height: '60px',
  border: '5px solid black',
  borderTop: '5px solid red',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Loader = ({isLoading}) => {
  return (
    <>
      <style>{keyframes}</style>
      {isLoading && (
        <div style={overlayStyle}>
          <div style={spinnerStyle}></div>
        </div>
      )}
    </>
  )
}
