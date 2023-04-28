import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import { NORMALIZE_ENTRIES_URL } from "../constants/api";
import authConfig from "../util/authConfig";

export default function NormalizationSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Normalize");
  const [helperText, setHelperText] = useState("");

  const { token } = useSelector((state) => state.auth);

  const handleNormalize = async () => {
    setIsLoading(true);
    axios
      .put(NORMALIZE_ENTRIES_URL, {}, authConfig(token))
      .then(() => {
        setButtonLabel("Normalized 🎉");
        setHelperText("");
      })
      .catch((error) => {
        setHelperText(error.response.data.error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const confirm = async () =>
    confirmAlert({
      title: "Normalize Entries",
      message:
        "Are you sure about normalizing all the entries? Once normalized, your entries cannot be recovered.",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleNormalize(),
        },
        { label: "No" },
      ],
    });

  return (
    <div className="card w-full max-w-sm bg-base-100 mb-8">
      <div className="card-body sm:w-96 w-full">
        <div className="card-title">
          <h1 className="text-2xl font-bold">Normalization</h1>
        </div>

        <p className="text-justify text-xs mt-2">
          The maximum number of entries you can create is 100. Once that limit
          is reached, you can still utilize this application by{" "}
          <i>Normalization</i> of the entries.
        </p>
        <p className="text-justify text-xs">
          Normalization will get rid of all the individual entries, and store
          the current ledger balances into the system. Upon creation of new
          entries, the ledger balance will be computed by taking into account
          the stored normalized balances and as usual, the entries.
        </p>

        <p className="text-justify text-xs">
          <b>Pros :</b>
          <li>
            Use the app even though the limit of 100 entries has been reached.
          </li>
          <li>No loss in accuracy of the balances.</li>
        </p>

        <p className="text-justify text-xs">
          <b>Cons :</b>
          <li>
            Old transaction details won't be displayed in the journal.{" "}
            <i>
              (You can still export a report of all the transaction available at
              that time)
            </i>
          </li>
          <li>
            Activities occurred before normalization will not show up in the
            activity heatmap.
          </li>
        </p>

        <p className="text-justify text-xs">
          <b>Note: </b>It's a good idea to export a report before normalizing
          the accounts, so that you don't lose old transaction details.
        </p>

        <p className="text-red-500 text-sm text-left">{helperText}</p>

        <button
          className={`btn bg-yellow-500 text-white w-full mt-4 ${
            isLoading ? "loading" : ""
          }`}
          onClick={confirm}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
