import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ledgerService from "../features/ledger/ledgerService";
import { edit, reset } from "../features/ledger/ledgerSlice";
import Loading from "../components/Loading";

export default function EditLedger() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.ledger
  );

  // const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [helperText, setHelperText] = useState();
  const [saveButtonLabel, setSaveButtonLabel] = useState("Save");

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });
  const { name, type, description } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    const data = {
      name,
      type,
      description,
    };

    dispatch(edit({ id, body: data }));
  };

  const getLedger = async () => {
    try {
      const l = await ledgerService.getById(id, user?.token);

      setHelperText("");
      setFormData({
        name: l.name,
        type: l.type,
        description: l.description,
      });
    } catch (e) {
      setHelperText(e.response.data.error.message);
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    if (isError) {
      setSaveButtonLabel("Save");
      setHelperText(message);
    }

    if (isSuccess) {
      setSaveButtonLabel("Saved 🎉");
      setHelperText("");
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getLedger();
    }
  }, [user, navigate]);

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Edit Ledger</h1>
            </div>
            <h1 className="text-2xs font-thin break-all uppercase text-justify">
              #{id}
            </h1>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>

                {isLoadingData ? <Loading height={4} width={4} /> : null}
              </label>
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered"
                value={name}
                onChange={onChange}
                name="name"
                autoFocus
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select
                className="select select-bordered"
                value={type}
                onChange={onChange}
                name="type"
              >
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
                <option value="income">Income</option>
                <option value="expenditure">Expenditure</option>
                <option value="equity">Equity</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Description"
                maxLength={200}
                value={description}
                onChange={onChange}
                name="description"
              ></textarea>
              <label className="label">
                <span className="label-text-alt">
                  ({description.length}/200)
                </span>
              </label>
            </div>

            <p className="text-red-500 text-sm text-left">{helperText}</p>

            <div className="form-control mt-2">
              <button
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                onClick={handleSubmit}
              >
                {saveButtonLabel}
              </button>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
