import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { FaAngleDoubleLeft } from "react-icons/fa";
const SeatStructure = ({ seatMap, row, handleSeatSelect, currentAdultIndex, selectSeat, activeBtn }) => {

  if (!seatMap) return <p className="text-center">Loading seat map...</p>;

  const columnOrder = row.seatOccupationDetails.map((seat) => ({
    column: seat.seatColumn,
    characteristics: Array.isArray(seat.seatCharacteristic)
      ? seat.seatCharacteristic.filter((char) => typeof char === "string") // Ignore seatPrice objects
      : [seat.seatCharacteristic], // Convert single string values to an array
  }));


  return (
    <div className="rounded">
      <div className=" d-flex gap-2 my-2">
        <div style={{ width: '30px' }} className="fw-bold"></div>


        {row.seatOccupationDetails.map((seat, seatIndex) => {
          const currentCharacteristics = Array.isArray(seat.seatCharacteristic)
            ? seat.seatCharacteristic
            : [seat.seatCharacteristic];

          const nextSeat = row.seatOccupationDetails[seatIndex + 1];
          const nextCharacteristics = nextSeat
            ? Array.isArray(nextSeat.seatCharacteristic)
              ? nextSeat.seatCharacteristic
              : [nextSeat.seatCharacteristic]
            : [];

          const isCurrentA = currentCharacteristics.includes("A");
          const isNextA = nextCharacteristics.includes("A");
          const isCurrent8 = currentCharacteristics.includes("8");
          const isNext8 = nextCharacteristics.includes("8");

          // Add space div when:
          // 1. First "A" is followed by "A" or "8"
          // 2. First "8" is followed by "A"
          const shouldAddBlankDiv = (isCurrentA && (isNextA || isNext8)) || (isCurrent8 && isNextA);

          return (
            <React.Fragment key={seatIndex}>
              <div
                className="d-flex align-items-center justify-content-center rounded text-black fw-bold"
                style={{
                  width: "30px",
                  height: "30px",
                }}
              >
                {seat.seatColumn}
              </div>

              {shouldAddBlankDiv && (
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                ></div>
              )}
            </React.Fragment>
          );
        })}

      </div>
      {seatMap.map((row, rowIndex) => {
        const isExitRow = row?.rowCharacteristicDetails?.rowCharacteristic === "E"; // ✅ Check if the row is an exit row

        return (
          row?.seatOccupationDetails?.length > 0 && (
            <div key={rowIndex} className="flex flex-col">
              {/* Show EXIT label before the row if it is an exit row */}
              {isExitRow && (
                <div
                  className="exit-label d-flex align-items-center justify-content-start gap-2"
                  style={{ marginLeft: "10px", color: "red", fontWeight: "bold" }}
                >
                  <FaAngleDoubleLeft /> EXIT
                </div>
              )}

              <div className="d-flex gap-2 align-items-center mb-2">
                {/* Row Number */}
                <div
                  style={{ width: "30px", height: "30px" }}
                  className="fw-bold d-flex align-content-center justify-content-center"
                >
                  {row.seatRowNumber}
                </div>

                <div className="d-flex align-items-center gap-2">
                  {columnOrder.map(({ column, characteristics }, seatIndex) => {
                    const seat = row.seatOccupationDetails.find(
                      (s) => s.seatColumn === column
                    );

                    const nextSeatCharacteristics = columnOrder[seatIndex + 1]?.characteristics;

                    const isCurrentA = characteristics.includes("A");
                    const isNextA = nextSeatCharacteristics?.includes("A");
                    const isCurrent8 = characteristics.includes("8");
                    const isNext8 = nextSeatCharacteristics?.includes("8");

                    // Add space div when:
                    // 1. First "A" is followed by "A" or "8"
                    // 2. First "8" is followed by "A"
                    const shouldAddBlankDiv = (isCurrentA && (isNextA || isNext8)) || (isCurrent8 && isNextA);

                    return (
                      <React.Fragment key={`${row.seatRowNumber}-${column}`}>
                        {seat ? (
                          <Seat
                            key={`${row.seatRowNumber}-${column}`}
                            seat={seat}
                            rowno={row.seatRowNumber}
                            index={seatIndex}
                            isSelected={selectSeat[activeBtn]?.some(
                              (selectedSeat) =>
                                selectedSeat?.seatRowNumber === row?.seatRowNumber &&
                                selectedSeat?.seatColumn === seat?.seatColumn
                            )}


                            handleSeatSelect={() =>
                              handleSeatSelect(currentAdultIndex, seat, activeBtn, row?.seatRowNumber)
                            }
                          />

                        ) : (
                          <div
                            key={`missing-${row.seatRowNumber}-${column}`}
                            style={{
                              width: "30px",
                              height: "30px",
                              backgroundColor: "#ddd",
                              border: "1px solid #909090",
                            }}
                            className="d-flex align-items-center rounded-sm justify-content-center"
                          >
                            ✖️
                          </div>
                        )}

                        {shouldAddBlankDiv && (
                          <div
                            key={`blank-gap-${row.seatRowNumber}-${column}`}
                            style={{ width: "30px", height: "30px" }}
                          ></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

            </div>
          )
        );
      })}

    </div>
  );
};





const generateTooltipContent = (seat, rowno) => {
  const seatCode = `${rowno}-${seat.seatColumn}`;

  const characteristicLabels = {
    "9": "Center Seats",
    "W": "Window Seats",
    "CH": "Chargeable Seats",
    "O": "Occupied Seats",
    "FC": "First Chargeable Seats",
    "A": "Aisle Seats",
    "1A": "Seat not allowed for infant",
    "E": "Exit row seat",
    "IE": "Seat not suitable for child",
    "L": "Let space seat",
    "LS": "Left side of aircraft",
    "OW": "Overwing seat",
    "1": "Restricted seat",
  };

  const seatCharacteristics = Array.isArray(seat.seatCharacteristic)
    ? seat.seatCharacteristic
    : [seat.seatCharacteristic];

  // Extract and map seat characteristics to human-readable labels
  const seatCharacteristicsList = seatCharacteristics
    .filter(char => typeof char === "string")
    .map((char, index) => {
      const label = characteristicLabels[char] || `Unknown (${char})`; // Fallback for unknown codes
      return `<li style="font-size: 12px; font-weight: 400;" key="${index}">${label}</li>`;
    })
    .join("");

  // Extract seat price if available
  const priceInfo = seatCharacteristics.find(char => typeof char === "object" && char.seatPrice);
  const seatPrice = priceInfo?.seatPrice?.find(p => p.typeQualifier === "T")?.amount || 0;
  return `
      <div className='d-flex align-items-center rounded-sm p-2 justify-content-start'>
      <div className='border-right border-dashed w-full border-white px-2 mr-2'><strong>${seatCode}</strong></div>
            <div className='d-inline-block w-full px-2 py-0'>
                  <div style="padding: 8px 30px" className='fw-semibold'>
                          <ul style="list-style-type: square;">
                            ${seatCharacteristicsList}
                        </ul>
                  </div>
            </div>
     <div className='fw-bold'>Rs. <strong>${seatPrice}</strong></div>
  </div>`
};



const Seat = ({ seat, rowno, index, isSelected, handleSeatSelect }) => {

  const seatCharacteristics = Array.isArray(seat.seatCharacteristic)
    ? seat.seatCharacteristic
    : [seat.seatCharacteristic];

  // Find price info if it exists
  const priceInfo = seatCharacteristics.find((char) => typeof char === 'object' && char.seatPrice);
  const seatPrice = priceInfo?.seatPrice?.find(p => p.typeQualifier === "T")?.amount || 0;
  // Check if any seat in the row has "L" (Let space seat)
  const isExitRowAndExtraLegroom = seatCharacteristics.includes("L");
  const ExitRow = seatCharacteristics.includes("E");

  const isBlocked = seatCharacteristics.some(char => ['O', '1', '8'].includes(char));
  // Determine background color based on price
  let backgroundColor = "#ffffff"; // Default color (white)

  if (seatPrice === 0) {
    backgroundColor = '#95f1bc'; // Free
  } else if (seatPrice >= 1 && seatPrice <= 200) {
    backgroundColor = '#c9e3ff'; // Low fee
  } else if (seatPrice >= 201 && seatPrice <= 400) {
    backgroundColor = '#2196f3'; // Medium fee
  } else if (seatPrice >= 401 && seatPrice <= 500) {
    backgroundColor = '#dc39d0'; // High fee
  } else if (seatPrice >= 501 && seatPrice <= 1200) {
    backgroundColor = '#f2c77f'; // Higher fee
  } else if (seatPrice >= 1201 && seatPrice <= 1399) {
    backgroundColor = '#f9cfbb'; // Very high fee
  } else if (seatPrice >= 1400 && seatPrice <= 1499) {
    backgroundColor = '#c7bff9'; // Extreme fee
  } else if (seatPrice >= 1500 && seatPrice <= 3000) {
    backgroundColor = '#891e74'; // Luxury fee
  } else if (seatPrice > 3000) {
    backgroundColor = '#e87ff7'; // Premium fee
  }

  // Tooltip content for the seat
  const tooltipContent = generateTooltipContent(seat, rowno);
  return (
    <div key={`${rowno}-${index}`}>

      <button
        type="button"
        className={`seat-button rounded-sm`}
        style={{
          width: "30px",
          height: "30px",
          backgroundColor: isBlocked
            ? "#ddd"
            : isSelected
              ? "#47d147"
              : backgroundColor, // Default background color
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "black",
          padding: "1px",
          border: "1px solid rgb(216, 213, 213)",
          // position: "relative",
        }}
        data-tooltip-id={`tooltip-${rowno}`}
        data-tooltip-html={tooltipContent}
        disabled={isBlocked} // Disable button if seat is blocked
        onClick={handleSeatSelect}
      >
        {isSelected
          ? "✅"
          : isBlocked
            ? "✖️"
            : isExitRowAndExtraLegroom
              ? "XL"
              : ""}

        {/* Top-right corner red box */}
        {ExitRow && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "10px",
              height: "10px",
              borderRadius:'0px 0 0 6px',
              backgroundColor: "red", // Change to your desired color
              borderTopRightRadius: "1px",
            }}
          ></div>
        )}
      </button>

      {/* ✅ */}
      <Tooltip id={`tooltip-${rowno}`} html={true} getContent={() => tooltipContent} />
    </div>

  );
};


export default SeatStructure;

