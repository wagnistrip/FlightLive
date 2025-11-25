import React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const Seat = (props) => {
  let backgroundColor;

  if (props.availability === "AVAILABLE") {
    if (props.totalPrice === 0) {
      backgroundColor = '#95f1bc';
    } else if (props.totalPrice >= 1 && props.totalPrice <= 200) {
      backgroundColor = '#c9e3ff';
    } else if (props.totalPrice >= 201 && props.totalPrice <= 400) {
      backgroundColor = '#2196f3';
    } else if (props.totalPrice >= 401 && props.totalPrice <= 500) {
      backgroundColor = '#dc39d0';
    } else if (props.totalPrice >= 501 && props.totalPrice <= 1200) {
      backgroundColor = '#f2c77f';
    } else if (props.totalPrice >= 1201 && props.totalPrice <= 1399) {
      backgroundColor = '#f9cfbb';
    } else if (props.totalPrice >= 1400 && props.totalPrice <= 1499) {
      backgroundColor = '#c7bff9';
    } else if (props.totalPrice >= 1500 && props.totalPrice <= 3000) {
      backgroundColor = '#891e74';
    } else if (props.totalPrice > 3000) {
      backgroundColor = '#e87ff7';
    }
  } else {
    backgroundColor = '#d5d5d5';
  }

  const style = {
    position: 'absolute',
    left: `${props.y * 2}em`,
    top: `${props.x * 2}em`,
    backgroundColor: backgroundColor,
    color: 'white',
    borderRadius: '5px',
    textAlign: 'center',
    width: '2em',
    height: '2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    // margin: '0.5em'
  };

  const sheetmap = (number) => {
    console.log("selected sheet", number);
  };

  // const tooltipContent = `<div className='d-flex align-items-center w-100 rounded-sm p-0 justify-content-start'>
  //     <div className='border-right border-dashed border-white px-2 mr-2'><strong>${props.number}</strong></div>
  //     <div className='d-inline-block px-2 py-0'>
  //       <span className='fw-semibold'></span><br/>
  //       <span className='fw-bold'>Rs. ${props.totalPrice}</span>
  //     </div>
  //   </div>
  // `;

  const tooltipContent = `<div className='d-flex align-items-center rounded-sm p-0 justify-content-start'>
  <div className='border-right border-dashed border-white px-2 mr-2'><strong>${props.number}</strong></div>
  <div className='d-inline-block px-2 py-0'>
    <span className='fw-semibold'>22</span><br/>
    <span className='fw-bold'>Rs.  ${props.totalPrice}</span>
  </div>
</div>`;

  return (
    <>
      <button
        type="button"
        data-tooltip-id={`tooltip-${props.x}-${props.y}`}
        data-tooltip-html={tooltipContent}
        className='border'
        style={style}
        onClick={() => sheetmap(props.number)}
      >
        <div style={{ fontSize: '10px' }}>
          {props.availability === "AVAILABLE" ? props.number : 'X'}
        </div>
      </button>
      <Tooltip id={`tooltip-${props.x}-${props.y}`} html={true} getContent={() => tooltipContent} />
    </>
  );
};

export default Seat;
