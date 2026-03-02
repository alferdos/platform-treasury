import React, {useState, useEffect, memo} from "react";
import { useParams } from 'react-router-dom';

const ImageView = () => {
 const { imageName } = useParams();
 console.log(imageName,"imageName")
       return (
        <div>
              <img src={`../invoice/${imageName}`} alt="invoice-images" />

        </div>
    );
};

export default memo(ImageView);
