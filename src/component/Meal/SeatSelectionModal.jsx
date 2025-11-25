import React, {useEffect, useState } from 'react'

function SeatSelectionModal({ data}) {

  const[modalVisible,setModalVisible]=useState(true);

  useEffect(() => {
    if (modalVisible) {
      $('#exampleModalCenter').modal('show');
    } else {
      $('#exampleModalCenter').modal('hide');
    }
  }, [modalVisible]);

  const handleConfirm = async () => {

    const requestData = data;
    setModalVisible(false);
    // setModalvisible(true);
    try {
        // const response = await addPassangerDetails(requestData);
        // console.log('Response passanger from server:', response);
        // if(response.Status== 'Success'){
        //   // setModalvisible(false)
        //   // goToStep(2);
        // }
        // else{
        //   // setModalvisible(false)
        //   // goToStep(1);
        // }
                // setLoading(false);
       
    } catch (error) {
        console.error('Error:', error);
        // setModalvisible(false);
    }
};

  return (
    <>
      <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered " role="document">
          <div className="modal-content p-4">
           <div className='d-flex align-items-center justify-content-center mb-2'>
            
          {/* <img style={{ width:'50px', height:'50px' }} src="https://flight.easemytrip.com/M_Content/img/seat-infographic.svg" alt="Seat Icon" /> */}
           </div>
            <h2 className='text-center fs-6 fw-semibold mb-4'>We have selected the perfect seat just for you!</h2>
            <span className=' text-center'>ATQ ✈ BOM</span>
          <div className="d-flex align-items-center justify-content-between  mb-3">
            <h6 className="fs-6 font-bold text-primary">9-A  <span className='text-muted'>(WINDOW)</span></h6>
            
              
            
            <span className="seat-price">₹ 375</span>
          </div>
         
          <div className="d-flex align-items-center justify-content-center mb-3">
            <button style={{ fontSize:'14px' }} className="btn btn-primary rounded-pill">Yes! I Like it</button>

          </div>
            <div className="d-flex align-items-center justify-content-between">
              <button onClick={handleConfirm} style={{ fontSize:'14px' }} className="btn text-primary fw-medium">Let Me Choose Myself</button>
              <button style={{ fontSize:'14px' }} className="btn text-primary fw-medium">Skip</button>
            </div>
           
          </div>
        </div>
      </div>
    </>
  )
}

export default SeatSelectionModal;

