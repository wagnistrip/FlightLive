import React from 'react'

const LoadingPage = () => {
  return (
    <div className="modal bg-black opacity-75 fade show d-block" tabIndex="1" role="dialog">
    <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content d-flex align-items-center py-5 justify-content-center">
            <div style={{ color: 'var(--main-color)' }} className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <p>Loading...</p>
        </div>
    </div>
</div>
  )
}

export default LoadingPage