import React from "react";

function useToastOption() {
  const toastOption = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  return toastOption;
}

export default useToastOption;
