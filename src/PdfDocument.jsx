
import React, { forwardRef } from 'react';
import DOMPurify from 'dompurify';

const PdfDocument = forwardRef(({ data }, ref) => {
  // Sanitize the incoming HTML data
  const sanitizedData = DOMPurify.sanitize(data);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        backgroundColor: 'pink',
      }}
    >
      {/* Inline styles applied to the custom HTML container */}
      <div
        className="custom-html-container"
        dangerouslySetInnerHTML={{ __html: sanitizedData }}
        style={{
          fontFamily: 'Arial, sans-serif',
          lineHeight: 1.5,
          color: '#000',
        }}
      />
      {/* Internal CSS for nested elements */}
      <style>
        {`
    .custom-html-container * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
     
    }

    .custom-html-container img,
    .custom-html-container iframe {
      max-width: 100%;
      height: auto;
      display: block;
    }

    .custom-html-container h1, .custom-html-container h2, 
    .custom-html-container h3, .custom-html-container p {
      margin-bottom: 1em;
    }

    /* Ensure tables do not break across pages */
    .custom-html-container table {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      width: 100%;
      border-collapse: collapse;
    }
    .custom-html-container tr, 
    .custom-html-container td, 
    .custom-html-container p,
    .custom-html-container h1,
    .custom-html-container h5,
    .custom-html-container th {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      padding: 2px;
    }

    /* Force page break before important sections if needed */
    .page-break {
      page-break-before: always !important;
      display: block;
      width: 100%;
      height: 1px;
    }
  `}
      </style>

    </div>
  );
});

export default PdfDocument;
