import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import usePath from "../helpers/usePath";
import useToastOption from "../helpers/useToastOption";

function UserInfo() {
  const path = usePath();
  const toastOption = useToastOption();

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    r_street1: "",
    r_street2: "",
    p_street1: "",
    p_street2: "",
    docs: [],
  });

  const [samePerAddress, setSamePerAddress] = useState(false);
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileElements, setFileElements] = useState([]);


  //state change handle
  const stateChangeHandler = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  //file type change handler
  const fileTypeChangeHandler = (e) => {
    setFileType(e.target.value);
  };

  const fileChangeHandler = (e) => {
    setFileName(e.target.files[0].name);
    setState({ ...state, docs: [...state.docs, e.target.files[0]] });
  };

  //opening new inputs for accepting more files
  const openAnotherFileAcceptor = () => {
    setFileElements([...fileElements, { fileType: "", fileName: "" }]);
  };

  //handling deletion of opened extra inputs
  const handleDeleteElement = (deleteIndex, fileName) => {
    setFileElements(
      fileElements.filter((he, index) => {
        return index !== deleteIndex;
      })
    );

    setState((prevInputs) => {
      const newState = { ...prevInputs };
      newState["docs"] = newState.docs.filter((dt) => {
        return dt.name !== fileName;
      });
      return newState;
    });
  };

  //handling files recieved in extra input opened
  const otherFileTypeChangeHandler = (e, index) => {
    setFileElements((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index].fileType = e.target.value;
      return newInputs;
    });
  };

  const otherFileChangeHandler = (e, index) => {
    setState({ ...state, docs: [...state.docs, e.target.files[0]] });
    setFileElements((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index].fileName = e.target.files[0].name;
      return newInputs;
    });
  };


  //validating age
  const ageValidator = () => {
    const today = new Date().getFullYear();
    const personAge = new Date(state.dob).getFullYear();
    const ageDiff = today - personAge;
    console.log(ageDiff);
    if (ageDiff >= 18) {
      return true;
    }
    toast.error("You must be atleast 18 years old!", toastOption);
    return false;
  };


  //validating docs (minimum 2 required)

  const checkDocNo = () => {
    if (state.docs.length >= 2) {
      return true;
    }
    toast.error("Minimum 2 documents are required!", toastOption);
    return false;
  };


  //checking if user exits with same mail id
  const checkUserExistence = async () => {
    try {
      const res = await axios.get(
        `${path}/checkUserExistence?email=${state.email}`
      );

      if (res.data.success === true) {
        toast.error(res.data.msg, toastOption);
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  };


  //making api call for storing data in db
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const findUser = await checkUserExistence();
      if (ageValidator() && checkDocNo() && findUser) {
        const formData = new FormData();
        formData.append("firstName", state.firstName);
        formData.append("lastName", state.lastName);
        formData.append("email", state.email);
        formData.append("dob", state.dob);
        formData.append("r_street1", state.r_street1);
        formData.append("r_street2", state.r_street2);
        formData.append("p_street1", state.p_street1);
        formData.append("p_street2", state.p_street2);
        state.docs.forEach((data, index) => {
          formData.append(`docs[index]`, data);
        });

        const res = await axios.post(`${path}/createUser`, formData);

        if (res.data.success === true) {
          setState({
            firstName: "",
            lastName: "",
            email: "",
            dob: "",
            r_street1: "",
            r_street2: "",
            p_street1: "",
            p_street2: "",
            docs: [],
          });
          toast.success("Your informating saved successfully!!", toastOption);
        } else {
          toast.error(res.data.msg, toastOption);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container py-4">
    <h3 className="text-center mb-4">Details</h3>
      <form className="row g-3 needs-validation" onSubmit={handleFormSubmit}>
        <div className="col-md-6">
          <h5 className="form-label">
            First name <span className="text-danger">*</span>
          </h5>
          <div className="input-group has-validation">
            <input
              type="text"
              className="form-control"
              id="validationCustomUsername"
              aria-describedby="inputGroupPrepend"
              name="firstName"
              onChange={stateChangeHandler}
              value={state.firstName}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <h5 className="form-label">
            Last name <span className="text-danger">*</span>
          </h5>
          <input
            type="text"
            className="form-control"
            id="validationCustom02"
            name="lastName"
            onChange={stateChangeHandler}
            value={state.lastName}
            required
          />
        </div>
        <div className="col-md-6">
          <h5 className="form-label">
            E-mail <span className="text-danger">*</span>
          </h5>
          <input
            type="email"
            className="form-control"
            id="validationCustom03"
            name="email"
            onChange={stateChangeHandler}
            value={state.email}
            required
          />
        </div>
        <div className="col-md-6">
          <h5>
            Date of Birth <span className="text-danger">*</span>
          </h5>
          <input
            type="date"
            className="form-control"
            id="validationCustom03"
            name="dob"
            onChange={stateChangeHandler}
            value={state.dob}
            required
          />
          <label for="validationCustom03" className="form-label">
            (Min. age should be 18 years)
          </label>
        </div>
        <h5>
          Residential Address <span className="text-danger">*</span>
        </h5>
        <div className="col-md-6">
          <label for="validationCustom03" className="form-label">
            Street1 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="validationCustom03"
            name="r_street1"
            onChange={stateChangeHandler}
            value={state.r_street1}
            required
          />
        </div>
        <div className="col-md-6">
          <label for="validationCustom03" className="form-label">
            Street2 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="validationCustom03"
            name="r_street2"
            onChange={stateChangeHandler}
            value={state.r_street2}
            required
          />
        </div>
        <div class="col-12">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value={samePerAddress}
              onChange={() => setSamePerAddress(!samePerAddress)}
              id="invalidCheck"
            />
            <label class="form-check-label" for="invalidCheck">
              Same as residential address
            </label>
          </div>
        </div>
        {!samePerAddress && (
          <div className="row g-3">
            <h5>
              Permanent address <span className="text-danger">*</span>
            </h5>
            <div className="col-md-6">
              <label for="validationCustom03" className="form-label">
                Street1 <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="validationCustom03"
                name="p_street1"
                onChange={stateChangeHandler}
                value={state.p_street1}
                disabled={samePerAddress}
                required
              />
            </div>
            <div className="col-md-6">
              <label for="validationCustom03" className="form-label">
                Street2 <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="validationCustom03"
                name="p_street2"
                onChange={stateChangeHandler}
                value={state.p_street2}
                disabled={samePerAddress}
                required
              />
            </div>
          </div>
        )}
        <div className="row g-3">
          <h5>Upload Documents</h5>
          <div className="col-md-3">
            <label for="validationCustom03" className="form-label">
              File Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="validationCustom03"
              value={fileName}
              disabled
            />
          </div>
          <div className="col-md-3">
            <label for="validationCustom03" className="form-label">
              Type of File <span className="text-danger">*</span>
            </label>
            <select
              class="form-select"
              id="validationCustom04"
              onChange={fileTypeChangeHandler}
              required
            >
              <option selected disabled value="">
                Choose...
              </option>
              <option value="image">Image</option>
              <option value="pdf">pdf</option>
            </select>
            <span>(Image/pdf)</span>
          </div>
          <div className="col-md-3">
            <label for="validationCustom03" className="form-label">
              Upload Document <span className="text-danger">*</span>
            </label>
            <div className="d-flex">
              <input
                type="file"
                className="form-control"
                accept={fileType === "image" ? "image/*" : "application/pdf"}
                id="validationCustom03"
                onChange={fileChangeHandler}
                required
                disabled={fileType ? false : true}
              />
              <div className="ms-2">
                <button
                  className="btn btn-dark"
                  onClick={openAnotherFileAcceptor}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        {fileElements.map((element, index) => (
          <div className="row" key={index}>
            <div className="col-md-3">
              <label for="validationCustom03" className="form-label">
                File Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="validationCustom03"
                value={fileElements[index].fileName}
                disabled
              />
            </div>
            <div className="col-md-3">
              <label for="validationCustom03" className="form-label">
                Type of File <span className="text-danger">*</span>
              </label>
              <select
                class="form-select"
                id="validationCustom04"
                onChange={(e) => otherFileTypeChangeHandler(e, index)}
                required
              >
                <option selected disabled value="">
                  Choose...
                </option>
                <option value="image">Image</option>
                <option value="pdf">pdf</option>
              </select>
              <span>(Image/pdf)</span>
            </div>
            <div className="col-md-3">
              <label for="validationCustom03" className="form-label">
                Upload Document <span className="text-danger">*</span>
              </label>
              <div className="d-flex">
                <input
                  type="file"
                  className="form-control"
                  accept={
                    fileElements[index].fileType === "image"
                      ? "image/*"
                      : "application/pdf"
                  }
                  id="validationCustom03"
                  onChange={(e) => otherFileChangeHandler(e, index)}
                  disabled={fileElements[index].fileType ? false : true}
                  required
                />
                <div className="ms-2">
                  <button
                    className="btn btn-dark"
                    onClick={() =>
                      handleDeleteElement(index, fileElements[index].fileName)
                    }
                  >
                    D
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div class="col-12 text-center">
          <button class="btn btn-dark" type="submit">
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default UserInfo;
