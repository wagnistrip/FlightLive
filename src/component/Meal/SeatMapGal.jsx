import React from 'react'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { FaAngleDoubleLeft } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
function SeatMapGal({ row, seatMap, handleSeatSelect, currentAdultIndex, selectSeat, activeBtn }) {

  const renderColumnLabels = (seatMap) => {
    // Default labels if seatMap or Facility array is not present
    if (!seatMap || !seatMap.Facility) {
      return ["A", "B", "C", "P", "D", "E", "F"];
    }

    const seatLabels = seatMap.Facility
      .map(item => {
        const seatCode = item['@attributes'].SeatCode;
        if (seatCode) {
          // Split SeatCode by "-" and return the part after it
          const parts = seatCode.split('-');
          return parts.length > 1 ? parts[1] : ''; // Label after hyphen
        } else {
          return 'P'; // Placeholder for missing SeatCode
        }
      })
      .filter(label => label);

    return seatLabels;
  };
  // Example usage:
  let labels = [];
  if (row) {
    labels = renderColumnLabels(row);
  }

  const handleSeatClick = (seat) => {
    handleSeatSelect(currentAdultIndex, seat);
  };
  // Tooltip content creation

  const generateTooltipContent = (seat) => {
    const { SeatCode, TotalPrice } = seat["@attributes"];
    // const numericPrice = TotalPrice ? parseInt(TotalPrice.replace(/[^\d]/g, '')) : 0; // Remove non-numeric characters
    const numericPrice = TotalPrice ? parseInt(parseFloat(TotalPrice.replace(/[^\d.]/g, ''))) : 0;
    const airCharacteristic = seat && seat?.Characteristic;
    const airCharacteristic1 = Array.isArray(airCharacteristic)
      ? airCharacteristic
      : airCharacteristic && airCharacteristic["@attributes"]
        ? [airCharacteristic]
        : [];
    return `
        <div className='d-flex align-items-center rounded-sm p-0 justify-content-start'>
        <div className='border-right border-dashed w-full border-white px-2 mr-2'><strong>${SeatCode}</strong></div>
        <div className='d-inline-block w-full px-2 py-0'>
           <div className='fw-semibold'>
                    <ul style="padding: 8px 10px" style="list-style-type: square;">
                        ${airCharacteristic1.map((attr, index) =>
      `<li style="font-size: 12px; font-weight: 400;" key="${index}">${attr["@attributes"].Value}</li>`
    ).join('')
      }
                    </ul>
                </div>
          <div className='fw-bold'>Rs. <strong>${numericPrice}</strong></div>
        </div>
    </div>`
  };


  const renderSeats = (seats) => {
    return seats.map((seat, index) => {
      if (seat["@attributes"].Type === "Aisle") {
        return <div key={`aisle-${index}`} style={{
          width: '30px',
          height: '30px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          padding: '4px',
          margin: '5px',
        }}></div>;
      }

      const { SeatCode, Availability, Paid, TotalPrice } = seat["@attributes"];
      const isAvailable = Availability === 'Available';
      const isPaid = Paid === 'true';

      const price = isPaid && TotalPrice ? TotalPrice : 0;
      // Remove non-numeric characters (e.g., "INR") from the price
      // const seatFee = price ? parseInt(price.replace(/[^\d]/g, '')) : 0;
      const seatFee = price ? parseInt(parseFloat(price.replace(/[^\d.]/g, ''))) : 0 ;
      // Determine the seat style based on SeatFee ranges
      let backgroundColor;

      if (seatFee === 0) {
        backgroundColor = '#95f1bc'; // Free
      } else if (seatFee >= 1 && seatFee <= 200) {
        backgroundColor = '#c9e3ff'; // Low fee
      } else if (seatFee >= 201 && seatFee <= 400) {
        backgroundColor = '#2196f3'; // Medium fee
      } else if (seatFee >= 401 && seatFee <= 500) {
        backgroundColor = '#dc39d0'; // High fee
      } else if (seatFee >= 501 && seatFee <= 1200) {
        backgroundColor = '#f2c77f'; // Higher fee
      } else if (seatFee >= 1201 && seatFee <= 1399) {
        backgroundColor = '#f9cfbb'; // Very high fee
      } else if (seatFee >= 1400 && seatFee <= 1499) {
        backgroundColor = '#c7bff9'; // Extreme fee
      } else if (seatFee >= 1500 && seatFee <= 3000) {
        backgroundColor = '#891e74'; // Luxury fee
      } else if (seatFee > 3000) {
        backgroundColor = '#e87ff7'; // Premium fee
      }

      //   console.log("seatcode",SeatCode);

      function isSeatSelected(selectedSeats, segment, SeatCode) {
        if (!selectedSeats[segment]) {
          // console.warn(`Segment ${segment} (mapped as ${segment}) not found in selectedSeats`);
          return false;
        }
        return selectedSeats[segment]
          .filter((seat) => seat !== null) // Filter out any null values
          .some((seat) => seat["@attributes"].SeatCode === SeatCode);
      }

      const getValue = (seat) => {
        const characteristics = Array.isArray(seat?.Characteristic)
          ? seat.Characteristic
          : [seat?.Characteristic];
      
        return characteristics?.some(
          (char) => char?.["@attributes"]?.Value === "Aisle"
        )
          ? "Aisle"
          : undefined;
      };
      
  
      const currentValue = getValue(seat);
      const nextValue = getValue(seats[index + 1]);
  
      const isAisle = currentValue === "Aisle";
      const isNextAisle = nextValue === "Aisle";

      const isSelected = isSeatSelected(selectSeat, activeBtn, SeatCode);
      // Determine the final seat style based on its status
      const seatStyle = (!isAvailable)
        ? { backgroundColor: '#d5d5d5' } // Blocked or occupied seats
        : { backgroundColor }; // Use calculated background color based on price

      const characteristics = seat.Characteristic
        ? Array.isArray(seat.Characteristic)
          ? seat.Characteristic
          : [seat.Characteristic]
        : [];
      // Check if both "ExitRow" and "ExtraLegRoom" are present
      const isExitRowAndExtraLegroom = characteristics.some((char) =>
        char["@attributes"].Value === "ExitRow"
      ) && characteristics.some((char) =>
        char["@attributes"].Value === "ExtraLegRoom"
      );


      // Tooltip content for the seat
      const tooltipContent = generateTooltipContent(seat);

      return (

        <>
        <div key={`${SeatCode}-${index}`}>
          <button
            type="button"
            disabled={!isAvailable}
            className={`seat-button rounded-sm ${(!isAvailable) ? 'not-allowed' : ''}`}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: isSelected ? '#47d147' : isExitRowAndExtraLegroom ? "white" : seatStyle.backgroundColor,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'black',
              padding: '4px',
              borderRadius:'3px',
              margin: '5px',
              border: '1px solid rgb(165, 163, 163)'
            }}
            data-tooltip-id={`tooltip-${SeatCode}`}
            data-tooltip-html={tooltipContent}
            onClick={() => handleSeatClick(seat)}
          >
            {/* {isSelected ? <FaCheck color="#343a40" /> : (!isAvailable ? 'X' : '')} */}
            {isSelected ?
              '✅'
              : !isAvailable ? (
                "X"
              ) : isExitRowAndExtraLegroom ? (
                "XL"
              ) : (
                ""
              )}
          </button>
          <Tooltip id={`tooltip-${SeatCode}`} html={true} getContent={() => tooltipContent} />
        </div>
        {isAisle && isNextAisle && (
          <div
            style={{
              width: '30px',
              height: '30px',
              margin: '5px',
            }}
          ></div>
        )}
        </>
      );
    });
  };

  const isExitRow = (row) => {
    // Check if row exists and has airFacility
    if (row && Array.isArray(row.Facility)) {
      // Check if any seat in the row has the ExitRow attribute
      return row.Facility.some(seat =>
        Array.isArray(seat.Characteristic) &&
        seat.Characteristic.some(char =>
          char["@attributes"] && char["@attributes"].Value === "ExitRow"
        )
      );
    }
    // If row or airFacility does not exist, return false
    return false;
  };

  const renderRows = (seatMap) => {
    return seatMap.map((row, rowIndex) => (
      <div key={row["@attributes"].Number} className='flex flex-col'>
        {/* Row number */}
        <div className="d-flex w-full align-items-center justify-content-center">

          <div
            className=""
            style={{
              width: '30px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '12px',
              margin: '0 5px'
            }}
          >
            {row["@attributes"].Number}
          </div>


          {/* Render seats for the row */}
          {renderSeats(row.Facility)}

        </div>
        {isExitRow(row) && <div className="exit-label d-flex align-items-center justify-content-start gap-2" style={{ marginLeft: '10px', color: 'red', fontWeight: 'bold' }}> <FaAngleDoubleLeft /> EXIT</div>}

      </div>
    ));
  };

  return (
    <div className=" w-100">
      <div className=" justify-content-center">
        {/* <div className="bg-info"> */}

        <div className="d-flex w-full align-items-center justify-content-center">
          <div style={{ width: '30px', height: '30px', textAlign: 'center', margin: '0 5px' }}></div>
          {labels && labels.length > 0 && labels.map((label, index) => (
            <div key={index} style={{ width: '30px', height: '30px', textAlign: 'center', margin: '0 5px' }} className=''>
              {label === 'P' ? '' : label}
            </div>
          ))}
        </div>
        <div className="w-full">
          {renderRows(seatMap)}
        </div>
      </div>
      {/* </div> */}
    </div>
  )
}

export default SeatMapGal


