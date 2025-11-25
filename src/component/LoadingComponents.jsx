import React from "react"
import { getImageUrl } from "../utils/airlineUtils"
function LoadingComponents() {
  return (
    <div className='loading-overlay'>
    <div className='loading-content'>
        {/* <p>Loading...</p> */}
        <img src={getImageUrl("loaderimg.gif")} alt="loader" />
    </div>
</div>
  )
}

export default LoadingComponents