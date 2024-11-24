import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Manual = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-red-100 text-black">
      <div className="shadow p-5 bg-white rounded-lg space-y-4">
        <h1 className="text-xl font-bold">Upload Voice</h1>
        <input type="file" />
      </div>
    </div>
  );
};

export default Manual;
